import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX, ArrowUpDown } from "lucide-react";
import { fetchProducts, type SortKey } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export interface ProductsGridParams {
  category?: string;
  scale?: string;
  brand?: string;
  q?: string;
  sort?: string;
  limited?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

interface ProductsGridProps {
  sp: ProductsGridParams;
}

export async function ProductsGrid({ sp }: ProductsGridProps) {
  const pageNum = Math.max(1, Number(sp.page ?? 1) || 1);
  const sortValue = (sp.sort as SortKey) ?? "newest";

  const { products: pageItems, total } = await fetchProducts({
    category: sp.category,
    scale: sp.scale,
    brand: sp.brand,
    q: sp.q,
    limited: sp.limited,
    minPrice: sp.minPrice ? Number(sp.minPrice) : null,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : null,
    sort: sortValue,
    page: pageNum,
    limit: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(pageNum, totalPages);

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
        <p className="text-[11px] sm:text-xs text-text-muted">
          {total > 0 && (
            <>
              <span className="text-text">{Math.min(safePage * PAGE_SIZE, total)}</span> /{" "}
              <span className="text-text">{total}</span>
            </>
          )}
        </p>
        <SortLinks current={sortValue} sp={sp} />
      </div>

      {pageItems.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {pageItems.map((p, idx) => (
              <ProductCard
                key={p.id}
                product={p}
                priority={idx < 4}
                compact={idx >= 4}
              />
            ))}
          </div>

          {totalPages > 1 && <Pagination page={safePage} totalPages={totalPages} sp={sp} />}
        </>
      )}
    </>
  );
}

const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

function SortLinks({
  current,
  sp,
}: {
  current: SortKey;
  sp: ProductsGridParams;
}) {
  return (
    <details className="group relative inline-block">
      <summary className="list-none inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border-strong bg-surface text-[11px] uppercase tracking-[0.18em] text-text-muted cursor-pointer hover:border-gold/40 hover:text-text">
        <ArrowUpDown className="h-3.5 w-3.5" />
        {SORTS.find((s) => s.value === current)?.label ?? "Sort"}
      </summary>
      <ul className="absolute right-0 mt-2 min-w-[160px] rounded-md border border-border-strong bg-surface-elevated shadow-card z-30 overflow-hidden">
        {SORTS.map((s) => (
          <li key={s.value}>
            <Link
              href={buildHref(sp, { sort: s.value, page: undefined })}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 text-xs",
                s.value === current
                  ? "text-gold bg-gold/10"
                  : "text-text-muted hover:text-text hover:bg-bg/40"
              )}
            >
              {s.label}
              {s.value === current && <span className="text-gold">●</span>}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Pagination({
  page,
  totalPages,
  sp,
}: {
  page: number;
  totalPages: number;
  sp: ProductsGridParams;
}) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <nav className="mt-10 flex items-center justify-between gap-3" aria-label="Pagination">
      {page > 1 ? (
        <Button asChild variant="outline" size="default">
          <Link href={buildHref(sp, { page: String(prev) })}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        </Button>
      ) : (
        <Button disabled variant="outline" size="default">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
      )}
      <span className="text-xs text-text-muted font-mono">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Button asChild variant="outline" size="default">
          <Link href={buildHref(sp, { page: String(next) })}>
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled variant="outline" size="default">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/30 px-6 py-16 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg/40 border border-border-strong mb-4">
        <SearchX className="h-5 w-5 text-text-dim" />
      </span>
      <p className="font-display text-lg text-text">No pieces found</p>
      <p className="mt-1 text-sm text-text-muted">
        Try removing a filter or browsing the full collection.
      </p>
      <Button asChild className="mt-5">
        <Link href="/products">View all</Link>
      </Button>
    </div>
  );
}

function buildHref(
  sp: ProductsGridParams,
  overrides: Record<string, string | undefined>
): string {
  const next = new URLSearchParams();
  const merged: Record<string, string | undefined> = { ...sp, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== null && v !== "") {
      next.set(k, v as string);
    }
  }
  const qs = next.toString();
  return qs ? `/products?${qs}` : "/products";
}
