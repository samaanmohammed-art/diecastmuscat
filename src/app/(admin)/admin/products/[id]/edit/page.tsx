import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/sample-products";

export const metadata: Metadata = {
  title: "Edit product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to products
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gold">
          Edit · {product.sku}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Make changes to the listing. Saved updates publish immediately.
        </p>
      </header>
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}
