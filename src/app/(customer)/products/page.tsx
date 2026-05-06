import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import type { Product, ProductCategory } from "@/types/database";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type SortKey = "newest" | "price-asc" | "price-desc" | "popular";

interface SearchParams {
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

const CATEGORY_TITLES: Record<string, string> = {
  cars: "Cars",
  planes: "Planes",
  trucks: "Trucks",
  bikes: "Bikes",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const cat = sp.category && CATEGORY_TITLES[sp.category];
  const title = cat ? `${cat} — Diecast Muscat` : "The Collection — Diecast Muscat";
  return {
    title,
    description:
      "Browse our curated collection of die-cast model collectibles, hand-selected for the discerning enthusiast.",
  };
}

function applyFilters(products: Product[], sp: SearchParams): Product[] {
  let list = [...products];

  if (sp.category && sp.category in CATEGORY_TITLES) {
    list = list.filter((p) => p.category === (sp.category as ProductCategory));
  }

  if (sp.scale) {
    const scales = new Set(sp.scale.split(",").filter(Boolean));
    if (scales.size > 0) list = list.filter((p) => p.scale && scales.has(p.scale));
  }

  if (sp.brand) {
    const brands = new Set(sp.brand.split(",").filter(Boolean));
    if (brands.size > 0) list = list.filter((p) => p.brand && brands.has(p.brand));
  }

  if (sp.q) {
    const q = sp.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.includes(q)
    );
  }

  if (sp.limited === "1") {
    list = list.filter((p) => p.is_limited_edition);
  }

  const min = sp.minPrice ? Number(sp.minPrice) : null;
  const max = sp.maxPrice ? Number(sp.maxPrice) : null;
  if (min !== null && !Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  if (max !== null && !Number.isNaN(max)) list = list.filter((p) => p.price <= max);

  const sort = (sp.sort as SortKey) ?? "newest";
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      list.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);
      break;
    case "newest":
    default:
      list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      break;
  }

  return list;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const filtered = applyFilters(SAMPLE_PRODUCTS, sp);
  const total = filtered.length;
  const pageNum = Math.max(1, Number(sp.page ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(pageNum, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const categoryTitle = sp.category && CATEGORY_TITLES[sp.category];
  const heading = categoryTitle ?? "The Collection";
  const sortValue = (sp.sort as SortKey) ?? "newest";

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
            Curated Diecast
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-text">{heading}</h1>
          <p className="mt-3 text-text-muted text-sm">
            {total === 0
              ? "No pieces match your refinement."
              : `${total} ${total === 1 ? "piece" : "pieces"} in the vault${
                  sp.q ? ` for "${sp.q}"` : ""
                }`}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:gap-10">
          <Suspense fallback={<aside className="lg:w-72 shrink-0" />}>
            <ProductFilters />
          </Suspense>

          <main className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-xs text-text-muted">
                {total > 0 && (
                  <>
                    Showing{" "}
                    <span className="text-text">
                      {start + 1}–{Math.min(start + PAGE_SIZE, total)}
                    </span>{" "}
                    of <span className="text-text">{total}</span>
                  </>
                )}
              </p>
              <SortLinks current={sortValue} sp={sp} />
            </div>

            {/* Empty state */}
            {pageItems.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {pageItems.map((p, idx) => (
                    <ProductCard key={p.id} product={p} priority={idx < 3} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    sp={sp}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function buildHref(sp: SearchParams, overrides: Record<string, string | undefined>): string {
  const next = new URLSearchParams();
  const merged = { ...sp, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== null && v !== "") {
      next.set(k, String(v));
    }
  }
  const qs = next.toString();
  return qs ? `/products?${qs}` : "/products";
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

function SortLinks({ current, sp }: { current: SortKey; sp: SearchParams }) {
  return (
    <div className="hidden sm:flex items-center gap-1 text-xs">
      <span className="text-text-dim mr-2 uppercase tracking-[0.18em]">Sort</span>
      {SORT_OPTIONS.map((opt) => {
        const active = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={buildHref(sp, { sort: opt.value, page: undefined })}
            scroll={false}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors",
              active
                ? "text-gold bg-gold/10"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            )}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  sp,
}: {
  page: number;
  totalPages: number;
  sp: SearchParams;
}) {
  const prevHref = buildHref(sp, { page: page > 1 ? String(page - 1) : undefined });
  const nextHref = buildHref(sp, {
    page: page < totalPages ? String(page + 1) : undefined,
  });

  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={prevHref}
        scroll={false}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-border-strong px-3 h-10 text-sm transition-colors",
          page <= 1
            ? "pointer-events-none opacity-40"
            : "text-text hover:border-gold hover:text-gold"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          const active = n === page;
          return (
            <Link
              key={n}
              href={buildHref(sp, { page: n === 1 ? undefined : String(n) })}
              scroll={false}
              className={cn(
                "inline-flex h-10 min-w-10 items-center justify-center rounded-md text-sm font-mono transition-colors",
                active
                  ? "bg-gold text-black"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              )}
            >
              {n}
            </Link>
          );
        })}
      </div>

      <Link
        href={nextHref}
        scroll={false}
        aria-disabled={page >= totalPages}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-border-strong px-3 h-10 text-sm transition-colors",
          page >= totalPages
            ? "pointer-events-none opacity-40"
            : "text-text hover:border-gold hover:text-gold"
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-lg border border-dashed border-border bg-surface/40">
      <div className="h-14 w-14 rounded-full bg-surface-elevated border border-border-strong flex items-center justify-center mb-5">
        <SearchX className="h-6 w-6 text-text-dim" />
      </div>
      <h3 className="font-display text-2xl text-text">No matching pieces</h3>
      <p className="mt-2 max-w-md text-sm text-text-muted">
        We couldn&apos;t find anything in the vault that matches your refinement.
        Try widening your search or removing a filter.
      </p>
      <Link href="/products" className="mt-6">
        <Button variant="outline" size="default">
          Reset filters
        </Button>
      </Link>
    </div>
  );
}
