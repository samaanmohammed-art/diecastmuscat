"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/database";
import { formatCurrencyOMR, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images?.[0] ?? null;
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden",
        "bg-surface border border-border hover:border-gold-muted",
        "transition-colors duration-200",
        className
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] bg-bg overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderArt category={product.category} />
          )}

          {/* Badges layer */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_limited_edition && (
              <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                Limited
              </Badge>
            )}
            {outOfStock && (
              <Badge variant="error" className="text-[10px] uppercase tracking-[0.18em]">
                Sold out
              </Badge>
            )}
          </div>

          {/* Scale chip */}
          {product.scale && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-sm text-[10px] font-mono bg-black/60 backdrop-blur-sm text-text border border-border-strong">
              {product.scale}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col gap-1.5">
          {product.brand && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
              {product.brand}
            </span>
          )}
          <h3 className="font-display text-lg leading-tight text-text group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-base font-semibold text-text">
              {formatCurrencyOMR(product.price)}
            </p>
            {product.review_count > 0 && (
              <span className="text-xs text-text-muted">
                {product.rating.toFixed(1)} · {product.review_count} reviews
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick add */}
      <button
        onClick={() => !outOfStock && addItem(product, 1)}
        disabled={outOfStock}
        className={cn(
          "absolute bottom-5 right-5 h-10 w-10 rounded-full flex items-center justify-center",
          "bg-gold text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
          "transition-all duration-200 shadow-glow",
          "disabled:bg-surface-elevated disabled:text-text-dim disabled:opacity-30 disabled:translate-y-0"
        )}
        aria-label="Add to cart"
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function PlaceholderArt({ category }: { category: string }) {
  const icon = { cars: "🚗", planes: "✈️", trucks: "🚚", bikes: "🏍️" }[category] ?? "•";
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-elevated to-bg">
      <span className="text-7xl opacity-20 grayscale">{icon}</span>
    </div>
  );
}
