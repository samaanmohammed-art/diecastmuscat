import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory, ProductScale } from "@/types/database";

export type SortKey = "newest" | "price-asc" | "price-desc" | "popular";

export interface ProductFilters {
  category?: string | null;
  scale?: string | null;       // single or comma-separated
  brand?: string | null;       // single or comma-separated
  q?: string | null;
  limited?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: SortKey;
  page?: number;
  limit?: number;
}

const VALID_CATEGORIES: ProductCategory[] = ["cars", "planes", "trucks", "bikes"];

function applySort<T extends { created_at: string; price: number; rating: number; review_count: number }>(
  rows: T[],
  sort: SortKey
): T[] {
  const sorted = [...rows];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      sorted.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }
  return sorted;
}

/**
 * Fetch products with filters, sort, pagination from Supabase.
 * Returns an empty array if Supabase isn't reachable (graceful fallback).
 */
export async function fetchProducts(filters: ProductFilters = {}): Promise<{
  products: Product[];
  total: number;
  page: number;
  limit: number;
}> {
  const {
    category,
    scale,
    brand,
    q,
    limited,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;

  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*", { count: "exact" });

    if (category && (VALID_CATEGORIES as string[]).includes(category)) {
      query = query.eq("category", category as ProductCategory);
    }

    if (scale) {
      const scales = scale.split(",").filter(Boolean);
      if (scales.length > 0) query = query.in("scale", scales as ProductScale[]);
    }

    if (brand) {
      const brands = brand.split(",").filter(Boolean);
      if (brands.length > 0) query = query.in("brand", brands);
    }

    if (q && q.trim()) {
      const needle = `%${q.trim()}%`;
      query = query.or(
        `name.ilike.${needle},brand.ilike.${needle},description.ilike.${needle}`
      );
    }

    if (limited === "1" || limited === "true") {
      query = query.eq("is_limited_edition", true);
    }

    if (typeof minPrice === "number" && !Number.isNaN(minPrice)) {
      query = query.gte("price", minPrice);
    }
    if (typeof maxPrice === "number" && !Number.isNaN(maxPrice)) {
      query = query.lte("price", maxPrice);
    }

    // Server-side ordering for sortable columns Supabase can handle directly
    if (sort === "price-asc") query = query.order("price", { ascending: true });
    else if (sort === "price-desc") query = query.order("price", { ascending: false });
    else if (sort === "popular") query = query.order("rating", { ascending: false }).order("review_count", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(60, Math.max(1, limit));
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    return {
      products: (data ?? []) as Product[],
      total: count ?? data?.length ?? 0,
      page: safePage,
      limit: safeLimit,
    };
  } catch (err) {
    console.error("[db.fetchProducts] Supabase query failed:", err);
    return { products: [], total: 0, page: filters.page ?? 1, limit: filters.limit ?? 12 };
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Product | null) ?? null;
  } catch (err) {
    console.error("[db.fetchProductById]", err);
    return null;
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (err) {
    console.error("[db.fetchFeaturedProducts]", err);
    return [];
  }
}

export async function fetchLimitedProducts(limit = 4): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_limited_edition", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (err) {
    console.error("[db.fetchLimitedProducts]", err);
    return [];
  }
}

export async function fetchRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (err) {
    console.error("[db.fetchRelatedProducts]", err);
    return [];
  }
}

export async function fetchTopRatedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("rating", { ascending: false })
      .order("review_count", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (err) {
    console.error("[db.fetchTopRatedProducts]", err);
    return [];
  }
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();
    const counts: Record<string, number> = { cars: 0, planes: 0, trucks: 0, bikes: 0 };
    for (const cat of VALID_CATEGORIES) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category", cat);
      counts[cat] = count ?? 0;
    }
    return counts;
  } catch (err) {
    console.error("[db.fetchCategoryCounts]", err);
    return { cars: 0, planes: 0, trucks: 0, bikes: 0 };
  }
}

export async function fetchAllBrands(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("brand");
    if (error) throw error;
    const brands = new Set<string>();
    for (const row of (data ?? []) as Array<{ brand: string | null }>) {
      if (row.brand) brands.add(row.brand);
    }
    return [...brands].sort();
  } catch (err) {
    console.error("[db.fetchAllBrands]", err);
    return [];
  }
}

export { applySort };
