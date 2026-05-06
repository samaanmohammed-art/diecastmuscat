"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "12+", label: "Brands curated" },
  { value: "1,000+", label: "Authenticated pieces" },
  { value: "Oman-wide", label: "Concierge delivery" },
];

export function BrandStory() {
  return (
    <section className="relative bg-bg py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-20 lg:mb-28 max-w-4xl"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gold/60" />
            Our story
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Sourced for the <span className="text-gradient-gold italic">Sultanate</span>.
          </h2>
        </motion.div>

        {/* Two-column copy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 mb-24 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-5"
          >
            <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight">
              Diecast Muscat began as a private archive — a single Friday-morning ritual of unwrapping pieces in good light and asking whether they deserved the shelf.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-6 lg:col-start-7 space-y-6 text-text-muted leading-relaxed"
          >
            <p>
              Every model that reaches our atelier is condition-graded by hand against the original maker&rsquo;s reference and re-photographed under controlled lighting. Provenance is traced from source distributor to box. Nothing leaves Muscat without a certificate.
            </p>
            <p>
              We work with the houses that still treat 1:18 as an art form — Minichamps, AutoArt, Bburago, Tekno, Herpa Wings — and quietly with private collectors who occasionally release a sealed piece into the world. The goal has never been volume. It has always been the right object, in the right room, at the right moment.
            </p>
            <p className="text-text">
              Owned and operated in Muscat. Delivered, by hand where possible, across Oman.
            </p>
          </motion.div>
        </div>

        {/* Hairline divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="hairline-gold mb-16 lg:mb-20 origin-center"
        />

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="bg-bg p-8 lg:p-12 text-center group"
            >
              <p className="font-display text-5xl lg:text-6xl text-gradient-gold mb-3">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
