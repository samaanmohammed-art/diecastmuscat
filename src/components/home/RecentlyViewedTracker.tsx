"use client";

import { useEffect } from "react";
import type { Product } from "@/types/database";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed";

interface RecentlyViewedTrackerProps {
  product: Product;
}

export function RecentlyViewedTracker({ product }: RecentlyViewedTrackerProps) {
  const push = useRecentlyViewedStore((s) => s.push);
  useEffect(() => {
    push(product);
  }, [product, push]);
  return null;
}
