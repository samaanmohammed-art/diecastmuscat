import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Track and review your orders with Diecast Muscat.",
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

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data: customerRaw } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  const customer = customerRaw as { id: string } | null;

  let orders: Order[] = [];
  if (customer) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });
    orders = (data ?? []) as Order[];
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <header className="mb-10 lg:mb-14 flex flex-col gap-3">
        <Link
          href="/account"
          className="text-[11px] uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors w-fit"
        >
          ← Account
        </Link>
        <h1 className="font-display text-4xl lg:text-5xl text-text">
          Your orders
        </h1>
        <p className="text-text-muted">
          A complete history of your collection.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-full border border-border-strong bg-surface-elevated flex items-center justify-center">
            <Package className="h-6 w-6 text-text-dim" />
          </div>
          <div>
            <p className="font-display text-lg text-text">No orders yet</p>
            <p className="text-sm text-text-muted mt-1">
              When you place your first order it will appear here.
            </p>
          </div>
          <Button asChild>
            <Link href="/products">Explore the collection</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Desktop table */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="border-b border-border bg-surface-elevated">
                <Th>Invoice</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th align="right">Total</Th>
                <Th align="right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-surface-elevated/40 transition-colors"
                >
                  <Td>
                    <span className="font-display text-sm text-text">
                      {order.invoice_number ?? `#${order.id.slice(0, 8)}`}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-sm text-text-muted">
                      {formatDate(order.created_at)}
                    </span>
                  </Td>
                  <Td>
                    <Badge variant={STATUS_VARIANT[order.status]}>
                      {STATUS_LABEL[order.status]}
                    </Badge>
                  </Td>
                  <Td align="right">
                    <span className="font-display text-sm text-gold">
                      {formatCurrencyOMR(order.total_amount)}
                    </span>
                  </Td>
                  <Td align="right">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold inline-flex items-center gap-1 transition-colors"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-col gap-2 p-5 hover:bg-surface-elevated/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm text-text">
                    {order.invoice_number ?? `#${order.id.slice(0, 8)}`}
                  </p>
                  <Badge variant={STATUS_VARIANT[order.status]}>
                    {STATUS_LABEL[order.status]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="font-display text-sm text-gold">
                    {formatCurrencyOMR(order.total_amount)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-text-muted font-medium ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td className={`px-6 py-4 ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </td>
  );
}
