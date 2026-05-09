"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import type { Product } from "@/types/database";
import { formatCurrencyOMR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "./WishlistButton";
import { QuickView } from "./QuickView";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, className, priority, compact }: ProductCardProps) {
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
        <div className={cn("relative bg-bg overflow-hidden", compact ? "aspect-square" : "aspect-[4/3]")}>
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

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/85 via-bg/30 to-transparent pointer-events-none" />

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

          {product.scale && (
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-sm text-[10px] font-mono bg-black/60 backdrop-blur-sm text-text border border-border-strong">
              {product.scale}
            </div>
          )}
        </div>

        <div className={cn("flex flex-col gap-1.5", compact ? "p-3" : "p-4 sm:p-5")}>
          {product.brand && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim line-clamp-1">
              {product.brand}
            </span>
          )}
          <h3
            className={cn(
              "font-display leading-tight text-text group-hover:text-gold transition-colors line-clamp-1",
              compact ? "text-sm" : "text-base sm:text-lg"
            )}
          >
            {product.name}
          </h3>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className={cn("font-semibold text-text", compact ? "text-sm" : "text-base")}>
              {formatCurrencyOMR(product.price)}
            </p>
            {product.review_count > 0 && (
              <span className="text-[11px] text-text-muted shrink-0">
                ★ {product.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-2.5 right-2.5">
        <WishlistButton productId={product.id} size="sm" />
      </div>

      {!outOfStock && (
        <QuickView product={product}>
          <button
            type="button"
            className={cn(
              "absolute top-2.5 right-12",
              "inline-flex items-center justify-center h-8 w-8 sm:w-auto sm:px-3 sm:gap-1.5 rounded-full",
              "border border-border-strong/60 bg-bg/70 backdrop-blur",
              "text-[10px] uppercase tracking-[0.22em] text-text-muted",
              "hover:border-gold/60 hover:text-gold transition-colors",
              "sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-200"
            )}
            aria-label={`Quick view: ${product.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quick</span>
          </button>
        </QuickView>
      )}
    </motion.div>
  );
}

function PlaceholderArt({ category }: { category: string }) {
  const icon = { cars: "▲", planes: "△", trucks: "▼", bikes: "◆" }[category] ?? "◇";
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-elevated to-bg">
      <span className="text-7xl opacity-10 text-gold font-display">{icon}</span>
    </div>
  );
}

export function ProductCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="rounded-lg overflow-hidden bg-surface border border-border">
      <div className={cn("skeleton", compact ? "aspect-square" : "aspect-[4/3]")} />
      <div className={cn("flex flex-col gap-2", compact ? "p-3" : "p-5")}>
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-20 skeleton rounded mt-1" />
      </div>
    </div>
  );
}
