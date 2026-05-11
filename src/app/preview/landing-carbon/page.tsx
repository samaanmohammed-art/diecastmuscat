"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Gauge } from "lucide-react";
import { getFeaturedProducts } from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

const featured = getFeaturedProducts(6);
const hero = featured[0];

// Carbon palette
const CB = {
  bg: "#0D0D0F",
  surface: "#141417",
  surfaceElevated: "#1A1A1E",
  border: "#222226",
  borderStrong: "#2E2E34",
  text: "#F0F0EE",
  textMuted: "#8A8A90",
  textDim: "#5A5A60",
  red: "#C0392B",
  redMuted: "#8B2920",
  redGlow: "rgba(192,57,43,0.25)",
} as const;

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.04,
      ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export default function LandingCarbon() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{ background: CB.bg, color: CB.text, fontFamily: "var(--font-sans)" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            zIndex: 0,
          }}
          aria-hidden
        />
        {/* Red corner accent */}
        <div
          className="pointer-events-none fixed top-0 right-0"
          style={{
            width: "40vw",
            height: "40vw",
            background: `radial-gradient(circle at 100% 0%, ${CB.redGlow} 0%, transparent 60%)`,
            zIndex: 0,
          }}
          aria-hidden
        />

        {/* ── Nav ── */}
        <header
          className="sticky top-0 z-30"
          style={{
            background: `${CB.bg}cc`,
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${CB.border}`,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] transition-colors"
              style={{ color: CB.textMuted }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Studies
            </Link>

            <p
              className="font-display text-base tracking-tight uppercase"
              style={{ color: CB.text, letterSpacing: "0.08em" }}
            >
              {"DM "}
              <span style={{ color: CB.red }}>{"///"}</span>
            </p>

            <nav className="hidden md:flex items-center gap-1">
              {["Cars", "Aviation", "Series", "Specs"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors"
                  style={{ color: CB.textMuted }}
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: bold staggered headline */}
            <div>
              {/* Red eyebrow bar */}
              <div className="flex items-center gap-3 mb-8">
                <span
                  className="inline-block w-8 h-px"
                  style={{ background: CB.red }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: CB.red }}
                >
                  Carbon Series · 2026
                </p>
              </div>

              {/* Staggered letter-by-letter */}
              <h1
                className="font-display uppercase leading-[0.88]"
                style={{
                  fontSize: "clamp(3rem, 9vw, 8.5rem)",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                }}
                aria-label="Carbon Series"
              >
                <motion.span
                  initial="hidden"
                  animate="visible"
                  style={{ display: "block" }}
                >
                  {"CARBON".split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterVariants}
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
                <motion.span
                  initial="hidden"
                  animate="visible"
                  style={{ display: "block", color: CB.red }}
                >
                  {"SERIES".split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      custom={i + 7}
                      variants={letterVariants}
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>

              {/* Timing-board sub */}
              <motion.div
                className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: CB.textMuted }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Gauge className="h-3.5 w-3.5" style={{ color: CB.red }} />
                Industrial · Precision · Die-cast
              </motion.div>

              <motion.p
                className="mt-6 text-base lg:text-lg leading-relaxed max-w-md"
                style={{ color: CB.textMuted }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Engineering elevated to art. Die-cast collectibles engineered
                for collectors who demand performance — in detail, in finish, in
                provenance.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans transition-all focus:outline-none rounded-sm"
                  style={{ background: CB.red, color: "#fff" }}
                >
                  Enter the Series
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans border transition-colors rounded-sm"
                  style={{ borderColor: CB.borderStrong, color: CB.text }}
                >
                  View Specs
                </a>
              </motion.div>

              {/* Timing board stats */}
              <motion.div
                className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-sm"
                style={{ background: CB.border }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                {[
                  { label: "Models", value: "140+" },
                  { label: "Scales", value: "1:12–1:64" },
                  { label: "GCC Ship", value: "14d" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="px-4 py-4"
                    style={{ background: CB.surface }}
                  >
                    <p
                      className="font-display text-xl"
                      style={{ color: CB.red }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="mt-1 text-[9px] uppercase tracking-[0.3em]"
                      style={{ color: CB.textDim }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: hero product with red accent stripe */}
            {hero && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div
                  className="relative overflow-hidden rounded-sm"
                  style={{
                    border: `1px solid ${CB.borderStrong}`,
                    boxShadow: `0 0 40px ${CB.redGlow}`,
                  }}
                >
                  {/* Red accent stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 z-10"
                    style={{ background: CB.red }}
                  />
                  <div className="relative aspect-[4/3] overflow-hidden">
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
                    {/* Dark overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 40%, rgba(13,13,15,0.8) 100%)",
                      }}
                    />
                    {/* Lot tag */}
                    <div className="absolute top-4 right-4">
                      <span
                        className="text-[9px] uppercase tracking-[0.32em] px-2.5 py-1.5 rounded-sm font-mono"
                        style={{
                          background: CB.red,
                          color: "#fff",
                        }}
                      >
                        #001
                      </span>
                    </div>
                    {/* Caption */}
                    <div className="absolute left-5 right-5 bottom-5">
                      <p
                        className="text-[9px] uppercase tracking-[0.32em]"
                        style={{ color: CB.red }}
                      >
                        {hero.brand} · {hero.scale}
                      </p>
                      <p
                        className="mt-1 font-display text-base uppercase tracking-wide"
                        style={{ color: CB.text, fontWeight: 700 }}
                      >
                        {hero.name}
                      </p>
                    </div>
                  </div>
                  {/* Spec row */}
                  <div
                    className="grid grid-cols-3 gap-px"
                    style={{ background: CB.border }}
                  >
                    {[
                      { label: "Maker", value: hero.brand ?? "—" },
                      { label: "Scale", value: hero.scale ?? "—" },
                      { label: "Price", value: formatCurrencyOMR(hero.price) },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="px-4 py-3"
                        style={{ background: CB.surfaceElevated }}
                      >
                        <p
                          className="text-[9px] uppercase tracking-[0.28em]"
                          style={{ color: CB.textDim }}
                        >
                          {s.label}
                        </p>
                        <p
                          className="mt-1 font-display text-sm"
                          style={{ color: CB.text }}
                        >
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Product grid with red accents ── */}
        <section
          className="py-24 lg:py-32"
          style={{ borderTop: `1px solid ${CB.border}`, zIndex: 1 }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 lg:mb-16 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block h-px w-8"
                    style={{ background: CB.red }}
                  />
                  <p
                    className="text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: CB.red }}
                  >
                    Active Series
                  </p>
                </div>
                <h2
                  className="font-display uppercase text-3xl sm:text-4xl"
                  style={{ color: CB.text, letterSpacing: "0.04em", fontWeight: 800 }}
                >
                  Current Inventory
                </h2>
              </div>
              <a
                href="#"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors"
                style={{ color: CB.textMuted }}
              >
                Full list <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.slice(0, 6).map((product, i) => (
                <motion.a
                  key={product.id}
                  href="#"
                  className="group block overflow-hidden rounded-sm focus:outline-none"
                  style={{
                    background: CB.surface,
                    border: `1px solid ${CB.border}`,
                  }}
                  whileHover={{ y: -3, borderColor: CB.red }}
                  transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    )}
                    {/* Red stripe on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-left"
                      style={{ background: CB.red }}
                    />
                    {/* Number badge */}
                    <span
                      className="absolute top-3 left-3 text-[9px] font-mono tracking-wider px-2 py-1"
                      style={{
                        background: "rgba(13,13,15,0.7)",
                        border: `1px solid ${CB.border}`,
                        color: CB.textMuted,
                      }}
                    >
                      #{String(i + 1).padStart(3, "0")}
                    </span>
                    {product.is_limited_edition && (
                      <span
                        className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] px-2 py-1"
                        style={{
                          background: CB.red,
                          color: "#fff",
                        }}
                      >
                        Ltd
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p
                      className="text-[9px] uppercase tracking-[0.28em]"
                      style={{ color: CB.textDim }}
                    >
                      {product.brand} · {product.scale}
                    </p>
                    <p
                      className="mt-1.5 font-display text-sm uppercase tracking-wide leading-snug line-clamp-1"
                      style={{ color: CB.text, fontWeight: 700 }}
                    >
                      {product.name}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p
                        className="font-display text-base"
                        style={{ color: CB.red }}
                      >
                        {formatCurrencyOMR(product.price)}
                      </p>
                      <span
                        className="text-[9px] uppercase tracking-[0.24em] transition-colors group-hover:text-white"
                        style={{ color: CB.textDim }}
                      >
                        Spec sheet →
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA — racing finish line ── */}
        <section
          className="py-24 lg:py-32 relative overflow-hidden"
          style={{ background: CB.surface, zIndex: 1 }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 59px, ${CB.border} 59px, ${CB.border} 60px)`,
              opacity: 0.4,
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="text-[10px] uppercase tracking-[0.4em] mb-6"
              style={{ color: CB.red }}
            >
              Request Access
            </p>
            <h2
              className="font-display uppercase text-3xl sm:text-4xl lg:text-5xl mx-auto max-w-xl"
              style={{ color: CB.text, fontWeight: 900, letterSpacing: "0.04em" }}
            >
              Claim your series
            </h2>
            <p
              className="mt-6 text-base max-w-sm mx-auto leading-relaxed"
              style={{ color: CB.textMuted }}
            >
              Limited run pieces don&apos;t wait. Join the list and receive early
              access to numbered editions before public listing.
            </p>
            <a
              href="#"
              className="mt-10 inline-flex items-center gap-2 h-12 px-10 text-xs uppercase tracking-[0.18em] font-sans rounded-sm transition-all focus:outline-none"
              style={{
                border: `1px solid ${CB.red}`,
                color: CB.red,
                background: "transparent",
              }}
            >
              Request Access
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-12"
          style={{ borderTop: `1px solid ${CB.border}`, zIndex: 1 }}
        >
          <div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs"
            style={{ color: CB.textDim }}
          >
            <p
              className="font-display text-lg uppercase tracking-wider"
              style={{ color: CB.text }}
            >
              {"DM "}<span style={{ color: CB.red }}>{"///"}</span>
            </p>
            <p>Sultanate of Oman · © MMXXVI</p>
            <Link
              href="/preview"
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
              style={{ color: CB.textMuted }}
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
