import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const productId = sp.get("productId");
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const limit = 8;

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("reviews")
    .select("*, customer:customers(name)", { count: "exact" })
    .eq("product_id", productId)
    .order("is_verified_purchase", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const reviews = (data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: row.id,
      product_id: row.product_id,
      customer_id: row.customer_id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      is_verified_purchase: row.is_verified_purchase,
      created_at: row.created_at,
      customer_name: (row.customer as { name: string } | null)?.name ?? null,
    };
  });

  return NextResponse.json({ reviews, total: count ?? 0, page });
}

const postSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { productId, rating, title, comment } = parsed.data;

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!customer) {
    return NextResponse.json(
      { error: "Customer profile not found. Complete your account setup first." },
      { status: 404 }
    );
  }

  const customerId = (customer as { id: string }).id;

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this product." },
      { status: 409 }
    );
  }

  // Verified purchase: check for a delivered order containing this product
  const { data: deliveredOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "delivered");

  const orderIds = ((deliveredOrders ?? []) as Array<{ id: string }>).map((o) => o.id);

  let isVerifiedPurchase = false;
  if (orderIds.length > 0) {
    const { data: orderItem } = await supabase
      .from("order_items")
      .select("id")
      .eq("product_id", productId)
      .in("order_id", orderIds)
      .maybeSingle();
    isVerifiedPurchase = !!orderItem;
  }

  const reviewPayload = {
    product_id: productId,
    customer_id: customerId,
    rating,
    title: title ?? null,
    comment,
    is_verified_purchase: isVerifiedPurchase,
  } satisfies Database["public"]["Tables"]["reviews"]["Insert"];
  // @ts-expect-error Supabase generic can't thread hand-written Insert type through createServerClient
  const { error: insertError } = await supabase.from("reviews").insert(reviewPayload);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Update product rating aggregate
  const { data: allRatings } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (allRatings && allRatings.length > 0) {
    const rows = allRatings as Array<{ rating: number }>;
    const avg = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;
    const ratingUpdate = {
      rating: Math.round(avg * 10) / 10,
      review_count: rows.length,
    } satisfies Database["public"]["Tables"]["products"]["Update"];
    // @ts-expect-error Supabase generic can't thread hand-written Update type through createServerClient
    await supabase.from("products").update(ratingUpdate).eq("id", productId);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
