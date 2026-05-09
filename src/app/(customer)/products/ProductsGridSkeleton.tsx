import { ProductCardSkeleton } from "@/components/products/ProductCard";

export function ProductsGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <span className="h-3 w-16 skeleton rounded" />
        <span className="h-9 w-24 skeleton rounded-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} compact={i >= 4} />
        ))}
      </div>
    </div>
  );
}
