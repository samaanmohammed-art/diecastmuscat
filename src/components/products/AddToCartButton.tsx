"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/database";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;
  const max = Math.max(1, product.stock);

  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => Math.min(max, q + 1));

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, qty);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-stretch gap-3">
        {/* Quantity selector */}
        <div className="inline-flex items-center rounded-md border border-border-strong bg-surface">
          <button
            type="button"
            onClick={decrement}
            disabled={outOfStock || qty <= 1}
            className="flex h-14 w-12 items-center justify-center text-text-muted hover:text-gold disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex h-14 w-12 items-center justify-center font-mono text-base text-text border-x border-border">
            {qty}
          </div>
          <button
            type="button"
            onClick={increment}
            disabled={outOfStock || qty >= max}
            className="flex h-14 w-12 items-center justify-center text-text-muted hover:text-gold disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add button */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex-1"
        >
          <Button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            size="xl"
            className="w-full uppercase tracking-[0.18em] text-xs"
          >
            <ShoppingBag className="h-4 w-4" />
            {outOfStock ? "Sold out" : "Add to collection"}
          </Button>
        </motion.div>
      </div>

      {!outOfStock && product.stock <= 5 && (
        <p className="text-xs text-text-muted">
          <span className="text-gold">Only {product.stock}</span> remaining in our vault.
        </p>
      )}
    </div>
  );
}
