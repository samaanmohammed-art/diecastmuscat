import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Shield, Sparkles, Truck, RotateCcw } from "lucide-react";
import { fetchProductById, fetchRelatedProducts } from "@/lib/db";
import { formatCurrencyOMR } from "@/lib/utils";
import { ProductGallery } from "@/components/products/ProductGallery";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { RatingStars } from "@/components/products/RatingStars";
import { WishlistButton } from "@/components/products/WishlistButton";
import { StickyPDPBar } from "@/components/products/StickyPDPBar";
import { Reviews } from "@/components/products/Reviews";
import { CategoryShelf } from "@/components/home/CategoryShelf";
import { RecentlyViewedTracker } from "@/components/home/RecentlyViewedTracker";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) {
    return { title: "Product not found — Diecast Muscat" };
  }
  return {
    title: `${product.name}${product.brand ? ` — ${product.brand}` : ""} | Diecast Muscat`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) notFound();

  const features = formatFeatures(product.features);
  const related = await fetchRelatedProducts(product, 8);

  return (
    <>
      <RecentlyViewedTracker product={product} />

      <div className="min-h-screen bg-bg pb-32 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
          {/* Breadcrumbs — compact on mobile */}
          <nav className="mb-4 lg:mb-6 text-[11px] lg:text-xs text-text-muted flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-text-dim" />
            <Link href="/products" className="hover:text-gold transition-colors">Collection</Link>
            <ChevronRight className="h-3 w-3 text-text-dim" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-gold transition-colors capitalize"
            >
              {product.category}
            </Link>
          </nav>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 lg:gap-12">
            {/* Gallery — full bleed on mobile */}
            <div className="-mx-4 sm:-mx-6 lg:mx-0">
              <ProductGallery
                images={product.images}
                alt={product.name}
                category={product.category}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {product.brand && (
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-gold">
                      {product.brand}
                    </p>
                  )}
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-[1.1] text-text mt-2">
                    {product.name}
                  </h1>
                </div>
                <div className="hidden lg:block shrink-0">
                  <WishlistButton productId={product.id} size="lg" />
                </div>
              </div>

              {product.review_count > 0 && (
                <div className="mt-3">
                  <RatingStars rating={product.rating} count={product.review_count} size="sm" />
                </div>
              )}

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl text-gold">
                  {formatCurrencyOMR(product.price)}
                </span>
                <span className="text-[10px] sm:text-xs text-text-dim uppercase tracking-[0.2em]">
                  Inclusive of VAT
                </span>
              </div>

              {/* Chips */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {product.scale && (
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {product.scale}
                  </Badge>
                )}
                {product.condition === "sealed" && (
                  <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                    Sealed
                  </Badge>
                )}
                {product.is_limited_edition && (
                  <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                    <Sparkles className="h-3 w-3" /> Limited
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px] uppercase tracking-[0.18em] font-mono">
                  {product.sku}
                </Badge>
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-5 text-sm sm:text-base text-text-muted leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock micro */}
              {product.stock > 0 && product.stock <= 5 && (
                <p className="mt-4 inline-flex items-center gap-2 text-xs text-gold">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  Only {product.stock} remaining in our vault
                </p>
              )}

              <Separator className="my-6 lg:my-8" />

              {/* Desktop CTA */}
              <div className="hidden lg:block">
                <AddToCartButton product={product} />
              </div>

              {/* Reassurance — compact */}
              <ul className="mt-6 grid grid-cols-2 gap-2 text-xs">
                {[
                  { icon: Truck, label: "Insured shipping" },
                  { icon: Shield, label: "Authenticated" },
                  { icon: Sparkles, label: "Curated" },
                  { icon: RotateCcw, label: "14-day exchange" },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <li
                      key={r.label}
                      className="flex items-center gap-2 rounded-md border border-border bg-surface/40 px-3 py-2.5 text-text-muted"
                    >
                      <Icon className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="text-[11px] leading-tight">{r.label}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Specs */}
              <section className="mt-8 lg:mt-10">
                <h2 className="text-[10px] uppercase tracking-[0.32em] text-gold mb-4">
                  Specifications
                </h2>
                <dl className="divide-y divide-border rounded-lg border border-border bg-surface/30">
                  <SpecRow label="Brand" value={product.brand ?? "—"} />
                  <SpecRow label="Scale" value={product.scale ?? "—"} />
                  <SpecRow label="Category" value={product.category} className="capitalize" />
                  <SpecRow label="Condition" value={product.condition} className="capitalize" />
                  <SpecRow
                    label="Edition"
                    value={product.is_limited_edition ? "Limited" : "Standard"}
                  />
                  <SpecRow label="SKU" value={product.sku} mono />
                </dl>
              </section>

              {/* Features */}
              {features.length > 0 && (
                <section className="mt-8 lg:mt-10">
                  <h2 className="text-[10px] uppercase tracking-[0.32em] text-gold mb-4">
                    Highlights
                  </h2>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-text-muted"
                      >
                        <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Shipping */}
              <section className="mt-8 lg:mt-10">
                <h2 className="text-[10px] uppercase tracking-[0.32em] text-gold mb-3">
                  Shipping
                </h2>
                <div className="rounded-lg border border-border bg-surface/30 px-4 py-4 space-y-2 text-sm text-text-muted leading-relaxed">
                  <p>
                    Insured worldwide shipping in custom-fitted packaging. Oman delivery within
                    2–3 business days; international 5–10 days via DHL.
                  </p>
                  <p>
                    Each piece is inspected and signed for before dispatch from our Muscat vault.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Reviews */}
          <Reviews
            productId={product.id}
            productRating={product.rating}
            reviewCount={product.review_count}
          />

          {/* Related — full-width horizontal shelf */}
          {related.length > 0 && (
            <section className="mt-12 lg:mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
              <CategoryShelf
                eyebrow="Continue browsing"
                title={
                  <>
                    More from the <em className="not-italic text-gold font-display italic">{product.category} vault</em>
                  </>
                }
                href={`/products?category=${product.category}`}
                products={related}
                variant="compact"
              />
            </section>
          )}
        </div>
      </div>

      <StickyPDPBar product={product} />
    </>
  );
}

function formatFeatures(features: Record<string, unknown>): string[] {
  if (!features || typeof features !== "object") return [];
  return Object.entries(features).map(([key, value]) => {
    const label = key
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    if (typeof value === "boolean") return value ? label : `${label} (no)`;
    return `${label}: ${String(value)}`;
  });
}

function SpecRow({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3">
      <dt className="text-text-dim uppercase tracking-[0.18em] text-[10px] pt-0.5">
        {label}
      </dt>
      <dd
        className={`text-sm text-text ${mono ? "font-mono text-xs" : ""} ${className ?? ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
