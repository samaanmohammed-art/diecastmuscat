"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const {
    items,
    subtotal,
    shipping,
    vat,
    total,
    itemCount,
    isEmpty,
    removeItem,
    updateQuantity,
  } = useCart();

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28">
        <div className="flex flex-col items-center text-center gap-5 py-10 sm:py-16">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-border-strong bg-surface-elevated flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-text-dim" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text">
              Your collection is empty
            </h1>
            <p className="text-sm sm:text-base text-text-muted max-w-md mx-auto">
              Curated pieces await. Begin assembling your collection from our selection of
              premium die-cast models.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">Explore the collection</Link>
          </Button>
          <Link
            href="/products?limited=1"
            className="text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-gold transition-colors"
          >
            Or jump to numbered editions →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
      <header className="mb-6 sm:mb-10 lg:mb-14 flex flex-col gap-2 sm:gap-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-gold">
          Your collection
        </span>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-text leading-tight">
          Review your selection
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          {itemCount} {itemCount === 1 ? "piece" : "pieces"} reserved for your consideration
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-14">
        <section className="flex-1 min-w-0">
          <div className="rounded-lg border border-border bg-surface px-4 sm:px-6 lg:px-8">
            {items.map((line) => (
              <CartItem
                key={line.product.id}
                line={line}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Trust band — appears below items on mobile, above summary */}
          <ul className="mt-5 grid grid-cols-2 gap-2 lg:hidden">
            <li className="flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3 py-2.5 text-text-muted">
              <Truck className="h-3.5 w-3.5 text-gold shrink-0" />
              <span className="text-[11px] leading-tight">Insured shipping</span>
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3 py-2.5 text-text-muted">
              <Shield className="h-3.5 w-3.5 text-gold shrink-0" />
              <span className="text-[11px] leading-tight">14-day exchange</span>
            </li>
          </ul>

          <div className="mt-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Continue browsing
              </Link>
            </Button>
          </div>
        </section>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <CartSummary totals={{ subtotal, shipping, vat, total, itemCount }}>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Proceed to checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CartSummary>
          </div>
        </aside>
      </div>
    </div>
  );
}
