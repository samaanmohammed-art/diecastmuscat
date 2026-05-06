import { NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/invoice";
import { createClient } from "@/lib/supabase/server";
import { fetchAdminOrderById } from "@/lib/admin-db";
import type { Customer, Order, OrderItem } from "@/types/database";

export const dynamic = "force-dynamic";

interface ResolvedOrder {
  order: Order;
  items: OrderItem[];
  customer: Customer;
}

async function resolveOrder(orderId: string): Promise<ResolvedOrder | null> {
  const found = await fetchAdminOrderById(orderId);
  if (!found) return null;

  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", found.customer_id)
    .maybeSingle();
  if (!customer) return null;

  // Strip the AdminOrder enrichments (customer_name, items, image) for the PDF contract
  const order: Order = {
    id: found.id,
    customer_id: found.customer_id,
    total_amount: found.total_amount,
    subtotal: found.subtotal,
    shipping_cost: found.shipping_cost,
    tax_amount: found.tax_amount,
    status: found.status,
    payment_status: found.payment_status,
    payment_id: found.payment_id,
    payment_method: found.payment_method,
    invoice_number: found.invoice_number,
    shipping_address: found.shipping_address,
    notes: found.notes,
    created_at: found.created_at,
    updated_at: found.updated_at,
    shipped_at: found.shipped_at,
    delivered_at: found.delivered_at,
  };
  const items: OrderItem[] = found.items.map((it) => ({
    id: it.id,
    order_id: it.order_id,
    product_id: it.product_id,
    product_name: it.product_name,
    product_sku: it.product_sku,
    quantity: it.quantity,
    price: it.price,
    subtotal: it.subtotal,
    created_at: it.created_at,
  }));
  return { order, items, customer: customer as Customer };
}

async function getRequesterIdentity(): Promise<{
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { userId: null, email: null, isAdmin: false };

    let isAdmin = false;
    try {
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      isAdmin = Boolean(adminRow);
    } catch {
      isAdmin = false;
    }

    return { userId: user.id, email: user.email ?? null, isAdmin };
  } catch {
    return { userId: null, email: null, isAdmin: false };
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const resolved = await resolveOrder(orderId);
  if (!resolved) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Authorization: customer who owns the order, or an admin
  const identity = await getRequesterIdentity();
  if (!identity.userId) {
    return NextResponse.json({ error: "Sign in to download invoices" }, { status: 401 });
  }
  if (!identity.isAdmin) {
    if (
      !identity.email ||
      identity.email.toLowerCase() !== resolved.customer.email.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Not authorised to view this invoice" },
        { status: 403 }
      );
    }
  }

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateInvoicePDF(
      resolved.order,
      resolved.items,
      resolved.customer
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }

  const filename = `invoice-${resolved.order.invoice_number ?? resolved.order.id}.pdf`;

  return new Response(pdfBytes as BlobPart, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
