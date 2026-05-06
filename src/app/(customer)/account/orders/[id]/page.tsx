import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  CheckCircle2,
  CircleDashed,
  Download,
  HelpCircle,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyOMR, formatDate, cn } from "@/lib/utils";
import type {
  Order,
  OrderItem,
  OrderStatus,
  ShippingAddress,
} from "@/types/database";

export const metadata: Metadata = {
  title: "Order details",
};

const STATUS_VARIANT: Record<OrderStatus, "warning" | "gold" | "success" | "error" | "default"> = {
  pending: "warning",
  processing: "warning",
  shipped: "gold",
  delivered: "success",
  cancelled: "error",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TRACKER_STEPS: Array<{ key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "pending", label: "Pending", icon: CircleDashed },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function trackerProgress(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return TRACKER_STEPS.findIndex((s) => s.key === status);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/orders/${id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("*, customer:customers(user_id, name, email, phone)")
    .eq("id", id)
    .maybeSingle<Order & { customer: { user_id: string; name: string; email: string; phone: string | null } | null }>();

  if (!order) notFound();
  if (order.customer && order.customer.user_id !== user.id) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  const orderItems: OrderItem[] = (items ?? []) as OrderItem[];
  const shipping = order.shipping_address as ShippingAddress | null;
  const progressIndex = trackerProgress(order.status);

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <Link
        href="/account/orders"
        className="text-[11px] uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors inline-block mb-6"
      >
        ← All orders
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-6 mb-10">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
            Order
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-text mt-1">
            {order.invoice_number ?? `#${order.id.slice(0, 8)}`}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Placed {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <Badge variant={STATUS_VARIANT[order.status]}>
            {STATUS_LABEL[order.status]}
          </Badge>
          <p className="font-display text-2xl text-gold">
            {formatCurrencyOMR(order.total_amount)}
          </p>
        </div>
      </header>

      {/* Status tracker */}
      {order.status !== "cancelled" && (
        <div className="rounded-xl border border-border bg-surface p-6 lg:p-8 mb-8">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-text-muted mb-6">
            Order progress
          </h2>
          <ol className="flex items-start justify-between gap-2 relative">
            <div
              className="absolute top-5 left-5 right-5 h-px bg-border"
              aria-hidden
            />
            {TRACKER_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const completed = idx <= progressIndex;
              const current = idx === progressIndex;
              return (
                <li
                  key={step.key}
                  className="relative flex flex-col items-center gap-2 flex-1 min-w-0"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors bg-surface relative z-10",
                      completed
                        ? "border-gold bg-gold text-black"
                        : "border-border text-text-dim",
                      current && "shadow-[0_0_24px_rgba(212,175,55,0.35)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.18em] text-center",
                      completed ? "text-gold" : "text-text-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-lg text-text">Items</h2>
              <span className="text-xs text-text-muted">
                {orderItems.length}{" "}
                {orderItems.length === 1 ? "piece" : "pieces"}
              </span>
            </div>
            <div className="divide-y divide-border">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 p-5"
                >
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-display text-sm text-text">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      SKU {item.product_sku}
                    </p>
                  </div>
                  <p className="text-sm text-text-muted whitespace-nowrap">
                    {formatCurrencyOMR(item.price)} × {item.quantity}
                  </p>
                  <p className="font-display text-sm text-gold whitespace-nowrap min-w-[80px] text-right">
                    {formatCurrencyOMR(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-6 py-5 bg-surface-elevated/40">
              <div className="ml-auto max-w-xs flex flex-col gap-2 text-sm">
                <Row
                  label="Subtotal"
                  value={formatCurrencyOMR(order.subtotal)}
                />
                <Row
                  label="Shipping"
                  value={
                    order.shipping_cost === 0
                      ? "Free"
                      : formatCurrencyOMR(order.shipping_cost)
                  }
                />
                <Row
                  label="VAT"
                  value={formatCurrencyOMR(order.tax_amount)}
                />
                <div className="h-px bg-border my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    Total
                  </span>
                  <span className="font-display text-lg text-gold">
                    {formatCurrencyOMR(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild variant="outline">
              <a
                href={`/api/invoices/${order.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="h-4 w-4" />
                Download invoice
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">
                <HelpCircle className="h-4 w-4" />
                Need help?
              </Link>
            </Button>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-4">
              Shipping address
            </h2>
            {shipping ? (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gold/70 mt-0.5 shrink-0" />
                <div className="text-text-muted leading-relaxed">
                  <p className="text-text">{shipping.name}</p>
                  <p>{shipping.phone}</p>
                  <p className="mt-2">{shipping.address}</p>
                  <p>
                    {[shipping.city, shipping.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{shipping.country}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No shipping address on file.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg text-text mb-4">
              Payment
            </h2>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Method</dt>
                <dd className="text-text capitalize">
                  {(order.payment_method ?? "—").replace("_", " ")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Status</dt>
                <dd className="text-text capitalize">
                  {order.payment_status}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span className="text-text">{value}</span>
    </div>
  );
}
