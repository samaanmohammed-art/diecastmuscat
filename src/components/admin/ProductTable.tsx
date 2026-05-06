"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyOMR, cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types/database";

interface ProductTableProps {
  products: Product[];
}

const CATEGORIES: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "All categories" },
  { value: "cars", label: "Cars" },
  { value: "planes", label: "Planes" },
  { value: "trucks", label: "Trucks" },
  { value: "bikes", label: "Bikes" },
];

const PAGE_SIZE = 8;

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="error">Out of stock</Badge>;
  if (stock < 5) return <Badge variant="warning">{stock} left</Badge>;
  return <Badge variant="success">{stock} in stock</Badge>;
}

export function ProductTable({ products }: ProductTableProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [products, query, category]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, SKU or brand"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 md:ml-auto">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as "all" | ProductCategory);
              setPage(1);
            }}
            className="h-11 rounded-md border border-input bg-surface px-3 text-sm text-text focus:outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated text-left text-[10px] uppercase tracking-[0.18em] text-text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slice.map((p) => (
                <tr key={p.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border border-border bg-surface-elevated shrink-0">
                        {p.images[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-text-dim text-xs">
                            —
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-text truncate max-w-[260px]">
                          {p.name}
                        </div>
                        <div className="text-xs text-text-dim">
                          {p.sku} · {p.scale ?? "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{p.brand ?? "—"}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{p.category}</td>
                  <td className="px-4 py-3 text-right font-display text-gold">
                    {formatCurrencyOMR(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {p.is_featured && <Badge variant="gold">Featured</Badge>}
                      {p.is_limited_edition && <Badge variant="outline">Limited</Badge>}
                      {!p.is_featured && !p.is_limited_edition && (
                        <span className="text-xs text-text-dim">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold hover:bg-surface-elevated transition-colors"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            Page <span className="text-text">{safePage}</span> of {pages} ·{" "}
            {filtered.length} products
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {pages <= 1 && filtered.length > 0 && (
        <div className={cn("text-xs text-text-muted")}>
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}
