import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCertificatePDF } from "@/lib/certificate";
import type { Customer, Order, OrderItem } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to download certificates" }, { status: 401 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, customer:customers(*)")
    .eq("id", orderId)
    .maybeSingle<Order & { customer: Customer | null }>();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Verify ownership
  const customerRecord = order.customer;
  if (!customerRecord || customerRecord.user_id !== user.id) {
    // Allow admins
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!adminRow) {
      return NextResponse.json({ error: "Not authorised" }, { status: 403 });
    }
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  const orderItems: OrderItem[] = (items ?? []) as OrderItem[];
  if (orderItems.length === 0) {
    return NextResponse.json({ error: "No items found for this order" }, { status: 404 });
  }

  // Generate one certificate per item, merged into a single PDF via separate pages
  const { PDFDocument } = await import("pdf-lib");
  const mergedDoc = await PDFDocument.create();

  const customer = customerRecord ?? {
    id: "",
    user_id: user.id,
    email: user.email ?? "",
    name: user.email ?? "Collector",
    phone: null,
    address: null,
    city: null,
    country: "Oman",
    postal_code: null,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };

  for (let i = 0; i < orderItems.length; i++) {
    const itemPdfBytes = await generateCertificatePDF(
      order as Order,
      orderItems[i],
      customer as Customer,
      i
    );
    const itemDoc = await PDFDocument.load(itemPdfBytes);
    const [copiedPage] = await mergedDoc.copyPages(itemDoc, [0]);
    mergedDoc.addPage(copiedPage);
  }

  const pdfBytes = await mergedDoc.save();
  const filename = `certificate-${order.invoice_number ?? orderId.slice(0, 8)}.pdf`;

  return new Response(pdfBytes as BlobPart, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
