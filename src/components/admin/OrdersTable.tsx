"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import { OrderDetailDrawer } from "@/components/admin/OrderDetailDrawer";
import type { AdminOrder as MockOrder } from "@/lib/admin-db";
import type { OrderStatus, PaymentStatus } from "@/types/database";

interface OrdersTableProps {
  orders: MockOrder[];
}

const STATUS_FILTERS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "gold" | "success" | "warning" | "error"
> = {
  pending: "warning",
  processing: "gold",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
};

const PAYMENT_VARIANT: Record<
  PaymentStatus,
  "default" | "gold" | "success" | "warning" | "error"
> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "default",
};

const PAGE_SIZE = 10;

export function OrdersTable({ orders }: OrdersTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [page, setPage] = useState(1);
  const [activeOrder, setActiveOrder] = useState<MockOrder | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!q) return true;
      return (
        (o.invoice_number?.toLowerCase().includes(q) ?? false) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      );
    });
  }, [orders, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search invoice or customer"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | OrderStatus);
            setPage(1);
          }}
          className="h-11 rounded-md border border-input bg-surface px-3 text-sm text-text focus:outline-none focus:border-gold md:ml-auto"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated text-left text-[10px] uppercase tracking-[0.18em] text-text-muted">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slice.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setActiveOrder(o)}
                  className="cursor-pointer hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text">
                    {o.invoice_number}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-text">{o.customer_name}</div>
                    <div className="text-xs text-text-dim">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[o.status]}>
                      <span className="capitalize">{o.status}</span>
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PAYMENT_VARIANT[o.payment_status]}>
                      <span className="capitalize">{o.payment_status}</span>
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-display text-gold">
                    {formatCurrencyOMR(o.total_amount)}
                  </td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Page <span className="text-text">{safePage}</span> of {pages} ·{" "}
            {filtered.length} orders
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="h-9 px-4 rounded-md border border-border-strong text-xs uppercase tracking-[0.14em] text-text-muted hover:text-gold hover:border-gold-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={safePage >= pages}
              className="h-9 px-4 rounded-md border border-border-strong text-xs uppercase tracking-[0.14em] text-text-muted hover:text-gold hover:border-gold-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <OrderDetailDrawer
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />
    </div>
  );
}
