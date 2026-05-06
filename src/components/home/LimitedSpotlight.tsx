"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrencyOMR } from "@/lib/utils";
import type { Product } from "@/types/database";

interface LimitedSpotlightProps {
  product: Product;
}

export function LimitedSpotlight({ product }: LimitedSpotlightProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax — image drifts opposite of scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const numbered =
    typeof product.features === "object" &&
    product.features !== null &&
    "numbered" in product.features &&
    typeof (product.features as Record<string, unknown>).numbered === "string"
      ? ((product.features as Record<string, unknown>).numbered as string)
      : "001 / 099";

  const image = product.images?.[0];

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg py-28 lg:py-40 overflow-hidden"
    >
      {/* Atmospheric gold wash */}
      <div className="absolute inset-0 bg-gold-glow opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />

      <div className="relative mx-auto max-w-[1500px] px-0 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image — bleeds left edge on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-7 xl:col-span-7 relative"
          >
            <div className="relative aspect-[4/5] lg:aspect-[16/12] w-full">
              <motion.div
                style={{ y: imageY }}
                className="absolute -inset-y-12 inset-x-0 lg:-left-12 lg:right-0"
              >
                <div className="relative h-full w-full overflow-hidden bg-surface">
                  {image && (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  )}
                  {/* Editorial gradient over image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/30" />
                </div>
              </motion.div>

              {/* Numbered badge — floats over image */}
              <div className="absolute z-10 top-6 right-6 lg:top-10 lg:right-10 bg-bg border border-gold/50 px-5 py-3">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-1">Numbered</p>
                <p className="font-display text-base">{numbered}</p>
              </div>
            </div>
          </motion.div>

          {/* Copy block */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-5 xl:col-span-5 px-6 lg:px-0"
          >
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Limited Edition
            </span>

            <p className="text-xs uppercase tracking-[0.25em] text-text-dim mb-3">
              {product.brand} · {product.scale}
            </p>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tight mb-8">
              {product.name}
            </h2>

            <div className="hairline-gold mb-8 max-w-xs" />

            <p className="text-base text-text-muted leading-relaxed mb-4">
              {product.description}
            </p>
            <p className="text-base text-text-muted leading-relaxed mb-10">
              Each piece is sealed with its own provenance certificate, presentation case, and lineage documentation. Reserved exclusively for serious collectors who understand that scarcity is a kind of grace.
            </p>

            <div className="flex items-end justify-between mb-10 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim mb-2">Edition price</p>
                <p className="font-display text-3xl text-gold">{formatCurrencyOMR(product.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-dim mb-2">Available</p>
                <p className="font-display text-3xl">
                  {product.stock.toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            <Button asChild size="xl">
              <Link href={`/products/${product.id}`}>View piece →</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
