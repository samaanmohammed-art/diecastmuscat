"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Minus } from "lucide-react";
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

// Ivory palette — inline styles required (no Tailwind token)
const IV = {
  bg: "#F5F0E8",
  surface: "#EDEAE0",
  border: "#DDD8CC",
  text: "#1A1A1A",
  textMuted: "#6B6660",
  textDim: "#9C9890",
  gold: "#B08A20",
  goldLight: "#D4AF37",
} as const;

export default function LandingIvory() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{ background: IV.bg, color: IV.text, fontFamily: "var(--font-sans)" }}
      >
        {/* Faint grid */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            zIndex: 0,
          }}
          aria-hidden
        />

        {/* ── Nav strip ── */}
        <header
          className="sticky top-0 z-30"
          style={{
            background: `${IV.bg}e8`,
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${IV.border}`,
          }}
        >
          <div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          >
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] transition-opacity hover:opacity-60"
              style={{ color: IV.textMuted }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Studies
            </Link>

            <p
              className="font-display text-base tracking-tight"
              style={{ color: IV.text }}
            >
              Diecast Muscat
            </p>

            <nav className="hidden md:flex items-center gap-1">
              {["Cars", "Aviation", "Motorcycles", "Collection"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors"
                  style={{ color: IV.textMuted }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = IV.text)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = IV.textMuted)
                  }
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="relative" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-24 lg:pb-36">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left: editorial copy */}
              <div>
                {/* Thin gold rule */}
                <motion.div
                  className="mb-8"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{
                    height: "1px",
                    width: "80px",
                    background: IV.gold,
                  }}
                />

                <motion.p
                  className="text-[10px] uppercase tracking-[0.4em] mb-6"
                  style={{ color: IV.gold }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  Ivory Atelier · Spring 2026
                </motion.p>

                <div className="overflow-hidden">
                  <motion.h1
                    className="font-display leading-[0.88] tracking-tight"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 7.5rem)",
                      color: IV.text,
                      fontWeight: 700,
                    }}
                    initial={{ y: 80 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    Precision
                    <br />
                    <em
                      style={{ color: IV.gold, fontStyle: "italic", fontWeight: 500 }}
                    >
                      preserved.
                    </em>
                  </motion.h1>
                </div>

                <motion.p
                  className="mt-8 text-base lg:text-lg leading-relaxed max-w-md"
                  style={{ color: IV.textMuted }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  A curated atelier of authenticated die-cast objects, presented
                  with the care of an auction house. Each piece catalogued,
                  numbered, and delivered.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-wrap items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans transition-all focus:outline-none rounded-sm"
                    style={{
                      background: IV.text,
                      color: IV.bg,
                    }}
                  >
                    View the Catalogue
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans border transition-colors focus:outline-none rounded-sm"
                    style={{
                      borderColor: IV.border,
                      color: IV.text,
                    }}
                  >
                    Numbered editions
                  </a>
                </motion.div>

                {/* Pull-quote */}
                <motion.blockquote
                  className="mt-12 pl-5 text-sm italic leading-relaxed"
                  style={{
                    borderLeft: `2px solid ${IV.gold}`,
                    color: IV.textMuted,
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  &ldquo;Each model is inspected, catalogued, and presented as it should
                  be — under glass, with provenance.&rdquo;
                </motion.blockquote>
              </div>

              {/* Right: product image — slides in from right */}
              {hero && (
                <motion.figure
                  className="relative"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-sm"
                    style={{
                      border: `1px solid ${IV.border}`,
                      boxShadow: "0 20px 60px -10px rgba(0,0,0,0.14)",
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
                    {/* Subtle vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(245,240,232,0.5) 100%)",
                      }}
                    />
                  </div>
                  {/* Caption below — auction-house style */}
                  <figcaption
                    className="mt-4 flex items-start justify-between gap-4"
                    style={{ borderTop: `1px solid ${IV.border}`, paddingTop: "1rem" }}
                  >
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.32em]"
                        style={{ color: IV.gold }}
                      >
                        Lot 001 · Featured
                      </p>
                      <p
                        className="mt-1 font-display text-base leading-tight"
                        style={{ color: IV.text }}
                      >
                        {hero.name}
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: IV.textMuted }}
                      >
                        {hero.brand} · Scale {hero.scale}
                      </p>
                    </div>
                    <p
                      className="font-display text-lg shrink-0"
                      style={{ color: IV.text }}
                    >
                      {formatCurrencyOMR(hero.price)}
                    </p>
                  </figcaption>
                </motion.figure>
              )}
            </div>
          </div>
        </section>

        {/* ── Catalogue grid ── */}
        <section
          className="py-24 lg:py-32"
          style={{ borderTop: `1px solid ${IV.border}`, zIndex: 1 }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 lg:mb-16 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Minus className="h-3 w-3" style={{ color: IV.gold }} />
                  <p
                    className="text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: IV.gold }}
                  >
                    The Catalogue
                  </p>
                </div>
                <h2
                  className="font-display text-3xl sm:text-4xl"
                  style={{ color: IV.text }}
                >
                  Currently on view
                </h2>
              </div>
              <a
                href="#"
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] pb-1 transition-opacity hover:opacity-60"
                style={{
                  borderBottom: `1px solid ${IV.border}`,
                  color: IV.textMuted,
                }}
              >
                Full catalogue <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featured.slice(0, 6).map((product, i) => (
                <motion.a
                  key={product.id}
                  href="#"
                  className="group block"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  {/* Image */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-sm mb-5"
                    style={{
                      border: `1px solid ${IV.border}`,
                      background: IV.surface,
                      boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)",
                    }}
                  >
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    {product.is_limited_edition && (
                      <span
                        className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-sm"
                        style={{
                          background: IV.bg,
                          border: `1px solid ${IV.gold}`,
                          color: IV.gold,
                        }}
                      >
                        Numbered
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <p
                    className="text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: IV.gold }}
                  >
                    Lot {String(i + 1).padStart(3, "0")}
                  </p>
                  <p
                    className="mt-1.5 font-display text-base leading-snug group-hover:opacity-70 transition-opacity"
                    style={{ color: IV.text }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: IV.textMuted }}
                  >
                    {product.brand} · {product.scale}
                  </p>
                  <div
                    className="mt-3 flex items-center justify-between pt-3"
                    style={{ borderTop: `1px solid ${IV.border}` }}
                  >
                    <p
                      className="font-display text-base"
                      style={{ color: IV.text }}
                    >
                      {formatCurrencyOMR(product.price)}
                    </p>
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] transition-opacity group-hover:opacity-60"
                      style={{ color: IV.textMuted }}
                    >
                      View →
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ── */}
        <section
          className="py-24 lg:py-32"
          style={{ background: IV.surface, zIndex: 1 }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              className="mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ height: "1px", width: "60px", background: IV.gold, margin: "0 auto 2rem" }}
            />
            <p
              className="text-[10px] uppercase tracking-[0.4em] mb-6"
              style={{ color: IV.gold }}
            >
              First Access
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl italic mx-auto max-w-xl"
              style={{ color: IV.text, fontWeight: 600 }}
            >
              Viewing by appointment
            </h2>
            <p
              className="mt-6 text-base max-w-sm mx-auto leading-relaxed"
              style={{ color: IV.textMuted }}
            >
              Our most significant pieces are reserved for collectors on the
              waitlist. Request early access to upcoming lots.
            </p>
            <a
              href="#"
              className="mt-10 inline-flex items-center gap-2 h-12 px-10 text-xs uppercase tracking-[0.18em] font-sans rounded-sm transition-opacity hover:opacity-80 focus:outline-none"
              style={{
                background: IV.text,
                color: IV.bg,
              }}
            >
              Request access
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-12"
          style={{ borderTop: `1px solid ${IV.border}`, zIndex: 1 }}
        >
          <div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs"
            style={{ color: IV.textDim }}
          >
            <p className="font-display text-lg" style={{ color: IV.text }}>
              Diecast Muscat
            </p>
            <p>Sultanate of Oman · © MMXXVI</p>
            <Link
              href="/preview"
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
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
