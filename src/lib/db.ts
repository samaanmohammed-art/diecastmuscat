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

export interface ReviewWithCustomer {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  customer_name: string | null;
}

export async function fetchReviews(
  productId: string,
  page = 1,
  limit = 8
): Promise<{ reviews: ReviewWithCustomer[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select("*, customer:customers(name)", { count: "exact" })
      .eq("product_id", productId)
      .order("is_verified_purchase", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const reviews = (data ?? []).map((r) => {
      const row = r as Record<string, unknown>;
      return {
        id: row.id as string,
        product_id: row.product_id as string,
        customer_id: row.customer_id as string,
        rating: row.rating as number,
        title: row.title as string | null,
        comment: row.comment as string | null,
        is_verified_purchase: row.is_verified_purchase as boolean,
        created_at: row.created_at as string,
        customer_name: (row.customer as { name: string } | null)?.name ?? null,
      } satisfies ReviewWithCustomer;
    });

    return { reviews, total: count ?? 0 };
  } catch (err) {
    console.error("[db.fetchReviews]", err);
    return { reviews: [], total: 0 };
  }
}

export async function fetchReviewStats(
  productId: string
): Promise<{ total: number; histogram: Record<number, number> }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId);

    if (error) throw error;

    const histogram: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of (data ?? []) as Array<{ rating: number }>) {
      if (row.rating >= 1 && row.rating <= 5) histogram[row.rating]++;
    }

    return { total: data?.length ?? 0, histogram };
  } catch (err) {
    console.error("[db.fetchReviewStats]", err);
    return { total: 0, histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);
    if (error) throw error;
    const map = new Map((data as Product[]).map((p) => [p.id, p]));
    return ids.flatMap((id) => (map.has(id) ? [map.get(id)!] : []));
  } catch (err) {
    console.error("[db.fetchProductsByIds]", err);
    return [];
  }
}

export { applySort };
