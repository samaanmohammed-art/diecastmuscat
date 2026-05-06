"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
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
      <div className="container mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="flex flex-col items-center text-center gap-6 py-16">
          <div className="h-24 w-24 rounded-full border border-border-strong bg-surface-elevated flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-text-dim" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl lg:text-4xl text-text">
              Your collection is empty
            </h1>
            <p className="text-text-muted max-w-md mx-auto">
              Curated pieces await. Begin assembling your collection from our
              selection of premium die-cast models.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/products">Explore the collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <header className="mb-10 lg:mb-14 flex flex-col gap-3">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
          Your collection
        </span>
        <h1 className="font-display text-4xl lg:text-5xl text-text">
          Review your selection
        </h1>
        <p className="text-text-muted">
          {itemCount} {itemCount === 1 ? "piece" : "pieces"} reserved for your
          consideration.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        <section className="flex-1">
          <div className="rounded-lg border border-border bg-surface px-6 lg:px-8">
            {items.map((line) => (
              <CartItem
                key={line.product.id}
                line={line}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
          </div>
        </section>

        <aside className="lg:w-96 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <CartSummary
              totals={{ subtotal, shipping, vat, total, itemCount }}
            >
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
