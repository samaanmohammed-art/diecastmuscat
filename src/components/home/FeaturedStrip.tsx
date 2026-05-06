"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/database";

interface FeaturedStripProps {
  products: Product[];
}

export function FeaturedStrip({ products }: FeaturedStripProps) {
  return (
    <section className="relative bg-bg py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-14 flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gold mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-gold/60" />
              Curator&rsquo;s Selection
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-2xl">
              Newly arrived.
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors duration-200 pb-2 border-b border-border-strong hover:border-gold"
          >
            View archive →
          </Link>
        </motion.div>
      </div>

      {/* Scroll strip — full bleed */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9 }}
        className="relative"
      >
        {/* Edge gradients */}
        <div className="pointer-events-none absolute top-0 bottom-2 left-0 w-12 lg:w-24 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 bottom-2 right-0 w-12 lg:w-24 bg-gradient-to-l from-bg to-transparent z-10" />

        <div className="overflow-x-auto featured-scroll snap-x snap-mandatory scroll-pl-6 lg:scroll-pl-12">
          <div className="flex gap-5 lg:gap-7 px-6 lg:px-12 pb-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[78vw] sm:w-[44vw] lg:w-[300px] xl:w-[340px]"
              >
                <ProductCard product={product} priority={i < 2} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .featured-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .featured-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 0 3rem;
        }
        .featured-scroll::-webkit-scrollbar-thumb {
          background: var(--color-border-strong);
          border-radius: 999px;
        }
        .featured-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-gold-muted);
        }
      `}</style>
    </section>
  );
}
