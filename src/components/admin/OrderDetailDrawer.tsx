"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import type { AdminOrder as MockOrder } from "@/lib/admin-db";
import type { OrderStatus } from "@/types/database";

interface OrderDetailDrawerProps {
  order: MockOrder | null;
  onClose: () => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  async function handleUpdate(next: OrderStatus) {
    if (!order) return;
    setStatus(next);
    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  async function handleInvoice() {
    if (!order) return;
    window.open(`/api/orders/${order.id}/invoice`, "_blank");
  }

  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="!max-w-xl w-full overflow-y-auto p-0"
      >
        {order && (
          <>
            <SheetHeader>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
                {order.invoice_number}
              </p>
              <SheetTitle>Order details</SheetTitle>
              <p className="text-xs text-text-muted">
                Placed {formatDate(order.created_at)}
              </p>
            </SheetHeader>

            <div className="px-6 py-6 space-y-8">
              {/* Status */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={status}
                    onChange={(e) => handleUpdate(e.target.value as OrderStatus)}
                    disabled={updating}
                    className="flex-1 h-11 rounded-md border border-input bg-surface px-3 text-sm text-text focus:outline-none focus:border-gold capitalize"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                  <Badge variant="gold" className="capitalize">
                    {order.payment_status}
                  </Badge>
                </div>
                {error && (
                  <p className="mt-2 text-xs text-error">{error}</p>
                )}
              </section>

              {/* Customer */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                  Customer
                </h3>
                <div className="rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm">
                  <div className="text-text">{order.customer_name}</div>
                  <div className="text-text-muted">{order.customer_email}</div>
                  {order.shipping_address?.phone && (
                    <div className="text-text-muted">
                      {order.shipping_address.phone}
                    </div>
                  )}
                </div>
              </section>

              {/* Shipping */}
              {order.shipping_address && (
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                    Shipping address
                  </h3>
                  <address className="not-italic rounded-md border border-border bg-surface-elevated px-4 py-3 text-sm text-text-muted leading-relaxed">
                    <div className="text-text">{order.shipping_address.name}</div>
                    <div>{order.shipping_address.address}</div>
                    <div>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.country}{" "}
                      {order.shipping_address.postal_code}
                    </div>
                  </address>
                </section>
              )}

              {/* Items */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold mb-3">
                  Items
                </h3>
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-surface-elevated p-3"
                    >
                      <div className="relative h-14 w-14 rounded-md overflow-hidden border border-border bg-surface shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.product_name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text truncate">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-text-dim">
                          {item.product_sku} · qty {item.quantity}
                        </div>
                      </div>
                      <div className="font-display text-sm text-gold">
                        {formatCurrencyOMR(item.subtotal)}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Totals */}
              <section className="space-y-2 text-sm">
                <Row label="Subtotal" value={formatCurrencyOMR(order.subtotal)} />
                <Row
                  label="Shipping"
                  value={formatCurrencyOMR(order.shipping_cost)}
                />
                <Row label="Tax" value={formatCurrencyOMR(order.tax_amount)} />
                <Separator />
                <Row
                  label="Total"
                  value={formatCurrencyOMR(order.total_amount)}
                  emphasis
                />
              </section>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleInvoice}
                >
                  <FileText className="h-4 w-4" />
                  Generate invoice
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={emphasis ? "text-text" : "text-text-muted"}>{label}</span>
      <span
        className={
          emphasis
            ? "font-display text-lg text-gold"
            : "text-text"
        }
      >
        {value}
      </span>
    </div>
  );
}
