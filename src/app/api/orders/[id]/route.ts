import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orderRaw, error } = await supabase
    .from("orders")
    .select(
      "*, customer:customers(id, user_id, name, email, phone, address, city, country, postal_code)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!orderRaw) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  const order = orderRaw as Record<string, unknown> & {
    customer: { user_id: string | null } | null;
  };

  // Authorization: customer must match, or user must be admin.
  const orderCustomer = order.customer;

  let isAdmin = false;
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  isAdmin = !!adminRow;

  if (!isAdmin && orderCustomer?.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  return NextResponse.json({ order, items: items ?? [] });
}
