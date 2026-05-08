import type { Metadata } from "next";
import { MobileHero } from "@/components/home/MobileHero";
import { CategoryPills } from "@/components/home/CategoryPills";
import { CategoryShelf } from "@/components/home/CategoryShelf";
import { BrandStrip } from "@/components/home/BrandStrip";
import { RecentlyViewedShelf } from "@/components/home/RecentlyViewedShelf";
import { ReassuranceStrip } from "@/components/home/ReassuranceStrip";
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
    fetchLimitedProducts(8),
    fetchTopRatedProducts(8),
  ]);

  const heroFeature = limited[0] ?? featured[0];

  return (
    <>
      <MobileHero feature={heroFeature} />

      <CategoryPills />

      {limited.length > 0 && (
        <CategoryShelf
          eyebrow="Numbered editions"
          title={
            <>
              Allocated <em className="not-italic text-gold font-display italic">only</em>
            </>
          }
          href="/products?limited=1"
          products={limited}
        />
      )}

      {featured.length > 0 && (
        <CategoryShelf
          eyebrow="Curator's selection"
          title={
            <>
              Newly arrived <em className="not-italic text-gold font-display italic">on the shelf</em>
            </>
          }
          href="/products"
          products={featured}
        />
      )}

      <BrandStrip />

      {topRated.length > 0 && (
        <CategoryShelf
          eyebrow="Top rated"
          title={
            <>
              What collectors <em className="not-italic text-gold font-display italic">return for</em>
            </>
          }
          href="/products?sort=popular"
          products={topRated}
          variant="compact"
        />
      )}

      <RecentlyViewedShelf />

      <ReassuranceStrip />

      <Newsletter />
    </>
  );
}
