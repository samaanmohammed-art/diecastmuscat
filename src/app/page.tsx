import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedStrip } from "@/components/home/FeaturedStrip";
import { LimitedSpotlight } from "@/components/home/LimitedSpotlight";
import { AIRecommendations } from "@/components/home/AIRecommendations";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getFeaturedProducts,
  getLimitedProducts,
  SAMPLE_PRODUCTS,
} from "@/lib/sample-products";

export const metadata: Metadata = {
  title: "Diecast Muscat — Premium die-cast collectibles, Sultanate of Oman",
  description:
    "A curated atelier of authenticated 1:18, 1:43 and 1:64 die-cast model collectibles. Hand-delivered across the Sultanate of Oman.",
};

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const limitedSpotlight = getLimitedProducts(1)[0];

  // Mock AI recommendations — pseudo-shuffle for variety on each render
  // (deterministic on server; varies as catalogue changes)
  const recPool = [...SAMPLE_PRODUCTS]
    .sort((a, b) => (b.rating - a.rating) || (b.review_count - a.review_count))
    .slice(0, 8);
  const recommended = [recPool[1], recPool[3], recPool[5], recPool[7]].filter(
    (p): p is (typeof recPool)[number] => Boolean(p)
  );

  return (
    <main className="relative">
      <Hero />
      <Categories />
      <FeaturedStrip products={featured} />
      {limitedSpotlight && <LimitedSpotlight product={limitedSpotlight} />}
      <AIRecommendations products={recommended} />
      <BrandStory />
      <Newsletter />
    </main>
  );
}
