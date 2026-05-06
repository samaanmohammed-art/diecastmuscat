import type { Metadata } from "next";
import { ProductTable } from "@/components/admin/ProductTable";
import { fetchProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const { products, total } = await fetchProducts({ limit: 60, page: 1 });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Catalogue</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Products
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage the full catalogue. {total} items currently published.
        </p>
      </header>
      <ProductTable products={products} />
    </div>
  );
}
