"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES_META } from "@/lib/sample-products";

// Asymmetric layout — staggered heights to break the grid
const HEIGHTS = ["lg:mt-0", "lg:mt-16", "lg:mt-8", "lg:mt-24"];

export function Categories() {
  return (
    <section className="relative bg-bg py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint opacity-25 pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-20 lg:mb-28 max-w-3xl"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gold/60" />
            Categories
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Built for every <span className="text-gradient-gold italic">passion</span>.
          </h2>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {CATEGORIES_META.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className={HEIGHTS[i % HEIGHTS.length]}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block relative aspect-[3/4] bg-surface border border-border hover:border-gold-muted transition-all duration-500 overflow-hidden"
              >
                {/* Gold corner accents */}
                <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-gold/0 group-hover:border-gold/80 transition-colors duration-300" />
                <span className="absolute top-3 right-3 h-3 w-3 border-t border-r border-gold/0 group-hover:border-gold/80 transition-colors duration-300" />
                <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/0 group-hover:border-gold/80 transition-colors duration-300" />
                <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/0 group-hover:border-gold/80 transition-colors duration-300" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-8">
                  {/* Icon — large, greyscale */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-7xl lg:text-9xl grayscale opacity-30 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-500">
                      {cat.icon}
                    </span>
                  </div>

                  {/* Label block */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-text-dim mb-1">
                        {cat.count} {cat.count === 1 ? "model" : "models"}
                      </p>
                      <h3 className="font-display text-2xl lg:text-3xl group-hover:text-gold transition-colors duration-300">
                        {cat.label}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-text-dim group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
