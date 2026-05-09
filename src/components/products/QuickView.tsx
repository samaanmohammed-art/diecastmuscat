"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type { Product } from "@/types/database";
import { useCartStore } from "@/stores/cart";
import { formatCurrencyOMR, cn } from "@/lib/utils";
import { WishlistButton } from "./WishlistButton";
import { Badge } from "@/components/ui/badge";

interface QuickViewProps {
  product: Product;
  children: React.ReactNode;
}

export function QuickView({ product, children }: QuickViewProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="fixed inset-x-0 bottom-0 sm:inset-0 sm:m-auto sm:max-w-2xl sm:max-h-[88vh] sm:rounded-xl z-[70] bg-bg border-t sm:border border-border-strong overflow-hidden flex flex-col"
                style={{
                  maxHeight: "92dvh",
                }}
              >
                <QuickViewBody product={product} onClose={() => setOpen(false)} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function QuickViewBody({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;
  const max = Math.max(1, product.stock);
  const image = product.images?.[0];
  const features = formatFeatures(product.features).slice(0, 4);

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, qty);
    onClose();
  };

  return (
    <>
      {/* Pull handle on mobile */}
      <div className="sm:hidden pt-2 pb-1 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-border-strong" />
      </div>

      <Dialog.Title className="sr-only">{product.name}</Dialog.Title>
      <Dialog.Description className="sr-only">
        Quick view of {product.name}
      </Dialog.Description>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg/70 backdrop-blur border border-border-strong text-text-muted hover:text-text"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col sm:flex-row min-h-0 flex-1 overflow-y-auto">
        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-auto sm:w-[55%] shrink-0 bg-surface-elevated">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 55vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-elevated to-bg">
              <span className="text-7xl opacity-10 text-gold font-display">◇</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_limited_edition && (
              <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                <Sparkles className="h-3 w-3" /> Limited
              </Badge>
            )}
            {outOfStock && (
              <Badge variant="error" className="text-[10px] uppercase tracking-[0.18em]">
                Sold out
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2">
            {product.scale && (
              <span className="px-2 py-1 rounded-sm text-[10px] font-mono bg-black/60 backdrop-blur-sm text-text border border-border-strong">
                {product.scale}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 p-5 sm:p-7 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.brand && (
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
                  {product.brand}
                </p>
              )}
              <h2 className="font-display text-xl sm:text-2xl leading-tight text-text mt-1.5 line-clamp-2">
                {product.name}
              </h2>
            </div>
            <div className="shrink-0 mt-0.5 mr-7 sm:mr-0">
              <WishlistButton productId={product.id} size="md" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl sm:text-3xl text-gold">
              {formatCurrencyOMR(product.price)}
            </span>
            <span className="text-[10px] text-text-dim uppercase tracking-[0.2em]">
              Inclusive of VAT
            </span>
          </div>

          {product.description && (
            <p className="mt-4 text-sm text-text-muted leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}

          {features.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="text-[11px] text-text-muted flex items-start gap-1.5"
                >
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-gold shrink-0" />
                  <span className="truncate">{f}</span>
                </li>
              ))}
            </ul>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-gold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Only {product.stock} on the shelf
            </p>
          )}

          {/* Add controls — pinned to bottom on mobile */}
          <div className="mt-5 sm:mt-auto pt-5 border-t border-border flex items-stretch gap-2">
            <div className="inline-flex items-center rounded-md border border-border-strong bg-surface shrink-0">
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

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={cn(
                "flex-1 h-12 rounded-md flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold transition-colors",
                outOfStock
                  ? "bg-surface-elevated text-text-dim"
                  : "bg-gold text-bg hover:bg-gold-bright"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              {outOfStock ? "Sold out" : "Add to bag"}
            </button>
          </div>

          <Link
            href={`/products/${product.id}`}
            onClick={onClose}
            className="mt-3 inline-flex items-center justify-center gap-1.5 h-10 text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-gold transition-colors"
          >
            View full details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function formatFeatures(features: Record<string, unknown>): string[] {
  if (!features || typeof features !== "object") return [];
  return Object.entries(features).map(([key, value]) => {
    const label = key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    if (typeof value === "boolean") return value ? label : `${label} (no)`;
    return `${label}: ${String(value)}`;
  });
}
