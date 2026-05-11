"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import {
  getFeaturedProducts,
  getLimitedProducts,
} from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

const featured = getFeaturedProducts(6);
const limited = getLimitedProducts(4);
const hero = featured[0];
const shelf = featured.slice(1, 5);

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.round((i * 37 + 11) % 100),
  y: Math.round((i * 53 + 7) % 100),
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  delay: parseFloat(((i * 0.37) % 4).toFixed(2)),
  dur: parseFloat((3.5 + (i % 4) * 0.8).toFixed(2)),
}));

export default function LandingObsidian() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg">
        {/* Atmospheric gold glow */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.12) 0%, transparent 60%)",
            zIndex: 0,
          }}
        />

        {/* Gold particle shimmer — pure CSS, no canvas */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 0, overflow: "hidden" }}
          aria-hidden
        >
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: "rgba(212,175,55,0.55)",
                boxShadow: "0 0 6px rgba(212,175,55,0.4)",
                animation: `goldFloat ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
              }}
            />
          ))}
          <style>{`
            @keyframes goldFloat {
              from { opacity: 0.2; transform: translateY(0px) scale(1); }
              to   { opacity: 0.8; transform: translateY(-18px) scale(1.4); }
            }
          `}</style>
        </div>

        {/* Nav */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl"
          style={{
            background: "rgba(10,10,10,0.75)",
            borderBottom: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-text-muted hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Studies
            </Link>
            <p className="font-display text-base tracking-tight">
              Diecast{" "}
              <em className="text-gold not-italic">Muscat</em>
            </p>
            <nav className="hidden md:flex items-center gap-1">
              {["Cars", "Aviation", "Trucks", "Collection"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-text-muted hover:text-text transition-colors"
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section
          className="relative min-h-[90vh] flex items-center"
          style={{ zIndex: 1 }}
        >
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: copy */}
            <div>
              <motion.p
                className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Obsidian Vault · Vol. IV
              </motion.p>

              <motion.h1
                className="font-display italic leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              >
                Cast{" "}
                <span className="text-gradient-gold not-italic">in gold.</span>
                <br />
                Sealed in{" "}
                <em>obsidian.</em>
              </motion.h1>

              <motion.p
                className="mt-8 text-base lg:text-lg text-text-muted leading-relaxed max-w-md"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                Authenticated die-cast collectibles for the discerning collector
                across Oman and the GCC. Every piece sourced, verified, and
                delivered in museum condition.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans transition-all focus:outline-none focus:ring-2 focus:ring-gold/40 rounded-sm"
                  style={{
                    background: "var(--color-gold)",
                    color: "#000",
                  }}
                >
                  Enter the Vault
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans border rounded-sm transition-colors hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
                  style={{ borderColor: "rgba(212,175,55,0.3)", color: "var(--color-text)" }}
                >
                  Request Access
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-12 flex items-center gap-8 pt-8"
                style={{ borderTop: "1px solid rgba(212,175,55,0.14)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  { value: "06", label: "Maisons" },
                  { value: "1,240+", label: "Authenticated" },
                  { value: "GCC", label: "Delivery" },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="font-display text-2xl sm:text-3xl text-gold leading-none"
                    >
                      {s.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-text-dim">
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: hero product */}
            {hero && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <figure className="relative">
                  {/* Glow halo */}
                  <div
                    className="absolute -inset-8 -z-10 rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(212,175,55,0.22), transparent)",
                    }}
                  />
                  {/* Frame */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-sm"
                    style={{
                      border: "1px solid rgba(212,175,55,0.2)",
                      background:
                        "linear-gradient(180deg, rgba(212,175,55,0.06), rgba(10,10,10,0.4))",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0,0,0,0.8)",
                    }}
                  >
                    {hero.images?.[0] && (
                      <Image
                        src={hero.images[0]}
                        alt={hero.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    )}
                    {/* Glass overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.03) 100%)",
                      }}
                    />
                    {/* Caption */}
                    <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
                          Lot 001
                        </p>
                        <p className="mt-1 font-display text-base text-text leading-tight">
                          {hero.name}
                        </p>
                      </div>
                      <p className="font-display text-sm text-gold">
                        {formatCurrencyOMR(hero.price)}
                      </p>
                    </div>
                  </div>
                  {/* Spec strip */}
                  <div
                    className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-sm"
                    style={{ background: "rgba(212,175,55,0.1)" }}
                  >
                    {[
                      { label: "Maison", value: hero.brand ?? "—" },
                      { label: "Scale", value: hero.scale ?? "—" },
                      { label: "Edition", value: hero.is_limited_edition ? "Limited" : "Curated" },
                    ].map((s) => (
                      <div key={s.label} className="px-4 py-3 bg-surface">
                        <p className="text-[9px] uppercase tracking-[0.28em] text-text-dim">
                          {s.label}
                        </p>
                        <p className="mt-1 font-display text-sm text-text">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </figure>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Horizontal scroll shelf ── */}
        <section className="relative mt-8 pb-16" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">
                  Featured Cars
                </p>
                <h2 className="font-display text-2xl sm:text-3xl">
                  Curator&apos;s Selection
                </h2>
              </div>
              <a
                href="#"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] text-text-muted hover:text-gold transition-colors"
              >
                View all <ChevronRight className="h-3 w-3" />
              </a>
            </div>

            <div
              className="flex gap-4 overflow-x-auto shelf-scroll pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {shelf.map((product, i) => (
                <motion.a
                  key={product.id}
                  href="#"
                  className="shrink-0 w-[240px] sm:w-[280px] card-luxury focus:outline-none focus:ring-2 focus:ring-gold/40"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  // stagger via transition delay
                  style={{ transitionDelay: `${i * 0.08}s` } as React.CSSProperties}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {product.is_limited_edition && (
                      <span
                        className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.24em] px-2 py-1 rounded-sm"
                        style={{
                          background: "rgba(212,175,55,0.15)",
                          border: "1px solid rgba(212,175,55,0.3)",
                          color: "var(--color-gold)",
                        }}
                      >
                        Limited
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                      {product.brand} · {product.scale}
                    </p>
                    <p className="mt-1.5 font-display text-sm text-text leading-snug line-clamp-2">
                      {product.name}
                    </p>
                    <p className="mt-3 font-display text-sm text-gold">
                      {formatCurrencyOMR(product.price)}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Curator's Selection 2-col grid ── */}
        <section className="relative py-24 lg:py-32" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 lg:mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">
                The Collection
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
                Numbered{" "}
                <em className="text-gradient-gold not-italic">editions</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {limited.slice(0, 4).map((product, i) => (
                <motion.a
                  key={product.id}
                  href="#"
                  className="group relative overflow-hidden rounded-lg"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                  whileHover={{ y: -3, borderColor: "rgba(212,175,55,0.4)" }}
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="grid grid-cols-2">
                    <div className="relative aspect-square overflow-hidden">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      )}
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.28em] text-gold mb-2">
                          Lot {String(i + 1).padStart(3, "0")}
                        </p>
                        <p className="font-display text-sm sm:text-base text-text leading-snug">
                          {product.name}
                        </p>
                        <p className="mt-2 text-[11px] text-text-muted">
                          {product.brand} · {product.scale}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="font-display text-base text-gold">
                          {formatCurrencyOMR(product.price)}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-text-dim group-hover:text-gold transition-colors">
                          View details <ArrowUpRight className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section
          className="relative py-24 lg:py-32 mx-4 sm:mx-6 lg:mx-8 mb-16 rounded-lg overflow-hidden"
          style={{
            background: "var(--color-surface)",
            border: "1px solid rgba(212,175,55,0.15)",
            zIndex: 1,
          }}
        >
          {/* Subtle glow behind */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.06), transparent)",
            }}
          />
          <div className="relative text-center px-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
              First Access
            </p>
            <h2 className="font-display italic text-3xl sm:text-4xl lg:text-5xl mx-auto max-w-xl">
              Not every piece reaches the open market.
            </h2>
            <p className="mt-6 text-text-muted text-base max-w-sm mx-auto leading-relaxed">
              Join the vault waitlist. Receive notification on numbered releases
              before they are listed publicly.
            </p>
            <div className="mt-10">
              <a
                href="#"
                className="inline-flex items-center gap-2 h-12 px-10 text-xs uppercase tracking-[0.18em] font-sans rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold/40"
                style={{
                  border: "1px solid var(--color-gold)",
                  color: "var(--color-gold)",
                  background: "transparent",
                }}
              >
                Request Access
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="relative py-12 mt-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)", zIndex: 1 }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-text-dim">
            <p className="font-display text-lg text-text">
              Diecast <em className="text-gold not-italic">Muscat</em>
            </p>
            <p>Sultanate of Oman · © MMXXVI</p>
            <Link
              href="/preview"
              className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Other studies
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
