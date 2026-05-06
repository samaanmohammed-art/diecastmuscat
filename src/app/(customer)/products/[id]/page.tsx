import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Heart, Shield, Sparkles, Truck } from "lucide-react";
import { fetchProductById, fetchRelatedProducts } from "@/lib/db";
import type { Product } from "@/types/database";
import { formatCurrencyOMR } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { RatingStars } from "@/components/products/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

  if (!product) {
    notFound();
  }

  const features = formatFeatures(product.features);
  const related = await fetchRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-xs text-text-muted flex items-center gap-1.5 flex-wrap">
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
          <ChevronRight className="h-3 w-3 text-text-dim" />
          <span className="text-text-dim line-clamp-1">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-12">
          {/* Gallery */}
          <ProductGallery
            images={product.images}
            alt={product.name}
            category={product.category}
          />

          {/* Details */}
          <div className="flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                {product.brand}
              </p>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl leading-tight text-text mt-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="mt-3">
                <RatingStars
                  rating={product.rating}
                  count={product.review_count}
                  size="sm"
                />
              </div>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-gold">
                {formatCurrencyOMR(product.price)}
              </span>
              <span className="text-xs text-text-dim uppercase tracking-[0.2em]">
                Inclusive of VAT
              </span>
            </div>

            {/* Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.scale && (
                <Badge variant="outline" className="font-mono text-[11px]">
                  {product.scale}
                </Badge>
              )}
              {product.condition === "sealed" && (
                <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                  Brand new, sealed
                </Badge>
              )}
              {product.is_limited_edition && (
                <Badge variant="gold" className="text-[10px] uppercase tracking-[0.18em]">
                  <Sparkles className="h-3 w-3" /> Limited edition
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] uppercase tracking-[0.18em]">
                SKU {product.sku}
              </Badge>
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 text-text-muted leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <ul className="mt-6 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="mt-2 h-1 w-1 rounded-full bg-gold shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <Separator className="my-8" />

            {/* CTA */}
            <AddToCartButton product={product} />

            {/* Wishlist */}
            <button
              type="button"
              className="mt-3 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors h-10"
            >
              <Heart className="h-4 w-4" />
              Save to wishlist
            </button>

            {/* Reassurance */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <Reassurance icon={<Truck className="h-4 w-4" />} label="Insured shipping" />
              <Reassurance icon={<Shield className="h-4 w-4" />} label="Authenticity guaranteed" />
              <Reassurance icon={<Sparkles className="h-4 w-4" />} label="Curated by collectors" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-16 lg:mt-24">
          <ProductTabs product={product} features={features} />
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 lg:mt-28">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  Continue browsing
                </p>
                <h2 className="font-display text-2xl lg:text-3xl text-text mt-2">
                  More from the {product.category} vault
                </h2>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold transition-colors"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Reassurance({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface/60 px-4 py-3">
      <span className="text-gold">{icon}</span>
      <span className="text-text-muted leading-tight">{label}</span>
    </div>
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

function ProductTabs({
  product,
  features,
}: {
  product: Product;
  features: string[];
}) {
  if (!product) return null;

  return (
    <div className="rounded-lg border border-border bg-surface/40 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <TabPanel title="Description">
          <p className="text-sm text-text-muted leading-relaxed">
            {product.description ?? "Full description coming soon."}
          </p>
        </TabPanel>

        <TabPanel title="Specifications">
          <dl className="space-y-3 text-sm">
            <SpecRow label="Brand" value={product.brand ?? "—"} />
            <SpecRow label="Scale" value={product.scale ?? "—"} />
            <SpecRow label="Category" value={product.category} className="capitalize" />
            <SpecRow label="Condition" value={product.condition} className="capitalize" />
            <SpecRow label="Edition" value={product.is_limited_edition ? "Limited" : "Standard"} />
            <SpecRow label="SKU" value={product.sku} mono />
            {features.length > 0 && (
              <SpecRow
                label="Features"
                value={features.join(" · ")}
              />
            )}
          </dl>
        </TabPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
        <TabPanel title="Shipping">
          <div className="space-y-2 text-sm text-text-muted leading-relaxed">
            <p>
              Insured worldwide shipping in custom-fitted packaging. Oman delivery
              within 2–3 business days; international 5–10 days via DHL.
            </p>
            <p>
              Each piece is inspected and signed for before dispatch from our Muscat
              vault.
            </p>
          </div>
        </TabPanel>

        <TabPanel title="Reviews">
          {product.review_count > 0 ? (
            <div className="space-y-3">
              <RatingStars rating={product.rating} count={product.review_count} size="md" />
              <p className="text-sm text-text-muted">
                Verified collector reviews are migrated automatically. Detailed reviews
                feed coming with the next release.
              </p>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              No reviews yet — be the first to share your impressions once your piece
              arrives.
            </p>
          )}
        </TabPanel>
      </div>
    </div>
  );
}

function TabPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 lg:p-8">
      <h3 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{title}</h3>
      {children}
    </div>
  );
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
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <dt className="text-text-dim uppercase tracking-[0.15em] text-[11px] pt-0.5">
        {label}
      </dt>
      <dd
        className={`text-text ${mono ? "font-mono text-xs" : ""} ${className ?? ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
