"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/types/database";
import { useCartStore } from "@/stores/cart";
import { formatCurrencyOMR, cn } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton";

interface StickyPDPBarProps {
  product: Product;
}

export function StickyPDPBar({ product }: StickyPDPBarProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const max = Math.max(1, product.stock);

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className="lg:hidden fixed inset-x-0 z-30 bg-bg/95 backdrop-blur-xl border-t border-border-strong"
      style={{
        bottom: "calc(4rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="px-3 sm:px-4 py-3 flex items-center gap-2">
        <WishlistButton productId={product.id} size="md" className="shrink-0 h-12 w-12" />

        <div className="inline-flex items-center rounded-full border border-border-strong bg-surface shrink-0">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={outOfStock || qty <= 1}
            className="flex h-12 w-10 items-center justify-center text-text-muted disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center font-mono text-sm">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={outOfStock || qty >= max}
            className="flex h-12 w-10 items-center justify-center text-text-muted disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold transition-colors",
            justAdded
              ? "bg-success text-bg"
              : outOfStock
              ? "bg-surface-elevated text-text-dim"
              : "bg-gold text-bg hover:bg-gold-bright shadow-[0_15px_50px_-15px_rgba(212,175,55,0.65)]"
          )}
          aria-label={outOfStock ? "Sold out" : "Add to cart"}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : outOfStock ? (
            "Sold out"
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span className="truncate">{formatCurrencyOMR(product.price * qty)}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
