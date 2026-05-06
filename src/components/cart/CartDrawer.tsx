"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, cartSelectors } from "@/stores/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCurrencyOMR } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle>Your Collection ({items.length})</SheetTitle>
          <p className="text-xs text-text-muted">Items reserved while you decide.</p>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart onClose={closeCart} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-4 border-b border-border last:border-0"
                >
                  <Link
                    href={`/products/${product.id}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-surface-elevated border border-border"
                  >
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">
                        {{ cars: "🚗", planes: "✈️", trucks: "🚚", bikes: "🏍️" }[product.category] ?? "•"}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    {product.brand && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                        {product.brand}
                      </span>
                    )}
                    <p className="font-display text-sm leading-snug truncate">{product.name}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-7 w-7 inline-flex items-center justify-center text-text-muted hover:text-gold transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="h-7 w-7 inline-flex items-center justify-center text-text-muted hover:text-gold disabled:opacity-30 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-gold">
                        {formatCurrencyOMR(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="h-7 w-7 shrink-0 inline-flex items-center justify-center text-text-dim hover:text-error transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Subtotal</span>
                <span className="text-xl font-display text-gold">
                  {formatCurrencyOMR(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-text-dim mb-2">
                Shipping and VAT calculated at checkout.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout" onClick={closeCart}>
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/cart" onClick={closeCart}>
                  View full cart
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
      <div className="h-20 w-20 rounded-full border border-border-strong flex items-center justify-center bg-surface-elevated">
        <ShoppingBag className="h-8 w-8 text-text-dim" />
      </div>
      <div>
        <p className="font-display text-xl mb-1">Your collection is empty</p>
        <p className="text-sm text-text-muted">Curated pieces await — start exploring.</p>
      </div>
      <Button asChild>
        <Link href="/products" onClick={onClose}>
          Browse models
        </Link>
      </Button>
    </div>
  );
}
