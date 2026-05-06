import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedStrip } from "@/components/home/FeaturedStrip";
import { LimitedSpotlight } from "@/components/home/LimitedSpotlight";
import { AIRecommendations } from "@/components/home/AIRecommendations";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";
import {
  fetchFeaturedProducts,
  fetchLimitedProducts,
  fetchTopRatedProducts,
} from "@/lib/db";

export const metadata: Metadata = {
  title: "Diecast Muscat — Premium die-cast collectibles, Sultanate of Oman",
  description:
    "A curated atelier of authenticated 1:18, 1:43 and 1:64 die-cast model collectibles. Hand-delivered across the Sultanate of Oman.",
};

export default async function HomePage() {
  const [featured, limited, topRated] = await Promise.all([
    fetchFeaturedProducts(8),
    fetchLimitedProducts(1),
    fetchTopRatedProducts(8),
  ]);
  const limitedSpotlight = limited[0];

  // AI recommendations strip — sample 4 from top-rated pool for variety
  const recommended = [topRated[1], topRated[3], topRated[5], topRated[7]].filter(
    (p): p is (typeof topRated)[number] => Boolean(p)
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
