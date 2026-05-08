"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed";
import { ProductCard } from "@/components/products/ProductCard";

export function RecentlyViewedShelf() {
  const items = useRecentlyViewedStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="relative bg-bg py-10 sm:py-14">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-4 sm:px-6 lg:px-12 mb-5 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">
              Picked up earlier
            </p>
            <h2 className="font-display text-xl sm:text-2xl tracking-tight">
              Recently viewed
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-gold transition-colors"
          >
            More →
          </Link>
        </div>

        <div className="shelf-scroll overflow-x-auto">
          <ul className="flex gap-3 sm:gap-4 px-4 sm:px-6 lg:px-12 pb-3">
            {items.map((p) => (
              <li
                key={p.id}
                className="shrink-0 w-[60vw] sm:w-[280px] lg:w-[240px]"
              >
                <ProductCard product={p} compact />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
