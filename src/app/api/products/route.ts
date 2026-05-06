import { NextResponse, type NextRequest } from "next/server";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import type { Product, ProductCategory } from "@/types/database";

type SortKey = "newest" | "price-asc" | "price-desc" | "popular";

const VALID_CATEGORIES: ProductCategory[] = ["cars", "planes", "trucks", "bikes"];

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const sp = url.searchParams;

  const category = sp.get("category");
  const brand = sp.get("brand");
  const scale = sp.get("scale");
  const q = sp.get("q");
  const limited = sp.get("limited");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const sort = (sp.get("sort") as SortKey | null) ?? "newest";
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const limit = Math.min(60, Math.max(1, Number(sp.get("limit") ?? 12) || 12));

  let list: Product[] = [...SAMPLE_PRODUCTS];

  if (category && (VALID_CATEGORIES as string[]).includes(category)) {
    list = list.filter((p) => p.category === (category as ProductCategory));
  }

  if (scale) {
    const scales = new Set(scale.split(",").filter(Boolean));
    if (scales.size > 0) list = list.filter((p) => p.scale && scales.has(p.scale));
  }

  if (brand) {
    const brands = new Set(brand.split(",").filter(Boolean));
    if (brands.size > 0) list = list.filter((p) => p.brand && brands.has(p.brand));
  }

  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.brand?.toLowerCase().includes(needle) ||
        p.description?.toLowerCase().includes(needle) ||
        p.category.includes(needle)
    );
  }

  if (limited === "1" || limited === "true") {
    list = list.filter((p) => p.is_limited_edition);
  }

  if (minPrice !== null) {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (maxPrice !== null) {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      list.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);
      break;
    case "newest":
    default:
      list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      break;
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const products = list.slice(start, start + limit);

  return NextResponse.json(
    { products, total, page, limit },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
