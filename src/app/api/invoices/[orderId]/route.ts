import { NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/invoice";
import { MOCK_ORDERS, MOCK_CUSTOMERS } from "@/lib/mock-admin";
import { createClient } from "@/lib/supabase/server";
import type { Customer, Order, OrderItem } from "@/types/database";

export const dynamic = "force-dynamic";

interface ResolvedOrder {
  order: Order;
  items: OrderItem[];
  customer: Customer;
}

function resolveFromMocks(orderId: string): ResolvedOrder | null {
  const found = MOCK_ORDERS.find(
    (o) => o.id === orderId || o.invoice_number === orderId
  );
  if (!found) return null;
  const customer =
    MOCK_CUSTOMERS.find((c) => c.id === found.customer_id) ?? null;
  if (!customer) return null;

  // Strip mock-only props for the PDF generator's typed contract.
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
  const cust: Customer = {
    id: customer.id,
    user_id: customer.user_id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    country: customer.country,
    postal_code: customer.postal_code,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  };
  return { order, items, customer: cust };
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

  const resolved = resolveFromMocks(orderId);
  if (!resolved) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Authorization: any authenticated session that matches the order's
  // customer email, or an admin user, may download. In current mock-only
  // dev mode there is no Supabase project, so we permit when there is no
  // auth context (createClient throws or returns no user).
  const identity = await getRequesterIdentity();
  if (identity.userId && !identity.isAdmin) {
    if (
      identity.email &&
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
