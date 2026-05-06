import { NextResponse, type NextRequest } from "next/server";
import { fetchProducts, type SortKey } from "@/lib/db";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const result = await fetchProducts({
    category: sp.get("category"),
    scale: sp.get("scale"),
    brand: sp.get("brand"),
    q: sp.get("q"),
    limited: sp.get("limited"),
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : null,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : null,
    sort: (sp.get("sort") as SortKey | null) ?? "newest",
    page: Number(sp.get("page") ?? 1) || 1,
    limit: Number(sp.get("limit") ?? 12) || 12,
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
