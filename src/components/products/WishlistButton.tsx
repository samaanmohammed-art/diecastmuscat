"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

export function WishlistButton({
  productId,
  className,
  size = "md",
  withLabel = false,
}: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const ids = useWishlistStore((s) => s.ids);
  const mounted = useMounted();

  const active = mounted && ids.includes(productId);

  const dim = {
    sm: "h-8 w-8 [&>svg]:h-3.5 [&>svg]:w-3.5",
    md: "h-10 w-10 [&>svg]:h-4 [&>svg]:w-4",
    lg: "h-12 w-12 [&>svg]:h-5 [&>svg]:w-5",
  }[size];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-colors",
        "border border-border-strong/60 bg-bg/70 backdrop-blur",
        "hover:border-gold/60 hover:bg-bg/90",
        active && "border-gold/70 bg-gold/15",
        withLabel ? "px-4 h-10 text-xs uppercase tracking-[0.2em]" : dim,
        className
      )}
    >
      <Heart
        className={cn(
          "transition-all",
          active ? "fill-gold text-gold" : "text-text-muted"
        )}
        strokeWidth={1.6}
      />
      {withLabel && (
        <span className={active ? "text-gold" : "text-text-muted"}>
          {active ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
