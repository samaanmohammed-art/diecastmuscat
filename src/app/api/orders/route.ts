import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateInvoiceNumber } from "@/lib/utils";
import { getProductById as getSampleProductById } from "@/lib/sample-products";
import {
  SHIPPING_FREE_THRESHOLD_OMR,
  SHIPPING_FLAT_OMR,
  VAT_RATE,
} from "@/hooks/useCart";
import type {
  OrderInsert,
  OrderStatus,
  PaymentStatus,
  Product,
} from "@/types/database";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const orderItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().min(8),
  }),
  shipping_address: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    postal_code: z.string().min(3),
  }),
  payment_method: z.enum(["cod", "bank_transfer", "card"]),
  notes: z.string().optional().default(""),
  items: z.array(orderItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: customerRaw } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  const customer = customerRaw as { id: string } | null;

  if (!customer) {
    return NextResponse.json({ orders: [], total: 0, page: 1 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: orders, count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: orders ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Resolve products from DB; fall back to sample data when DB row missing.
  const productIds = input.items.map((i) => i.product_id);
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const resolvedProducts = new Map<string, Product>();
  for (const p of (dbProducts ?? []) as Product[]) resolvedProducts.set(p.id, p);
  for (const id of productIds) {
    if (!resolvedProducts.has(id)) {
      const sample = getSampleProductById(id);
      if (sample) resolvedProducts.set(id, sample);
    }
  }

  // Validate availability and compute totals server-side.
  let subtotal = 0;
  const lineItems: Array<{
    product_id: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    price: number;
    subtotal: number;
  }> = [];

  for (const item of input.items) {
    const product = resolvedProducts.get(item.product_id);
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${item.product_id}` },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
        },
        { status: 400 }
      );
    }
    const lineSubtotal = +(product.price * item.quantity).toFixed(3);
    subtotal += lineSubtotal;
    lineItems.push({
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
      quantity: item.quantity,
      price: product.price,
      subtotal: lineSubtotal,
    });
  }

  subtotal = +subtotal.toFixed(3);
  const shippingCost =
    subtotal >= SHIPPING_FREE_THRESHOLD_OMR ? 0 : SHIPPING_FLAT_OMR;
  const taxAmount = +(subtotal * VAT_RATE).toFixed(3);
  const totalAmount = +(subtotal + shippingCost + taxAmount).toFixed(3);

  // Upsert customer record.
  const customerPayload = {
    user_id: user.id,
    email: input.customer.email,
    name: input.customer.name,
    phone: input.customer.phone,
    address: input.shipping_address.address,
    city: input.shipping_address.city,
    country: input.shipping_address.country,
    postal_code: input.shipping_address.postal_code,
  };
  const { data: customerRow, error: customerErr } = await supabase
    .from("customers")
    .upsert(customerPayload as never, { onConflict: "user_id" })
    .select("id")
    .single();
  const customer = customerRow as { id: string } | null;

  if (customerErr || !customer) {
    return NextResponse.json(
      { error: customerErr?.message ?? "Unable to create customer" },
      { status: 500 }
    );
  }

  const orderInsert: OrderInsert = {
    customer_id: customer.id,
    total_amount: totalAmount,
    subtotal,
    shipping_cost: shippingCost,
    tax_amount: taxAmount,
    status: "pending" as OrderStatus,
    payment_status: "pending" as PaymentStatus,
    payment_id: null,
    payment_method: input.payment_method,
    invoice_number: generateInvoiceNumber(),
    shipping_address: input.shipping_address,
    notes: input.notes ?? null,
  };

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert(orderInsert as never)
    .select("*")
    .single();
  const order = orderRow as { id: string } | null;

  if (orderErr || !order) {
    return NextResponse.json(
      { error: orderErr?.message ?? "Unable to create order" },
      { status: 500 }
    );
  }

  // Insert order items.
  const orderItemRows = lineItems.map((li) => ({
    order_id: order.id,
    product_id: li.product_id,
    product_name: li.product_name,
    product_sku: li.product_sku,
    quantity: li.quantity,
    price: li.price,
    subtotal: li.subtotal,
  }));
  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(orderItemRows as never);

  if (itemsErr) {
    // Roll back the order if items failed.
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  // Decrement product stock — best-effort per item.
  await Promise.all(
    lineItems.map(async (li) => {
      const product = resolvedProducts.get(li.product_id);
      if (!product) return;
      const newStock = Math.max(0, product.stock - li.quantity);
      await supabase
        .from("products")
        .update({ stock: newStock } as never)
        .eq("id", li.product_id);
    })
  );

  return NextResponse.json({ order }, { status: 201 });
}
