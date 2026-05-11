"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { getFeaturedProducts, getLimitedProducts } from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

const featured = getFeaturedProducts(8);
const limited = getLimitedProducts(4);
const hero = featured[0];
const gallery = featured.slice(1, 8);

// Gallery palette — very dark with white text
const GL = {
  bg: "#080808",
  overlay: "rgba(8,8,8,0.72)",
  overlayStrong: "rgba(8,8,8,0.88)",
  text: "#F0F0EE",
  textMuted: "#909090",
  textDim: "#555555",
  border: "#1A1A1A",
  borderMuted: "rgba(255,255,255,0.08)",
} as const;

// Individual scroll-reveal card
function GalleryItem({
  product,
  index,
}: {
  product: ReturnType<typeof getFeaturedProducts>[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <a
        href="#"
        className="group block relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30"
        style={{ borderRadius: "2px" }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div style={{ background: GL.border, width: "100%", height: "100%" }} />
          )}

          {/* Gradient overlay — strong at bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.15) 40%, rgba(8,8,8,0.85) 100%)",
            }}
          />

          {/* Lot number — top left */}
          <span
            className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Lot {String(index + 2).padStart(3, "0")}
          </span>

          {/* Limited badge — top right */}
          {product.is_limited_edition && (
            <span
              className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.24em] px-2 py-1"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.7)",
                background: "rgba(8,8,8,0.5)",
              }}
            >
              Numbered
            </span>
          )}

          {/* Caption at bottom */}
          <div className="absolute left-4 right-4 bottom-4">
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {product.brand} · {product.scale}
            </p>
            <p
              className="mt-1 font-display text-sm leading-snug line-clamp-2"
              style={{ color: GL.text }}
            >
              {product.name}
            </p>
            <p
              className="mt-2 font-display text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {formatCurrencyOMR(product.price)}
            </p>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function LandingGallery() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{ background: GL.bg, color: GL.text }}
      >
        {/* ── Full-viewport hero ── */}
        <section className="relative h-screen min-h-[600px] flex items-end">
          {/* Background image */}
          {hero?.images?.[0] && (
            <div className="absolute inset-0">
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Deep overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.3) 40%, rgba(8,8,8,0.88) 100%)",
            }}
          />

          {/* Minimal top nav */}
          <nav
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 h-16"
            style={{ background: "transparent" }}
          >
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] transition-opacity hover:opacity-60"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Studies
            </Link>
            <p
              className="font-display text-base tracking-tight"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Diecast Muscat
            </p>
            <span
              className="text-[10px] uppercase tracking-[0.4em] hidden sm:block"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Gallery Edition
            </span>
          </nav>

          {/* Hero content — lot number + name, centered */}
          <div className="relative z-10 w-full pb-20 lg:pb-28 text-center px-6">
            <motion.p
              className="text-[10px] uppercase tracking-[0.48em] mb-5"
              style={{ color: "rgba(255,255,255,0.45)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Lot 001 · Preview Exhibition
            </motion.p>

            <motion.h1
              className="font-display italic mx-auto max-w-3xl leading-[0.9]"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                fontWeight: 500,
                color: GL.text,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {hero?.name ?? "Curator's Selection"}
            </motion.h1>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.45)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {hero?.brand && <span>{hero.brand}</span>}
              {hero?.scale && <span>Scale {hero.scale}</span>}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                {hero ? formatCurrencyOMR(hero.price) : ""}
              </span>
            </motion.div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="#gallery"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] pb-1 transition-opacity hover:opacity-60"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                View exhibition
              </a>
            </motion.div>
          </div>

          {/* Hairline bottom rule */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
          />
        </section>

        {/* ── Exhibition intro ── */}
        <section
          id="gallery"
          className="py-20 lg:py-28"
          style={{ borderBottom: `1px solid ${GL.border}` }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div className="lg:col-span-2">
              <p
                className="text-[10px] uppercase tracking-[0.4em] mb-6"
                style={{ color: GL.textMuted }}
              >
                Spring 2026 · Muscat, Sultanate of Oman
              </p>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight"
                style={{ color: GL.text, fontWeight: 500 }}
              >
                A private viewing of
                <br />
                <em style={{ fontStyle: "italic" }}>authenticated objects</em>
              </h2>
              <p
                className="mt-6 text-base lg:text-lg leading-relaxed max-w-xl"
                style={{ color: GL.textMuted }}
              >
                Each piece in this exhibition has been sourced, examined, and
                catalogued by our curatorial team. Scale models presented as
                they deserve — as sculpture, as craft, as investment.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-6">
              {[
                { label: "Objects", value: `${featured.length}` },
                { label: "Numbered editions", value: `${limited.length}` },
                { label: "Opening season", value: "Spring 2026" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between py-4"
                  style={{ borderBottom: `1px solid ${GL.border}` }}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.28em]"
                    style={{ color: GL.textMuted }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-display text-base"
                    style={{ color: GL.text }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Scroll-reveal gallery grid ── */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <div className="mb-12 lg:mb-16 flex items-end justify-between">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] mb-3"
                  style={{ color: GL.textMuted }}
                >
                  On Exhibition
                </p>
                <h2
                  className="font-display text-2xl sm:text-3xl"
                  style={{ color: GL.text, fontWeight: 500 }}
                >
                  Lots 002 — 008
                </h2>
              </div>
              <p
                className="hidden sm:block text-[10px] uppercase tracking-[0.32em]"
                style={{ color: GL.textDim }}
              >
                Scroll to reveal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {gallery.map((product, i) => (
                <GalleryItem key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured limited edition — full bleed spotlight ── */}
        {limited[0] && (
          <section
            className="relative overflow-hidden"
            style={{ background: "#0E0E0E" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Image half */}
              <div className="relative aspect-[16/10] lg:aspect-auto">
                {limited[0].images?.[0] && (
                  <Image
                    src={limited[0].images[0]}
                    alt={limited[0].name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 pointer-events-none lg:hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(14,14,14,0.95) 100%)",
                  }}
                />
              </div>

              {/* Copy half */}
              <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-20">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.4em] mb-6"
                    style={{ color: GL.textMuted }}
                  >
                    Featured Lot · Numbered Edition
                  </p>
                  <h2
                    className="font-display italic text-3xl sm:text-4xl lg:text-5xl leading-tight"
                    style={{ color: GL.text, fontWeight: 500 }}
                  >
                    {limited[0].name}
                  </h2>
                  <p
                    className="mt-6 text-base leading-relaxed"
                    style={{ color: GL.textMuted }}
                  >
                    {limited[0].description}
                  </p>

                  <div
                    className="mt-8 grid grid-cols-2 gap-px overflow-hidden"
                    style={{ background: GL.border }}
                  >
                    {[
                      { label: "Maison", value: limited[0].brand ?? "—" },
                      { label: "Scale", value: limited[0].scale ?? "—" },
                      { label: "Edition", value: "Numbered" },
                      { label: "Estimate", value: formatCurrencyOMR(limited[0].price) },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="px-5 py-4"
                        style={{ background: "#0E0E0E" }}
                      >
                        <p
                          className="text-[9px] uppercase tracking-[0.28em]"
                          style={{ color: GL.textDim }}
                        >
                          {s.label}
                        </p>
                        <p
                          className="mt-1 font-display text-sm"
                          style={{ color: GL.text }}
                        >
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#"
                    className="mt-10 inline-flex items-center gap-2 h-12 px-8 text-xs uppercase tracking-[0.18em] font-sans border transition-opacity hover:opacity-70 focus:outline-none"
                    style={{
                      borderColor: "rgba(255,255,255,0.25)",
                      color: GL.text,
                    }}
                  >
                    Enquire about this lot
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA — appointment ── */}
        <section
          className="py-28 lg:py-36"
          style={{ background: GL.bg }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Hairline rule */}
              <div
                className="mx-auto mb-10"
                style={{
                  height: "1px",
                  width: "80px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />

              <p
                className="text-[10px] uppercase tracking-[0.48em] mb-6"
                style={{ color: GL.textMuted }}
              >
                Private Viewing
              </p>
              <h2
                className="font-display italic text-3xl sm:text-4xl lg:text-5xl mx-auto max-w-2xl leading-tight"
                style={{ color: GL.text, fontWeight: 400 }}
              >
                Viewing by appointment
              </h2>
              <p
                className="mt-6 text-base max-w-sm mx-auto leading-relaxed"
                style={{ color: GL.textMuted }}
              >
                Our most significant lots are presented privately. Register your
                interest to receive a personal invitation.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-10 text-xs uppercase tracking-[0.18em] font-sans border transition-opacity hover:opacity-70 focus:outline-none"
                  style={{
                    borderColor: "rgba(255,255,255,0.25)",
                    color: GL.text,
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Request appointment
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 h-12 px-10 text-xs uppercase tracking-[0.18em] font-sans transition-opacity hover:opacity-60"
                  style={{ color: GL.textMuted }}
                >
                  Download catalogue
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-12"
          style={{ borderTop: `1px solid ${GL.border}` }}
        >
          <div
            className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs"
            style={{ color: GL.textDim }}
          >
            <p
              className="font-display text-lg"
              style={{ color: GL.textMuted }}
            >
              Diecast Muscat
            </p>
            <p>Sultanate of Oman · Gallery Edition · © MMXXVI</p>
            <Link
              href="/preview"
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
              style={{ color: GL.textMuted }}
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
