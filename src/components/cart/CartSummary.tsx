"use client";

import { formatCurrencyOMR } from "@/lib/utils";
import { SHIPPING_FREE_THRESHOLD_OMR, type CartTotals } from "@/hooks/useCart";

interface CartSummaryProps {
  totals: CartTotals;
  /** Optional content rendered below the totals (e.g. checkout button) */
  children?: React.ReactNode;
  /** Render a compact, inline summary (used inside checkout review) */
  compact?: boolean;
}

export function CartSummary({ totals, children, compact = false }: CartSummaryProps) {
  const { subtotal, shipping, vat, total } = totals;
  const remainingForFreeShipping = Math.max(
    0,
    SHIPPING_FREE_THRESHOLD_OMR - subtotal
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-2 text-sm">
        <Row label="Subtotal" value={formatCurrencyOMR(subtotal)} />
        <Row
          label="Shipping"
          value={shipping === 0 ? "Free" : formatCurrencyOMR(shipping)}
          muted={shipping === 0}
        />
        <Row label="VAT (5%)" value={formatCurrencyOMR(vat)} />
        <div className="h-px bg-border my-1" />
        <Row
          label="Total"
          value={formatCurrencyOMR(total)}
          emphasis
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6 lg:p-7 flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl text-text">Order summary</h2>
        <p className="text-xs text-text-muted mt-1">
          Final pricing confirmed at checkout.
        </p>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <Row label="Subtotal" value={formatCurrencyOMR(subtotal)} />
        <Row
          label="Shipping"
          value={shipping === 0 ? "Free" : formatCurrencyOMR(shipping)}
          muted={shipping === 0}
        />
        <Row label="Oman VAT (5%)" value={formatCurrencyOMR(vat)} />
      </div>

      {remainingForFreeShipping > 0 && subtotal > 0 && (
        <div className="rounded-md border border-gold/20 bg-gold/5 px-3 py-2.5 text-[11px] text-gold/90">
          Add {formatCurrencyOMR(remainingForFreeShipping)} more to qualify for
          complimentary shipping.
        </div>
      )}

      <div className="h-px bg-border" />

      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
          Total
        </span>
        <span className="font-display text-2xl text-gold">
          {formatCurrencyOMR(total)}
        </span>
      </div>

      {children}

      <p className="text-[11px] leading-relaxed text-text-dim">
        Taxes and duties calculated based on delivery within Oman. Free shipping
        on orders over {formatCurrencyOMR(SHIPPING_FREE_THRESHOLD_OMR)}.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
  emphasis = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          emphasis
            ? "text-xs uppercase tracking-[0.18em] text-text-muted"
            : "text-text-muted"
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis
            ? "font-display text-lg text-gold"
            : muted
            ? "text-success"
            : "text-text"
        }
      >
        {value}
      </span>
    </div>
  );
}
