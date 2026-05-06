import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Add product",
};

export default async function NewProductPage() {
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
          New product
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Add a product to the catalogue
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Provide the essential details, drop in imagery and publish.
        </p>
      </header>
      <ProductForm mode="create" />
    </div>
  );
}
