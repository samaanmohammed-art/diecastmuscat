"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { ALL_BRANDS, ALL_SCALES } from "@/lib/sample-products";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductCategory = "cars" | "planes" | "trucks" | "bikes";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "cars", label: "Cars" },
  { value: "planes", label: "Planes" },
  { value: "trucks", label: "Trucks" },
  { value: "bikes", label: "Bikes" },
];

const PRICE_MAX = 300;

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedCategory = params.get("category") ?? "";
  const selectedScales = useMemo(
    () => new Set((params.get("scale") ?? "").split(",").filter(Boolean)),
    [params]
  );
  const selectedBrands = useMemo(
    () => new Set((params.get("brand") ?? "").split(",").filter(Boolean)),
    [params]
  );
  const limitedOnly = params.get("limited") === "1";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? PRICE_MAX);

  const updateParams = useCallback(
    (mutator: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(Array.from(params.entries()));
      mutator(next);
      // Reset pagination on filter change
      next.delete("page");
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `/products?${qs}` : "/products", { scroll: false });
      });
    },
    [params, router]
  );

  const toggleSetParam = (key: "scale" | "brand", value: string) => {
    updateParams((p) => {
      const current = new Set((p.get(key) ?? "").split(",").filter(Boolean));
      if (current.has(value)) current.delete(value);
      else current.add(value);
      if (current.size === 0) p.delete(key);
      else p.set(key, Array.from(current).join(","));
    });
  };

  const setSingleParam = (key: string, value: string | null) => {
    updateParams((p) => {
      if (value === null || value === "") p.delete(key);
      else p.set(key, value);
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  };

  const activeCount =
    (selectedCategory ? 1 : 0) +
    selectedScales.size +
    selectedBrands.size +
    (limitedOnly ? 1 : 0) +
    (minPrice > 0 || maxPrice < PRICE_MAX ? 1 : 0);

  const filterContent = (
    <FiltersBody
      selectedCategory={selectedCategory}
      selectedScales={selectedScales}
      selectedBrands={selectedBrands}
      limitedOnly={limitedOnly}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onCategoryChange={(c) => setSingleParam("category", c)}
      onToggleScale={(s) => toggleSetParam("scale", s)}
      onToggleBrand={(b) => toggleSetParam("brand", b)}
      onLimitedChange={(v) => setSingleParam("limited", v ? "1" : null)}
      onPriceChange={(min, max) => {
        updateParams((p) => {
          if (min > 0) p.set("minPrice", String(min));
          else p.delete("minPrice");
          if (max < PRICE_MAX) p.set("maxPrice", String(max));
          else p.delete("maxPrice");
        });
      }}
      activeCount={activeCount}
      onClearAll={clearAll}
    />
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-72 shrink-0">
        <div className="sticky top-24">{filterContent}</div>
      </aside>

      {/* Mobile drawer trigger */}
      <div className="lg:hidden mb-4">
        <MobileDrawer activeCount={activeCount}>{filterContent}</MobileDrawer>
      </div>
    </>
  );
}

function MobileDrawer({
  activeCount,
  children,
}: {
  activeCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="default" className="w-full justify-between">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold/15 px-1.5 text-[10px] font-semibold text-gold">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Refine</SheetTitle>
        </SheetHeader>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

interface BodyProps {
  selectedCategory: string;
  selectedScales: Set<string>;
  selectedBrands: Set<string>;
  limitedOnly: boolean;
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (c: string | null) => void;
  onToggleScale: (s: string) => void;
  onToggleBrand: (b: string) => void;
  onLimitedChange: (v: boolean) => void;
  onPriceChange: (min: number, max: number) => void;
  activeCount: number;
  onClearAll: () => void;
}

function FiltersBody({
  selectedCategory,
  selectedScales,
  selectedBrands,
  limitedOnly,
  minPrice,
  maxPrice,
  onCategoryChange,
  onToggleScale,
  onToggleBrand,
  onLimitedChange,
  onPriceChange,
  activeCount,
  onClearAll,
}: BodyProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text">Refine</h2>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-gold transition-colors"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((c) => {
            const checked = selectedCategory === c.value;
            return (
              <CheckRow
                key={c.value}
                checked={checked}
                onChange={() => onCategoryChange(checked ? null : c.value)}
                label={c.label}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Scale */}
      <FilterSection title="Scale">
        <div className="flex flex-wrap gap-2">
          {ALL_SCALES.map((s) => {
            const active = selectedScales.has(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onToggleScale(s)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-mono transition-all",
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {ALL_BRANDS.map((b) => (
            <CheckRow
              key={b}
              checked={selectedBrands.has(b)}
              onChange={() => onToggleBrand(b)}
              label={b}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price (OMR)">
        <PriceRange
          min={minPrice}
          max={maxPrice}
          onChange={onPriceChange}
          ceiling={PRICE_MAX}
        />
      </FilterSection>

      {/* Limited edition */}
      <FilterSection title="Edition">
        <CheckRow
          checked={limitedOnly}
          onChange={() => onLimitedChange(!limitedOnly)}
          label="Limited edition only"
          accent
        />
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  accent,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  accent?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 select-none">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-sm border transition-all",
          checked
            ? "border-gold bg-gold text-black"
            : "border-border-strong bg-surface group-hover:border-gold-muted"
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "text-sm transition-colors",
          checked ? "text-text" : "text-text-muted group-hover:text-text",
          accent && checked && "text-gold"
        )}
      >
        {label}
      </span>
    </label>
  );
}

function PriceRange({
  min,
  max,
  ceiling,
  onChange,
}: {
  min: number;
  max: number;
  ceiling: number;
  onChange: (min: number, max: number) => void;
}) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  // Keep local in sync if URL params change externally
  if (min !== localMin && Math.abs(min - localMin) > 0.5) {
    // no-op guard; we only update via commit
  }

  const commit = (nextMin: number, nextMax: number) => {
    const lo = Math.max(0, Math.min(nextMin, nextMax));
    const hi = Math.min(ceiling, Math.max(nextMin, nextMax));
    onChange(lo, hi);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-muted font-mono">
        <span>{localMin} OMR</span>
        <span>{localMax >= ceiling ? `${ceiling}+ OMR` : `${localMax} OMR`}</span>
      </div>
      <div className="relative h-1 rounded-full bg-border">
        <div
          className="absolute h-full rounded-full bg-gold/60"
          style={{
            left: `${(localMin / ceiling) * 100}%`,
            right: `${100 - (localMax / ceiling) * 100}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={ceiling}
          step={5}
          value={localMin}
          onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax))}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
        <input
          type="range"
          min={0}
          max={ceiling}
          step={5}
          value={localMax}
          onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin))}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}
