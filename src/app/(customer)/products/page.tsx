import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { ProductFilters } from "@/components/products/ProductFilters";
import { cn } from "@/lib/utils";
import { ProductsGrid, type ProductsGridParams } from "./ProductsGrid";
import { ProductsGridSkeleton } from "./ProductsGridSkeleton";

type SearchParams = ProductsGridParams;

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

  const categoryTitle = sp.category && CATEGORY_TITLES[sp.category];
  const heading = sp.q
    ? `Results for "${sp.q}"`
    : sp.limited === "1"
    ? "Numbered editions"
    : categoryTitle ?? "The Collection";

  const activeChips = buildActiveChips(sp);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-gold mb-2 sm:mb-3">
            Curated diecast
          </p>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-text leading-tight">
            {heading}
          </h1>
        </div>
      </header>

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
            <Suspense
              key={JSON.stringify(sp)}
              fallback={<ProductsGridSkeleton />}
            >
              <ProductsGrid sp={sp} />
            </Suspense>
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
