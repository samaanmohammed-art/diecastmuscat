"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, X, ArrowRight } from "lucide-react";
import type { Product } from "@/types/database";
import {
  SAMPLE_PRODUCTS,
  getProductsByCategory,
  getFeaturedProducts,
  getLimitedProducts,
  ALL_BRANDS,
} from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

/* ---------- palette ---------- */
const BG = "#F1EDE4";
const PANEL = "#FBF9F3";
const INK = "#1C1A16";
const MUTED = "#6B6657";
const FAINT = "#9C9686";
const ACCENT = "#9A7B4F";
const LINE = "rgba(28,26,22,0.10)";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- helpers ---------- */
const LOT_INDEX = new Map(SAMPLE_PRODUCTS.map((p, i) => [p.id, i + 1]));
const lotNo = (p: Product) =>
  String(LOT_INDEX.get(p.id) ?? 0).padStart(3, "0");

const SHELVES = [
  { key: "cars", label: "Cars", note: "Road, race and hypercar." },
  { key: "planes", label: "Aviation", note: "Commercial and military, to scale." },
  { key: "trucks", label: "Trucks", note: "Long-haul and show champions." },
  { key: "bikes", label: "Motorcycles", note: "Superbikes and cruisers." },
] as const;

const hero = getFeaturedProducts(1)[0];
const curator = getLimitedProducts(1)[0];
const limited = getLimitedProducts(4);

/* ---------- brass nameplate ---------- */
function Nameplate({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      className="inline-flex flex-col items-center rounded-[3px] px-5 py-2"
      style={{
        background: "linear-gradient(180deg,#CDBC95 0%,#A98E5F 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 2px 6px rgba(28,26,22,0.2)",
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.26em]"
        style={{ color: "#352B17", textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}
      >
        {title}
      </span>
      <span
        className="mt-0.5 text-[8px] uppercase tracking-[0.3em]"
        style={{ color: "#5A4B2C" }}
      >
        {sub}
      </span>
    </div>
  );
}

/* ---------- product card (sits on a shelf) ---------- */
function ProductCard({
  p,
  onOpen,
}: {
  p: Product;
  onOpen: (p: Product) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(p)}
      whileHover={{ y: -7 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex w-[210px] flex-shrink-0 snap-start flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B4F] sm:w-[248px]"
      aria-label={`${p.name} — ${formatCurrencyOMR(p.price)}`}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
        style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
      >
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
          sizes="248px"
        />
        {p.is_limited_edition && (
          <span
            className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.2em]"
            style={{ background: INK, color: "#F1EDE4" }}
          >
            Numbered
          </span>
        )}
      </div>
      {/* contact shadow on the shelf */}
      <div
        aria-hidden
        className="mx-auto -mt-1 h-3 w-[78%] transition-all duration-300 group-hover:w-[68%] group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(ellipse, rgba(28,26,22,0.20), transparent 72%)",
          filter: "blur(3px)",
        }}
      />
      <div className="px-1 pt-1.5">
        <p
          className="text-[9px] font-medium uppercase tracking-[0.22em]"
          style={{ color: ACCENT }}
        >
          Lot {lotNo(p)} · {p.scale}
        </p>
        <h4
          className="mt-1 truncate text-sm font-medium"
          style={{ color: INK }}
        >
          {p.name}
        </h4>
        <p
          className="mt-1 text-sm font-medium tabular-nums"
          style={{ color: MUTED }}
        >
          {formatCurrencyOMR(p.price)}
        </p>
      </div>
    </motion.button>
  );
}

/* ---------- a cabinet shelf ---------- */
function Shelf({
  label,
  note,
  products,
  onOpen,
}: {
  label: string;
  note: string;
  products: Product[];
  onOpen: (p: Product) => void;
}) {
  if (products.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto max-w-6xl"
    >
      <div className="mb-4 flex items-end justify-between px-5 sm:px-8">
        <div>
          <h3
            className="font-display text-2xl tracking-tight sm:text-[1.9rem]"
            style={{ color: INK }}
          >
            {label}
          </h3>
          <p className="mt-1 text-xs" style={{ color: MUTED }}>
            {note}
          </p>
        </div>
        <span
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.24em]"
          style={{ color: FAINT }}
        >
          {products.length} pieces
        </span>
      </div>

      {/* the glass shelf */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 h-px sm:inset-x-8"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
          }}
        />
        <div
          className="shelf-scroll flex gap-4 overflow-x-auto px-5 pb-7 pt-7 sm:gap-5 sm:px-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 78%)",
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} p={p} onOpen={onOpen} />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute inset-x-4 bottom-0 h-px sm:inset-x-8"
          style={{ background: LINE }}
        />
      </div>
    </motion.section>
  );
}

/* ---------- quick-look ---------- */
function QuickLook({
  p,
  onClose,
  onAdd,
}: {
  p: Product;
  onClose: () => void;
  onAdd: () => void;
}) {
  const specs: { l: string; v: string }[] = [
    { l: "Marque", v: p.brand ?? "—" },
    { l: "Scale", v: p.scale ?? "—" },
    { l: "Condition", v: p.condition ?? "—" },
    {
      l: "Availability",
      v: p.stock > 0 ? `${p.stock} in the vault` : "Reserved",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      style={{ background: "rgba(20,18,14,0.46)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
    >
      <motion.div
        initial={{ y: 60, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.36, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl sm:max-w-3xl sm:rounded-2xl"
        style={{ background: PANEL, border: `1px solid ${LINE}` }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, color: INK }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <div
            className="relative aspect-[4/3] sm:aspect-auto"
            style={{ background: "#FFFFFF" }}
          >
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              className="object-cover"
              sizes="(max-width:640px) 100vw, 384px"
            />
          </div>

          <div className="p-6 sm:p-8">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.26em]"
              style={{ color: ACCENT }}
            >
              Lot {lotNo(p)}
              {p.is_limited_edition ? " · Numbered Edition" : ""}
            </p>
            <h3
              className="mt-2 font-display text-2xl leading-tight tracking-tight sm:text-3xl"
              style={{ color: INK }}
            >
              {p.name}
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              {p.description}
            </p>

            <div
              className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg"
              style={{ background: LINE }}
            >
              {specs.map((s) => (
                <div
                  key={s.l}
                  className="px-3 py-2.5"
                  style={{ background: PANEL }}
                >
                  <p
                    className="text-[8px] uppercase tracking-[0.24em]"
                    style={{ color: FAINT }}
                  >
                    {s.l}
                  </p>
                  <p
                    className="mt-0.5 text-xs font-medium capitalize"
                    style={{ color: INK }}
                  >
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: FAINT }}
                >
                  Price
                </p>
                <p
                  className="text-xl font-medium tabular-nums"
                  style={{ color: INK }}
                >
                  {formatCurrencyOMR(p.price)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ background: INK, color: BG }}
            >
              Add to Collection
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- page ---------- */
export default function CabinetPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState(0);

  const open = useCallback((p: Product) => setSelected(p), []);
  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <main className="relative w-full" style={{ background: BG, color: INK }}>
      <style>{`header,footer,nav[aria-label="Primary"]{display:none!important}`}</style>

      {/* ---------- header ---------- */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8"
        style={{
          background: "rgba(241,237,228,0.86)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div className="flex flex-col leading-none">
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: INK }}
          >
            Diecast Muscat
          </span>
          <span
            className="mt-0.5 text-[8px] uppercase tracking-[0.36em]"
            style={{ color: ACCENT }}
          >
            House of Crafts
          </span>
        </div>

        <nav className="hidden items-center gap-7 sm:flex">
          {["Collection", "Limited", "Makers", "About"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#9A7B4F]"
              style={{ color: MUTED }}
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(28,26,22,0.05)]"
            style={{ color: INK }}
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Collection — ${cart} items`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(28,26,22,0.05)]"
            style={{ color: INK }}
          >
            <ShoppingBag className="h-4 w-4" />
            {cart > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold tabular-nums"
                style={{ background: ACCENT, color: "#FFFFFF" }}
              >
                {cart}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ---------- hero / the vitrine ---------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-24 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p
            className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em]"
            style={{ color: ACCENT }}
          >
            Diecast Muscat — House of Crafts
          </p>
          <h1
            className="font-display text-[2.7rem] leading-[1.02] tracking-tight sm:text-6xl"
            style={{ color: INK }}
          >
            The collector&rsquo;s
            <br />
            cabinet.
          </h1>
          <p
            className="mt-5 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ color: MUTED }}
          >
            Die-cast scale models, curated and kept under glass. Every piece
            numbered, every piece exact — from 1:64 city cars to 1:12
            superbikes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#collection"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
              style={{ background: INK, color: BG }}
            >
              Open the cabinet
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#limited"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:border-[#9A7B4F]"
              style={{ border: `1px solid ${LINE}`, color: INK }}
            >
              Limited editions
            </a>
          </div>
          <div
            className="mt-9 flex items-center gap-5 text-[10px] uppercase tracking-[0.24em]"
            style={{ color: FAINT }}
          >
            <span>{SAMPLE_PRODUCTS.length} pieces</span>
            <span style={{ color: LINE }}>|</span>
            <span>{ALL_BRANDS.length} makers</span>
            <span style={{ color: LINE }}>|</span>
            <span>Est. Muscat</span>
          </div>
        </motion.div>

        {/* the case */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="relative"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-6 sm:p-9"
            style={{
              background: `linear-gradient(180deg,${PANEL} 0%,#ECE7DB 100%)`,
              border: `1px solid ${LINE}`,
              boxShadow: "0 40px 80px -40px rgba(28,26,22,0.4)",
            }}
          >
            {/* glass top edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
              }}
            />
            {/* interior glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 45% at 50% 36%, rgba(255,250,238,0.85), transparent 75%)",
              }}
            />
            <button
              type="button"
              onClick={() => open(hero)}
              className="group relative block w-full focus:outline-none"
              aria-label={`View ${hero.name}`}
            >
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
                style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
              >
                <Image
                  src={hero.images[0]}
                  alt={hero.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                  sizes="(max-width:1024px) 90vw, 560px"
                />
              </div>
              <div
                aria-hidden
                className="mx-auto -mt-1 h-5 w-[70%]"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(28,26,22,0.22), transparent 72%)",
                  filter: "blur(6px)",
                }}
              />
            </button>
            <div className="relative mt-3 flex justify-center">
              <Nameplate
                title={hero.name}
                sub={`${hero.scale} · Lot ${lotNo(hero)}`}
              />
            </div>
          </div>
          <p
            className="mt-4 text-center text-[10px] uppercase tracking-[0.28em]"
            style={{ color: FAINT }}
          >
            Now in the case — the curator&rsquo;s opening piece
          </p>
        </motion.div>
      </section>

      {/* ---------- shelves ---------- */}
      <div id="collection" className="space-y-16 pb-8 lg:space-y-24">
        {SHELVES.map((s) => (
          <Shelf
            key={s.key}
            label={s.label}
            note={s.note}
            products={getProductsByCategory(s.key)}
            onOpen={open}
          />
        ))}
      </div>

      {/* ---------- curator's selection ---------- */}
      {curator && (
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="mx-auto my-20 max-w-6xl px-5 sm:px-8 lg:my-28"
        >
          <div
            className="grid items-center gap-8 rounded-2xl p-6 sm:p-10 lg:grid-cols-2 lg:gap-14"
            style={{ background: PANEL, border: `1px solid ${LINE}` }}
          >
            <button
              type="button"
              onClick={() => open(curator)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl focus:outline-none"
              style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
              aria-label={`View ${curator.name}`}
            >
              <Image
                src={curator.images[0]}
                alt={curator.name}
                fill
                className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                sizes="(max-width:1024px) 90vw, 480px"
              />
            </button>
            <div>
              <p
                className="text-[10px] font-medium uppercase tracking-[0.36em]"
                style={{ color: ACCENT }}
              >
                Curator&rsquo;s Selection
              </p>
              <h2
                className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl"
                style={{ color: INK }}
              >
                {curator.name}
              </h2>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: MUTED }}
              >
                {curator.description}
              </p>
              <p
                className="mt-4 border-l-2 pl-4 text-sm italic leading-relaxed"
                style={{ borderColor: ACCENT, color: INK }}
              >
                &ldquo;Of everything on the shelves this season, this is the one
                we would keep for ourselves.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-5">
                <span
                  className="text-lg font-medium tabular-nums"
                  style={{ color: INK }}
                >
                  {formatCurrencyOMR(curator.price)}
                </span>
                <button
                  type="button"
                  onClick={() => open(curator)}
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[#9A7B4F]"
                  style={{ color: INK }}
                >
                  Examine the piece
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ---------- limited editions ---------- */}
      <section
        id="limited"
        className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 lg:pb-28"
      >
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p
              className="mb-2 text-[10px] font-medium uppercase tracking-[0.36em]"
              style={{ color: ACCENT }}
            >
              The Locked Shelf
            </p>
            <h2
              className="font-display text-3xl tracking-tight sm:text-4xl"
              style={{ color: INK }}
            >
              Limited editions
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {limited.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => open(p)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: EASE }}
              className="group flex flex-col text-left focus:outline-none"
              aria-label={`View ${p.name}`}
            >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-xl"
                style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
              >
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                  sizes="(max-width:1024px) 50vw, 25vw"
                />
                <span
                  className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.2em]"
                  style={{ background: INK, color: BG }}
                >
                  Numbered
                </span>
              </div>
              <p
                className="mt-2.5 text-[9px] font-medium uppercase tracking-[0.22em]"
                style={{ color: ACCENT }}
              >
                Lot {lotNo(p)} · {p.scale}
              </p>
              <h4
                className="mt-1 truncate text-sm font-medium"
                style={{ color: INK }}
              >
                {p.name}
              </h4>
              <div className="mt-1 flex items-center justify-between">
                <span
                  className="text-sm font-medium tabular-nums"
                  style={{ color: MUTED }}
                >
                  {formatCurrencyOMR(p.price)}
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.16em]"
                  style={{ color: FAINT }}
                >
                  {p.stock} of 500 remain
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ---------- makers ---------- */}
      <section
        id="makers"
        className="border-y"
        style={{ borderColor: LINE, background: PANEL }}
      >
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p
            className="mb-7 text-center text-[10px] font-medium uppercase tracking-[0.36em]"
            style={{ color: FAINT }}
          >
            Trusted makers, kept on the shelves
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
            {ALL_BRANDS.map((b) => (
              <span
                key={b}
                className="font-display text-lg tracking-tight sm:text-xl"
                style={{ color: INK }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p
              className="text-[13px] font-semibold uppercase tracking-[0.26em]"
              style={{ color: INK }}
            >
              Diecast Muscat
            </p>
            <p
              className="mt-1 text-[9px] uppercase tracking-[0.36em]"
              style={{ color: ACCENT }}
            >
              House of Crafts
            </p>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: MUTED }}
            >
              A curated cabinet of die-cast scale models, kept and shipped from
              Muscat across the GCC.
            </p>
          </div>
          {[
            { h: "Browse", links: ["Cars", "Aviation", "Trucks", "Motorcycles"] },
            { h: "House", links: ["About", "Contact", "Returns", "F.A.Q."] },
          ].map((col) => (
            <div key={col.h}>
              <p
                className="mb-3 text-[10px] uppercase tracking-[0.28em]"
                style={{ color: FAINT }}
              >
                {col.h}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <span
                      className="text-sm transition-colors hover:text-[#9A7B4F]"
                      style={{ color: MUTED }}
                    >
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-12 flex flex-col gap-2 border-t pt-6 text-[10px] uppercase tracking-[0.22em] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: LINE, color: FAINT }}
        >
          <span>© MMXXVI Diecast Muscat — Muscat, Oman</span>
          <span>The collector&rsquo;s cabinet</span>
        </div>
      </footer>

      {/* ---------- quick-look ---------- */}
      <AnimatePresence>
        {selected && (
          <QuickLook
            p={selected}
            onClose={close}
            onAdd={() => {
              setCart((c) => c + 1);
              close();
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
