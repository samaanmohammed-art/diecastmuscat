"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlistStore, wishlistSelectors } from "@/stores/wishlist";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";

export function WishlistCard() {
  const count = useWishlistStore(wishlistSelectors.count);
  const ids = useWishlistStore((s) => s.ids);
  const mounted = useMounted();

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-lg sm:text-xl text-text">Wishlist</h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {mounted && count > 0
              ? `${count} ${count === 1 ? "piece" : "pieces"} saved`
              : "Pieces you've saved for later."}
          </p>
        </div>
        {mounted && count > 0 && (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold">
            <Heart className="h-4 w-4 fill-gold" />
          </span>
        )}
      </div>

      {!mounted || count === 0 ? (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div className="h-12 w-12 rounded-full border border-border bg-surface-elevated flex items-center justify-center">
            <Heart className="h-5 w-5 text-text-dim" />
          </div>
          <div>
            <p className="font-display text-base text-text">No saved pieces</p>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5 max-w-xs">
              Tap the heart on any piece to keep it for later.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">Explore</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <ul className="grid grid-cols-3 gap-2">
            {ids.slice(0, 6).map((id) => (
              <li
                key={id}
                className="aspect-square rounded-md bg-surface-elevated border border-border flex items-center justify-center font-mono text-[9px] text-text-dim p-1 text-center break-all"
              >
                {id.slice(0, 6)}
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border-strong text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold hover:border-gold/40 transition-colors"
          >
            Continue browsing
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
