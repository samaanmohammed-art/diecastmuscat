"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/database";

interface AIRecommendationsProps {
  products: Product[];
}

export function AIRecommendations({ products }: AIRecommendationsProps) {
  function openConcierge() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("diecast:open-chat"));
    }
  }

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      {/* Layered backgrounds */}
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gold-glow opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-faint opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header — centered, editorial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl mb-16 lg:mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold mb-5 flex items-center gap-3">
            <Sparkles className="h-3 w-3" />
            Powered by AI · Personalized
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mb-8">
            Curated <span className="text-gradient-gold italic">for you</span>.
          </h2>
          <p className="text-base lg:text-lg text-text-muted leading-relaxed max-w-xl">
            Our concierge studies your taste — the marques you linger on, the scales you favour, the editions you covet — and proposes pieces worthy of your shelf. Conversational, considered, never algorithmic noise.
          </p>
        </motion.div>

        {/* Recommendation grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 mb-14">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={openConcierge}
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-text hover:text-gold transition-colors duration-200 border-b border-border-strong hover:border-gold pb-3"
          >
            Open the concierge
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
