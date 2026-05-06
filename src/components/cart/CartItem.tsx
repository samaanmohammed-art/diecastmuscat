"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyOMR } from "@/lib/utils";
import type { CartLine } from "@/stores/cart";

interface CartItemProps {
  line: CartLine;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItem({ line, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity } = line;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-5 py-6 border-b border-border last:border-0">
      <Link
        href={`/products/${product.id}`}
        className="relative h-32 w-full sm:h-32 sm:w-32 shrink-0 rounded-md overflow-hidden bg-surface-elevated border border-border"
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-dim text-xs">
            No image
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {product.brand && (
          <span className="text-[10px] uppercase tracking-[0.22em] text-text-dim">
            {product.brand}
          </span>
        )}
        <Link
          href={`/products/${product.id}`}
          className="font-display text-lg leading-tight text-text hover:text-gold transition-colors"
        >
          {product.name}
        </Link>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.scale && <Badge variant="outline">{product.scale}</Badge>}
          {product.is_limited_edition && (
            <Badge variant="gold">Limited Edition</Badge>
          )}
        </div>
        <p className="text-xs text-text-muted mt-1">
          {product.stock > 5
            ? "In stock"
            : product.stock > 0
            ? `Only ${product.stock} remaining`
            : "Out of stock"}
        </p>
      </div>

      <div className="flex sm:flex-col sm:items-end justify-between gap-3 sm:min-w-[140px]">
        <div className="flex items-center gap-1 border border-border rounded-md">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="h-9 w-9 inline-flex items-center justify-center text-text-muted hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="h-9 w-9 inline-flex items-center justify-center text-text-muted hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex sm:flex-col items-end gap-2">
          <p className="text-base font-semibold text-gold whitespace-nowrap">
            {formatCurrencyOMR(lineTotal)}
          </p>
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="inline-flex items-center gap-1 text-xs text-text-dim hover:text-error transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
