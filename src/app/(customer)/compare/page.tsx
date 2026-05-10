import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { fetchProductsByIds } from "@/lib/db";
import { formatCurrencyOMR } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { WishlistButton } from "@/components/products/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Compare — Diecast Muscat",
};

export const dynamic = "force-dynamic";

interface Row {
  label: string;
  render: (p: Awaited<ReturnType<typeof fetchProductsByIds>>[number]) => React.ReactNode;
}

const ROWS: Row[] = [
  { label: "Price", render: (p) => <span className="font-display text-lg text-gold">{formatCurrencyOMR(p.price)}</span> },
  { label: "Brand", render: (p) => p.brand ?? "—" },
  { label: "Scale", render: (p) => p.scale ? <span className="font-mono text-xs">{p.scale}</span> : "—" },
  { label: "Category", render: (p) => <span className="capitalize">{p.category}</span> },
  { label: "Condition", render: (p) => <span className="capitalize">{p.condition}</span> },
  {
    label: "Edition",
    render: (p) =>
      p.is_limited_edition ? (
        <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">Limited</Badge>
      ) : (
        "Standard"
      ),
  },
  {
    label: "Rating",
    render: (p) =>
      p.review_count > 0 ? (
        <span className="flex items-center gap-1.5 text-sm">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {p.rating.toFixed(1)}
          <span className="text-text-dim text-xs">({p.review_count})</span>
        </span>
      ) : (
        <span className="text-text-dim text-xs">No reviews yet</span>
      ),
  },
  {
    label: "Stock",
    render: (p) =>
      p.stock <= 0 ? (
        <Badge variant="error" className="text-[10px]">Sold out</Badge>
      ) : p.stock <= 5 ? (
        <span className="text-gold text-sm">{p.stock} remaining</span>
      ) : (
        <span className="text-text-muted text-sm">In stock</span>
      ),
  },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: rawIds } = await searchParams;
  const ids = (rawIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (ids.length < 2) notFound();

  const products = await fetchProductsByIds(ids);
  if (products.length < 2) notFound();

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" /> Back to collection
        </Link>

        <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">Side by side</p>
        <h1 className="font-display text-3xl sm:text-4xl text-text mb-8">
          Compare {products.length} pieces
        </h1>

        {/* Scrollable comparison table */}
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div
            className="grid min-w-[640px]"
            style={{ gridTemplateColumns: `180px repeat(${products.length}, 1fr)` }}
          >
            {/* Header row — product cards */}
            <div className="border-b border-border" /> {/* empty label cell */}
            {products.map((product) => (
              <div
                key={product.id}
                className="border-b border-l border-border p-4 flex flex-col gap-3"
              >
                <div className="relative aspect-square rounded-md overflow-hidden bg-surface-elevated border border-border">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-gold/10 font-display">
                      {product.category === "cars" ? "▲" : product.category === "planes" ? "△" : "◆"}
                    </div>
                  )}
                </div>
                {product.brand && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">{product.brand}</p>
                )}
                <Link
                  href={`/products/${product.id}`}
                  className="font-display text-base text-text hover:text-gold transition-colors leading-snug"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-auto">
                  <WishlistButton productId={product.id} size="sm" />
                </div>
              </div>
            ))}

            {/* Spec rows */}
            {ROWS.map((row, rowIdx) => (
              <>
                {/* Label cell */}
                <div
                  key={`label-${row.label}`}
                  className={`px-4 py-3.5 flex items-center ${rowIdx % 2 === 0 ? "bg-surface/20" : ""} border-b border-border`}
                >
                  <span className="text-[10px] uppercase tracking-[0.22em] text-text-dim">{row.label}</span>
                </div>

                {products.map((product) => (
                  <div
                    key={`${row.label}-${product.id}`}
                    className={`px-4 py-3.5 border-b border-l border-border flex items-center ${rowIdx % 2 === 0 ? "bg-surface/20" : ""}`}
                  >
                    <span className="text-sm text-text">{row.render(product)}</span>
                  </div>
                ))}
              </>
            ))}

            {/* Add to cart row */}
            <div className="px-4 pt-5 flex items-center">
              <span className="text-[10px] uppercase tracking-[0.22em] text-text-dim">Add to collection</span>
            </div>
            {products.map((product) => (
              <div key={`cart-${product.id}`} className="px-4 pt-5 border-l border-border">
                <AddToCartButton product={product} />
              </div>
            ))}
          </div>
        </div>

        <Separator className="mt-10 mb-6" />
        <p className="text-xs text-text-dim text-center">
          Prices include VAT · All pieces authenticated by the Diecast Muscat atelier in Muscat, Oman
        </p>
      </div>
    </div>
  );
}
