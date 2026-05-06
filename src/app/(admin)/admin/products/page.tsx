import type { Metadata } from "next";
import { ProductTable } from "@/components/admin/ProductTable";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = SAMPLE_PRODUCTS;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Products
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage the full catalogue. {products.length} items currently published.
        </p>
      </header>
      <ProductTable products={products} />
    </div>
  );
}
