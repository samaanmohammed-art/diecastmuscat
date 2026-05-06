import { NextResponse } from "next/server";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { pickRandom } from "@/lib/ai-helpers";
import type { Product } from "@/types/database";

export const dynamic = "force-dynamic";

const RECOMMENDATION_COUNT = 4;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");
  const productId = searchParams.get("productId");

  // Featured pool first, fall back to full catalogue.
  const featured = SAMPLE_PRODUCTS.filter((p) => p.is_featured);
  const others = SAMPLE_PRODUCTS.filter((p) => !p.is_featured);

  // If a productId is supplied, exclude it and prefer same-category matches.
  let pool: Product[];
  if (productId) {
    const seed = SAMPLE_PRODUCTS.find((p) => p.id === productId);
    if (seed) {
      const sameCategory = SAMPLE_PRODUCTS.filter(
        (p) => p.id !== seed.id && p.category === seed.category
      );
      const rest = SAMPLE_PRODUCTS.filter(
        (p) => p.id !== seed.id && p.category !== seed.category
      );
      pool = [...sameCategory, ...rest];
    } else {
      pool = [...featured, ...others];
    }
  } else {
    pool = [...featured, ...others];
  }

  // Take the first RECOMMENDATION_COUNT * 2 candidates and randomise within
  // them so the caller still sees variety while featured items dominate.
  const head = pool.slice(0, Math.min(RECOMMENDATION_COUNT * 2, pool.length));
  const products = pickRandom(head, RECOMMENDATION_COUNT);

  return NextResponse.json({
    products,
    context: customerId ? { customerId } : productId ? { productId } : null,
  });
}
