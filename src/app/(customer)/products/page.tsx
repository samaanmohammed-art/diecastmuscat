import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX, X, ArrowUpDown } from "lucide-react";
import { fetchProducts, type SortKey } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

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
  planes: "Aviation",
  trucks: "Heavy haul",
  bikes: "Motorcycles",
};

const QUICK_PILLS: {
  label: string;
  params: Record<string, string | undefined>;
  accent?: boolean;
}[] = [
  { label: "All", params: {} },
  { label: "Cars", params: { category: "cars" } },
  { label: "Aviation", params: { category: "planes" } },
  { label: "Trucks", params: { category: "trucks" } },
  { label: "Bikes", params: { category: "bikes" } },
  { label: "Limited", params: { limited: "1" }, accent: true },
  { label: "1:18", params: { scale: "1:18" } },
  { label: "1:43", params: { scale: "1:43" } },
  { label: "1:64", params: { scale: "1:64" } },
];

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

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

  const categoryTitle = sp.category && CATEGORY_TITLES[sp.category];
  const heading = sp.q
    ? `Results for "${sp.q}"`
    : sp.limited === "1"
    ? "Numbered editions"
    : categoryTitle ?? "The Collection";

  const activeChips = buildActiveChips(sp);

  return (
    <div className="min-h-screen bg-bg">
      {/* Compact header */}
      <header className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-gold mb-2 sm:mb-3">
            Curated diecast
          </p>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-text leading-tight">
            {heading}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            {total === 0
              ? "No pieces match your refinement."
              : `${total} ${total === 1 ? "piece" : "pieces"} on the shelf`}
          </p>
        </div>
      </header>

      {/* Quick pills — sticky horizontal scroll under navbar */}
      <div
        className="sticky z-20 bg-bg/90 backdrop-blur-md border-b border-border"
        style={{ top: "calc(4rem + env(safe-area-inset-top))" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="shelf-scroll overflow-x-auto">
            <ul className="flex gap-2 px-4 sm:px-6 lg:px-8 py-3">
              {QUICK_PILLS.map((pill) => {
                const href = buildHref({}, pill.params);
                const matches = pillMatches(sp, pill.params);
                return (
                  <li key={pill.label} className="shrink-0">
                    <Link
                      href={href}
                      className={cn(
                        "inline-flex items-center h-9 px-4 rounded-full border text-xs uppercase tracking-[0.18em] whitespace-nowrap transition-colors",
                        matches
                          ? "bg-gold text-bg border-gold"
                          : pill.accent
                          ? "bg-gold/10 border-gold/40 text-gold hover:bg-gold/15"
                          : "bg-surface border-border-strong text-text-muted hover:border-gold/40 hover:text-text"
                      )}
                    >
                      {pill.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.28em] text-text-dim">
              Filters
            </span>
            {activeChips.map((chip) => (
              <Link
                key={chip.key}
                href={chip.removeHref}
                className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-gold/10 border border-gold/40 text-gold text-[11px]"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </Link>
            ))}
            <Link
              href="/products"
              className="text-[10px] uppercase tracking-[0.22em] text-text-muted hover:text-gold underline-offset-4 hover:underline"
            >
              Clear all
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:gap-10">
          <Suspense fallback={<aside className="lg:w-72 shrink-0" />}>
            <ProductFilters />
          </Suspense>

          <main className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <p className="text-[11px] sm:text-xs text-text-muted">
                {total > 0 && (
                  <>
                    <span className="text-text">{Math.min(safePage * PAGE_SIZE, total)}</span>{" "}
                    / <span className="text-text">{total}</span>
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

                {totalPages > 1 && (
                  <Pagination page={safePage} totalPages={totalPages} sp={sp} />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function pillMatches(sp: SearchParams, pillParams: Record<string, string | undefined>): boolean {
  const keys = Object.keys(pillParams);
  if (keys.length === 0) {
    return !sp.category && !sp.scale && !sp.limited && !sp.brand && !sp.q;
  }
  return keys.every((k) => sp[k as keyof SearchParams] === pillParams[k]);
}

function buildActiveChips(sp: SearchParams): {
  key: string;
  label: string;
  removeHref: string;
}[] {
  const chips: { key: string; label: string; removeHref: string }[] = [];
  if (sp.q) {
    chips.push({
      key: "q",
      label: `"${sp.q}"`,
      removeHref: buildHref(sp, { q: undefined, page: undefined }),
    });
  }
  if (sp.category) {
    chips.push({
      key: "category",
      label: CATEGORY_TITLES[sp.category] ?? sp.category,
      removeHref: buildHref(sp, { category: undefined, page: undefined }),
    });
  }
  if (sp.scale) {
    sp.scale.split(",").forEach((s) => {
      chips.push({
        key: `scale-${s}`,
        label: s,
        removeHref: removeFromMulti(sp, "scale", s),
      });
    });
  }
  if (sp.brand) {
    sp.brand.split(",").forEach((b) => {
      chips.push({
        key: `brand-${b}`,
        label: b,
        removeHref: removeFromMulti(sp, "brand", b),
      });
    });
  }
  if (sp.limited === "1") {
    chips.push({
      key: "limited",
      label: "Limited",
      removeHref: buildHref(sp, { limited: undefined, page: undefined }),
    });
  }
  if (sp.minPrice || sp.maxPrice) {
    chips.push({
      key: "price",
      label: `OMR ${sp.minPrice ?? 0}–${sp.maxPrice ?? "∞"}`,
      removeHref: buildHref(sp, {
        minPrice: undefined,
        maxPrice: undefined,
        page: undefined,
      }),
    });
  }
  return chips;
}

function removeFromMulti(sp: SearchParams, key: "scale" | "brand", value: string): string {
  const remaining = (sp[key] ?? "")
    .split(",")
    .filter(Boolean)
    .filter((x) => x !== value);
  return buildHref(sp, {
    [key]: remaining.length > 0 ? remaining.join(",") : undefined,
    page: undefined,
  });
}

function buildHref(
  sp: SearchParams,
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

const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

function SortLinks({ current, sp }: { current: SortKey; sp: SearchParams }) {
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
  sp: SearchParams;
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
