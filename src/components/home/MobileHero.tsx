"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/database";
import { formatCurrencyOMR } from "@/lib/utils";

interface MobileHeroProps {
  feature?: Product;
}

export function MobileHero({ feature }: MobileHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-noise">
      <div className="absolute inset-0 bg-grid-faint opacity-40 pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 70% 0%, rgba(212,175,55,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 lg:pt-20 pb-8 lg:pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-12 gap-5 lg:gap-12 items-center"
        >
          {/* Mobile: image card on top — visual first */}
          {feature?.images?.[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="col-span-12 lg:col-span-6 lg:order-2"
            >
              <Link
                href={`/products/${feature.id}`}
                className="relative block group"
                aria-label={`Featured: ${feature.name}`}
              >
                <div className="absolute -inset-2 lg:-inset-4 rounded-xl bg-gold/8 blur-2xl opacity-60" />
                <figure className="relative aspect-[5/4] rounded-xl overflow-hidden border border-border-strong bg-surface-elevated">
                  <Image
                    src={feature.images[0]}
                    alt={feature.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/15 to-transparent" />

                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-bg/70 backdrop-blur border border-gold/40 text-[10px] uppercase tracking-[0.28em] text-gold">
                    <Sparkles className="h-3 w-3" /> Featured
                  </span>

                  <figcaption className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted line-clamp-1">
                      {feature.brand} · {feature.scale}
                    </p>
                    <p className="mt-0.5 font-display text-lg sm:text-xl text-text leading-tight line-clamp-1">
                      {feature.name}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-gold">
                      {formatCurrencyOMR(feature.price)}
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </motion.div>
          )}

          {/* Headline column */}
          <div className="col-span-12 lg:col-span-6 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-gold mb-4 sm:mb-6 flex items-center gap-3"
            >
              <span className="inline-block h-px w-6 bg-gold/60" />
              Premium die-cast · Sultanate of Oman
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display tracking-[-0.02em]"
              style={{
                fontSize: "clamp(2.25rem, 8.5vw, 5.5rem)",
                lineHeight: "1.0",
                fontWeight: 600,
              }}
            >
              <span className="block">Models for</span>
              <span className="block">those who</span>
              <span className="block text-gradient-gold italic font-display">
                never settle.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 sm:mt-6 max-w-md text-sm sm:text-base text-text-muted leading-relaxed"
            >
              A curated atelier of authenticated 1:18, 1:43 and 1:64 collectibles —
              hand-delivered across the Sultanate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 sm:mt-8 flex items-center gap-3"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 h-12 sm:h-14 px-5 sm:px-7 rounded-full bg-gold text-bg text-xs sm:text-sm uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_15px_50px_-15px_rgba(212,175,55,0.6)]"
              >
                Browse the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?limited=1"
                className="hidden sm:inline-flex items-center gap-2 h-14 px-6 rounded-full border border-border-strong text-xs uppercase tracking-[0.22em] text-text-muted hover:border-gold/60 hover:text-gold transition-colors"
              >
                Numbered editions
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
