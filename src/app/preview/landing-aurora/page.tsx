"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Moon,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import { useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import { getFeaturedProducts, getLimitedProducts, SAMPLE_PRODUCTS } from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";
import type { Product } from "@/types/database";

const HIDE_CHROME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
  html, body { background: #0F0A1F !important; }
`;

const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

const AU = {
  base: "#0F0A1F",
  violet: "#A78BFA",
  cyan: "#67E8F9",
  rose: "#FDA4AF",
  amber: "#FBBF24",
  text: "#F8F4FF",
  textMuted: "rgba(248, 244, 255, 0.62)",
  textDim: "rgba(248, 244, 255, 0.42)",
  lavender: "#E0D4FF",
  glass1: "rgba(255, 255, 255, 0.05)",
  glass2: "rgba(255, 255, 255, 0.08)",
  glass3: "rgba(255, 255, 255, 0.12)",
  border1: "rgba(255, 255, 255, 0.08)",
  border2: "rgba(255, 255, 255, 0.15)",
  border3: "rgba(255, 255, 255, 0.22)",
} as const;

const SERIF: CSSProperties = {
  fontFamily: "'Instrument Serif', Georgia, serif",
  fontStyle: "italic",
  fontWeight: 400,
};

const SANS: CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
};

const featured = getFeaturedProducts(8);
const limited = getLimitedProducts(4);

const heroPicks = [featured[5] ?? featured[0], featured[1], featured[6] ?? featured[2]];
const showcasePiece = limited[2] ?? featured[5] ?? featured[0];
const limitedHero = limited[2] ?? limited[0] ?? featured[0];
const orbitalPieces = featured.slice(0, 6);

const CATEGORIES = [
  {
    slug: "cars",
    label: "Automobiles",
    caption: "Italian metal · German precision",
    image: SAMPLE_PRODUCTS[0]?.images?.[0] ?? "",
  },
  {
    slug: "planes",
    label: "Aviation",
    caption: "Liveried · Numbered · Stand-mounted",
    image: SAMPLE_PRODUCTS[9]?.images?.[0] ?? SAMPLE_PRODUCTS[2]?.images?.[0] ?? "",
  },
  {
    slug: "trucks",
    label: "Heavy Haul",
    caption: "Articulated · Detailed · Working",
    image: SAMPLE_PRODUCTS[4]?.images?.[0] ?? "",
  },
  {
    slug: "bikes",
    label: "Two Wheels",
    caption: "Carbon · Chrome · Leather",
    image: SAMPLE_PRODUCTS[6]?.images?.[0] ?? "",
  },
] as const;

function useReducedMotionPref(): boolean {
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const getSnapshot = () =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function useIsMobile(): boolean {
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  };
  const getSnapshot = () =>
    typeof window === "undefined" ? false : window.innerWidth < 768;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function AuroraBackground({ reduced }: { reduced: boolean }) {
  const baseBlob: CSSProperties = {
    position: "absolute",
    width: "62vw",
    height: "62vw",
    maxWidth: "900px",
    maxHeight: "900px",
    borderRadius: "50%",
    filter: "blur(120px)",
    mixBlendMode: "screen",
    pointerEvents: "none",
    willChange: "transform",
  };

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: AU.base }}
    >
      <motion.div
        style={{ ...baseBlob, background: AU.violet, opacity: 0.55, top: "-15%", left: "-10%" }}
        animate={reduced ? undefined : { x: ["-4%", "10%", "-2%", "-4%"], y: ["-2%", "8%", "14%", "-2%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ ...baseBlob, background: AU.cyan, opacity: 0.42, top: "-10%", right: "-15%" }}
        animate={reduced ? undefined : { x: ["0%", "-12%", "4%", "0%"], y: ["0%", "16%", "-6%", "0%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ ...baseBlob, background: AU.rose, opacity: 0.45, bottom: "-20%", left: "20%" }}
        animate={reduced ? undefined : { x: ["-2%", "8%", "-10%", "-2%"], y: ["6%", "-4%", "10%", "6%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ ...baseBlob, background: AU.amber, opacity: 0.18, bottom: "-25%", right: "-10%", width: "50vw", height: "50vw" }}
        animate={reduced ? undefined : { x: ["0%", "-6%", "4%", "0%"], y: ["0%", "-8%", "4%", "0%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 50% 50%, transparent 30%, rgba(15,10,31,0.55) 100%)",
        }}
      />
    </div>
  );
}

function GlassNav() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0.03, 0.12]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0.04, 0.12]);
  const bgColor = useTransform(bgOpacity, (v) => `rgba(255, 255, 255, ${v})`);
  const borderColor = useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`);

  return (
    <motion.nav
      style={{
        backgroundColor: bgColor,
        borderBottomColor: borderColor,
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
      }}
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-5 sm:px-10"
    >
      <Link
        href="/preview"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] transition-opacity hover:opacity-60"
        style={{ color: AU.textMuted, ...SANS }}
        aria-label="Back to studies"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Studies</span>
      </Link>
      <Link
        href="#top"
        className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2"
        style={{ color: AU.text, ...SANS }}
      >
        <Sparkles className="h-4 w-4" style={{ color: AU.lavender }} />
        <span className="text-xs sm:text-sm tracking-[0.34em] uppercase" style={{ fontWeight: 500 }}>
          Diecast
        </span>
      </Link>
      <div
        className="ml-auto hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.24em]"
        style={{ color: AU.textMuted, ...SANS }}
      >
        {["Collection", "Editions", "Atelier", "Contact"].map((l) => (
          <a key={l} href="#" className="hover:text-white transition-colors">
            {l}
          </a>
        ))}
      </div>
      <button
        type="button"
        className="ml-auto md:hidden inline-flex items-center justify-center h-8 px-3 rounded-full text-[10px] uppercase tracking-[0.28em]"
        style={{
          background: AU.glass2,
          border: `1px solid ${AU.border2}`,
          color: AU.text,
          ...SANS,
        }}
      >
        Menu
      </button>
    </motion.nav>
  );
}

function FloatingHeroCard({
  product,
  mx,
  my,
  multiplier,
  offsetX,
  rotate,
  delay,
  reduced,
}: {
  product: Product | undefined;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  multiplier: number;
  offsetX: number;
  rotate: number;
  delay: number;
  reduced: boolean;
}) {
  const x = useSpring(useTransform(mx, (v) => v * 40 * multiplier), { stiffness: 150, damping: 30 });
  const y = useSpring(useTransform(my, (v) => v * 40 * multiplier), { stiffness: 150, damping: 30 });
  const rotateY = useSpring(useTransform(mx, (v) => v * 8 * multiplier), { stiffness: 150, damping: 30 });
  const rotateX = useSpring(useTransform(my, (v) => -v * 6 * multiplier), { stiffness: 150, damping: 30 });

  if (!product) return null;

  return (
    <motion.div
      style={{
        x: reduced ? 0 : x,
        y: reduced ? 0 : y,
        rotateY: reduced ? 0 : rotateY,
        rotateX: reduced ? 0 : rotateX,
        rotate,
        translateX: offsetX,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-3xl p-3"
        style={{
          width: 220,
          background: AU.glass2,
          border: `1px solid ${AU.border2}`,
          backdropFilter: "blur(28px) saturate(140%)",
          WebkitBackdropFilter: "blur(28px) saturate(140%)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill sizes="220px" className="object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(15,10,31,0.7) 100%)" }}
          />
        </div>
        <div className="px-2 pt-3 pb-1">
          <p className="text-[9px] uppercase tracking-[0.28em]" style={{ color: AU.textDim, ...SANS }}>
            {product.brand} · {product.scale}
          </p>
          <p className="mt-1 text-base leading-snug" style={{ ...SERIF, color: AU.text }}>
            {product.name.split("—")[0]?.trim() ?? product.name}
          </p>
          <p className="mt-1 text-xs" style={{ color: AU.lavender, fontWeight: 300, ...SANS }}>
            {formatCurrencyOMR(product.price)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="top"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] flex flex-col items-center justify-start pt-32 sm:pt-36 pb-24 px-5"
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
        style={{
          background: AU.glass2,
          border: `1px solid ${AU.border2}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: AU.lavender,
          ...SANS,
        }}
      >
        <Sparkles className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-[0.32em]" style={{ fontWeight: 400 }}>
          House of Crafts
        </span>
      </motion.div>

      <h1
        className="mt-8 text-center"
        style={{
          color: AU.text,
          fontSize: "clamp(3.2rem, 12vw, 9rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          fontWeight: 200,
          ...SANS,
        }}
      >
        {["Worlds", "within"].map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="block"
          >
            {word}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
          className="block"
          style={{ ...SERIF, color: AU.lavender }}
        >
          worlds.
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-8 text-center text-base sm:text-lg max-w-md"
        style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}
      >
        Hand-finished die-cast models for those who notice everything.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="#collection"
          className="inline-flex items-center gap-2 h-12 px-7 rounded-full text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.14)",
            border: `1px solid ${AU.border3}`,
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            color: AU.text,
            boxShadow: "0 10px 30px -10px rgba(167,139,250,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
            ...SANS,
          }}
        >
          Explore Collection
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <a
          href="#showcase"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          style={{ color: AU.textMuted, ...SANS }}
        >
          <Play className="h-3.5 w-3.5" />
          Watch Film
        </a>
      </motion.div>

      <div
        className="relative mt-20 sm:mt-24 w-full max-w-3xl"
        style={{ height: "clamp(260px, 38vw, 360px)", transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <FloatingHeroCard product={heroPicks[0]} mx={mx} my={my} multiplier={0.6} offsetX={-200} rotate={-8} delay={0.5} reduced={reduced} />
          <FloatingHeroCard product={heroPicks[1]} mx={mx} my={my} multiplier={1.0} offsetX={0} rotate={0} delay={0.4} reduced={reduced} />
          <FloatingHeroCard product={heroPicks[2]} mx={mx} my={my} multiplier={0.8} offsetX={200} rotate={8} delay={0.6} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}

function FloatingPanel({
  children,
  mx,
  my,
  multiplier,
  className,
  style,
  reduced,
}: {
  children: React.ReactNode;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  multiplier: number;
  className?: string;
  style?: CSSProperties;
  reduced: boolean;
}) {
  const x = useSpring(useTransform(mx, (v) => v * 28 * multiplier), { stiffness: 150, damping: 30 });
  const y = useSpring(useTransform(my, (v) => v * 28 * multiplier), { stiffness: 150, damping: 30 });

  return (
    <motion.div
      style={{
        x: reduced ? 0 : x,
        y: reduced ? 0 : y,
        background: AU.glass2,
        border: `1px solid ${AU.border2}`,
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        boxShadow: "0 20px 50px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProductShowcase({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const isMobile = useIsMobile();
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  if (!showcasePiece) return null;

  return (
    <section
      id="showcase"
      className="relative px-5 py-32 sm:py-40"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-5" style={{ color: AU.lavender, ...SANS }}>
            Curation
          </p>
          <h2
            className="mx-auto"
            style={{ ...SERIF, color: AU.text, fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1 }}
          >
            The collection.
          </h2>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{
            height: isMobile ? "auto" : "clamp(480px, 60vw, 640px)",
            maxWidth: "880px",
            perspective: 1200,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mx-auto"
            style={{
              width: isMobile ? "100%" : "min(420px, 70%)",
              aspectRatio: "4 / 5",
              borderRadius: 28,
              overflow: "hidden",
              background: AU.glass2,
              border: `1px solid ${AU.border2}`,
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              boxShadow: "0 50px 120px -30px rgba(167,139,250,0.35), inset 0 1px 0 rgba(255,255,255,0.14)",
            }}
          >
            <div className="relative w-full h-full p-3">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                {showcasePiece.images?.[0] && (
                  <Image
                    src={showcasePiece.images[0]}
                    alt={showcasePiece.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 60%, rgba(15,10,31,0.6) 100%)" }}
                />
              </div>
            </div>
          </motion.div>

          {!isMobile && (
            <>
              <FloatingPanel mx={mx} my={my} multiplier={0.8} reduced={reduced} className="absolute rounded-2xl px-5 py-4" style={{ top: "8%", left: "-4%", width: 200 }}>
                <p className="text-[9px] uppercase tracking-[0.32em] mb-3" style={{ color: AU.textDim, ...SANS }}>
                  Specification
                </p>
                <ul className="space-y-2 text-xs" style={{ color: AU.text, ...SANS, fontWeight: 300 }}>
                  <li className="flex justify-between"><span style={{ color: AU.textMuted }}>Scale</span><span>{showcasePiece.scale}</span></li>
                  <li className="flex justify-between"><span style={{ color: AU.textMuted }}>Maison</span><span>{showcasePiece.brand}</span></li>
                  <li className="flex justify-between"><span style={{ color: AU.textMuted }}>Edition</span><span>0007 / 0099</span></li>
                </ul>
              </FloatingPanel>

              <FloatingPanel mx={mx} my={my} multiplier={1.0} reduced={reduced} className="absolute rounded-2xl px-5 py-4" style={{ top: "4%", right: "-2%", width: 180 }}>
                <p className="text-[9px] uppercase tracking-[0.32em] mb-2" style={{ color: AU.textDim, ...SANS }}>
                  Estimate
                </p>
                <p className="text-2xl" style={{ ...SERIF, color: AU.text }}>
                  {formatCurrencyOMR(showcasePiece.price)}
                </p>
              </FloatingPanel>

              <FloatingPanel mx={mx} my={my} multiplier={0.6} reduced={reduced} className="absolute rounded-2xl px-5 py-4" style={{ bottom: "10%", left: "-2%", width: 210 }}>
                <p className="text-[9px] uppercase tracking-[0.32em] mb-3" style={{ color: AU.textDim, ...SANS }}>
                  Included
                </p>
                <ul className="space-y-2 text-xs" style={{ color: AU.text, ...SANS, fontWeight: 300 }}>
                  {["Presentation box", "Certificate", "Numbered plaque"].map((f) => (
                    <li key={f} className="inline-flex items-center gap-2">
                      <Check className="h-3 w-3" style={{ color: AU.lavender }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </FloatingPanel>

              <FloatingPanel mx={mx} my={my} multiplier={1.2} reduced={reduced} className="absolute rounded-full px-5 py-2.5" style={{ bottom: "6%", right: "0%" }}>
                <a href="#" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em]" style={{ color: AU.text, ...SANS }}>
                  View piece
                  <ArrowRight className="h-3 w-3" />
                </a>
              </FloatingPanel>
            </>
          )}

          {isMobile && (
            <div
              className="mt-6 rounded-2xl p-5"
              style={{
                background: AU.glass2,
                border: `1px solid ${AU.border2}`,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] uppercase tracking-[0.32em]" style={{ color: AU.textDim, ...SANS }}>
                  Estimate
                </p>
                <p style={{ ...SERIF, color: AU.text, fontSize: "1.4rem" }}>
                  {formatCurrencyOMR(showcasePiece.price)}
                </p>
              </div>
              <p className="text-sm" style={{ ...SERIF, color: AU.lavender }}>
                {showcasePiece.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }: { cat: (typeof CATEGORIES)[number]; index: number }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.015 }}
      className="group relative block overflow-hidden rounded-3xl"
      style={{
        background: AU.glass1,
        border: `1px solid ${AU.border2}`,
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
        aspectRatio: "4 / 5",
        boxShadow: hover
          ? "0 40px 80px -20px rgba(167,139,250,0.35), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "0 20px 50px -25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        transition: "box-shadow 0.5s ease",
      }}
    >
      {cat.image && (
        <div className="absolute inset-0" style={{ opacity: 0.42 }}>
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: "blur(2px)" }}
          />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(15,10,31,0.2) 0%, rgba(15,10,31,0.75) 100%)" }}
      />

      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.18) 0%, transparent 40%, transparent 60%, rgba(253,164,175,0.18) 100%)",
        }}
      />

      <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.32em]" style={{ color: AU.lavender, ...SANS }}>
            {String(index + 1).padStart(2, "0")} · Vol.
          </span>
          <motion.span
            animate={{ x: hover ? 4 : 0 }}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full"
            style={{ background: AU.glass3, border: `1px solid ${AU.border2}`, color: AU.text }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </div>
        <div>
          <h3 style={{ ...SERIF, color: AU.text, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", lineHeight: 1 }}>
            {cat.label}
          </h3>
          <p className="mt-3 text-xs sm:text-sm" style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}>
            {cat.caption}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

function CategoryGrid() {
  return (
    <section className="relative px-5 py-32 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: AU.lavender, ...SANS }}>
            Departments
          </p>
          <h2 style={{ ...SERIF, color: AU.text, fontSize: "clamp(2.2rem, 6vw, 4.5rem)", lineHeight: 1 }}>
            Four worlds, one cabinet.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type OrbitalLayout = {
  top: string;
  left: string;
  width: number;
  rotate: number;
  speed: number;
};

const ORBITAL_LAYOUT: OrbitalLayout[] = [
  { top: "4%", left: "5%", width: 280, rotate: -3, speed: 0.4 },
  { top: "12%", left: "62%", width: 230, rotate: 2.5, speed: 0.7 },
  { top: "36%", left: "20%", width: 320, rotate: -4, speed: 0.5 },
  { top: "44%", left: "68%", width: 260, rotate: 3.5, speed: 0.9 },
  { top: "70%", left: "8%", width: 250, rotate: -2, speed: 0.6 },
  { top: "76%", left: "56%", width: 300, rotate: 3, speed: 0.8 },
];

function OrbitalCard({
  product,
  layout,
  isMobile,
  onOpen,
  reduced,
}: {
  product: Product;
  layout: OrbitalLayout;
  isMobile: boolean;
  onOpen: () => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40 * layout.speed, -40 * layout.speed]);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const desktopPos: CSSProperties = {
    position: "absolute",
    top: layout.top,
    left: layout.left,
    width: layout.width,
  };

  return (
    <motion.div
      ref={ref}
      style={isMobile ? undefined : desktopPos}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      className={isMobile ? "w-full" : undefined}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        style={{
          y: reduced || isMobile ? 0 : y,
          rotate: isMobile ? 0 : layout.rotate,
          background: AU.glass2,
          border: `1px solid ${AU.border2}`,
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
          boxShadow: "0 30px 70px -25px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
        whileHover={{ scale: 1.03, rotate: isMobile ? 0 : layout.rotate * 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="group block w-full rounded-3xl p-3 text-left cursor-pointer focus:outline-none focus-visible:ring-1"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes={`${layout.width}px`}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 55%, rgba(15,10,31,0.78) 100%)" }}
          />
          {product.is_limited_edition && (
            <span
              className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.28em] px-2 py-1 rounded-full"
              style={{
                background: AU.glass3,
                border: `1px solid ${AU.border2}`,
                color: AU.lavender,
                ...SANS,
              }}
            >
              Numbered
            </span>
          )}
        </div>
        <div className="px-2 pt-4 pb-2">
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: AU.textDim, ...SANS }}>
            {product.brand}
          </p>
          <p className="mt-1.5 leading-tight" style={{ ...SERIF, color: AU.text, fontSize: "1.05rem" }}>
            {product.name.split("—")[0]?.trim() ?? product.name}
          </p>
          <p className="mt-2 text-xs" style={{ color: AU.lavender, fontWeight: 300, ...SANS }}>
            {formatCurrencyOMR(product.price)}
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
}

function OrbitalGallery({ reduced }: { reduced: boolean }) {
  const isMobile = useIsMobile();
  const [openId, setOpenId] = useState<string | null>(null);
  const openProduct = openId ? orbitalPieces.find((p) => p.id === openId) ?? null : null;

  return (
    <section id="collection" className="relative px-5 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: AU.lavender, ...SANS }}>
            Volume I
          </p>
          <h2 style={{ ...SERIF, color: AU.text, fontSize: "clamp(2.4rem, 6.5vw, 5rem)", lineHeight: 1 }}>
            Pieces in residence.
          </h2>
          <p className="mt-6 mx-auto max-w-md text-sm sm:text-base" style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}>
            Each artefact arranged like a gallery — at rest, in conversation with the next.
          </p>
        </motion.div>

        <div
          className={isMobile ? "flex flex-col gap-8" : "relative"}
          style={isMobile ? undefined : { height: "1180px" }}
        >
          {orbitalPieces.map((product, i) => (
            <OrbitalCard
              key={product.id}
              product={product}
              layout={ORBITAL_LAYOUT[i] ?? ORBITAL_LAYOUT[0]}
              isMobile={isMobile}
              onOpen={() => setOpenId(product.id)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openProduct && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
            style={{
              background: "rgba(15,10,31,0.65)",
              backdropFilter: "blur(28px) saturate(140%)",
              WebkitBackdropFilter: "blur(28px) saturate(140%)",
            }}
            onClick={() => setOpenId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
              style={{
                background: AU.glass3,
                border: `1px solid ${AU.border2}`,
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                boxShadow: "0 60px 120px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.16)",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full inline-flex items-center justify-center"
                style={{ background: AU.glass3, border: `1px solid ${AU.border2}`, color: AU.text }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative aspect-square sm:aspect-auto">
                  {openProduct.images?.[0] && (
                    <Image
                      src={openProduct.images[0]}
                      alt={openProduct.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.32em] mb-3" style={{ color: AU.lavender, ...SANS }}>
                    {openProduct.brand} · {openProduct.scale}
                  </p>
                  <h3 style={{ ...SERIF, color: AU.text, fontSize: "clamp(1.8rem, 4vw, 2.4rem)", lineHeight: 1.05 }}>
                    {openProduct.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}>
                    {openProduct.description}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { label: "Scale", value: openProduct.scale ?? "—" },
                      { label: "Condition", value: openProduct.condition },
                      { label: "Stock", value: `${openProduct.stock}` },
                      { label: "Price", value: formatCurrencyOMR(openProduct.price) },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl px-3 py-2.5"
                        style={{ background: AU.glass1, border: `1px solid ${AU.border1}` }}
                      >
                        <p className="text-[9px] uppercase tracking-[0.28em]" style={{ color: AU.textDim, ...SANS }}>
                          {m.label}
                        </p>
                        <p className="mt-1 text-sm" style={{ color: AU.text, ...SANS, fontWeight: 300 }}>
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="mt-7 inline-flex items-center justify-center gap-2 h-11 rounded-full text-xs uppercase tracking-[0.2em]"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      border: `1px solid ${AU.border3}`,
                      color: AU.text,
                      ...SANS,
                    }}
                  >
                    Enquire about this piece
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LimitedEdition({ reduced }: { reduced: boolean }) {
  if (!limitedHero) return null;

  type Fragment = {
    text: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    delay: number;
  };

  const fragments: Fragment[] = [
    { text: "Numbered 0007 / 0099", top: "8%", left: "10%", delay: 0 },
    { text: "Hand-finished", top: "14%", right: "8%", delay: 3 },
    { text: "Presentation box", bottom: "20%", left: "6%", delay: 6 },
    { text: "Authenticated", bottom: "12%", right: "10%", delay: 9 },
  ];

  return (
    <section className="relative px-5 py-32 sm:py-44 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: AU.lavender, ...SANS }}>
            Now Showing
          </p>
        </motion.div>

        <div className="relative mx-auto" style={{ maxWidth: 620 }}>
          {!reduced &&
            fragments.map((f) => (
              <motion.span
                key={f.text}
                className="hidden md:block absolute text-base sm:text-lg pointer-events-none whitespace-nowrap"
                style={{
                  ...SERIF,
                  color: AU.lavender,
                  top: f.top,
                  bottom: f.bottom,
                  left: f.left,
                  right: f.right,
                }}
                animate={{ opacity: [0, 0.85, 0.85, 0] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: f.delay,
                  times: [0, 0.15, 0.85, 1],
                }}
              >
                {f.text}
              </motion.span>
            ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mx-auto rounded-[28px] p-3"
            style={{
              width: "min(420px, 100%)",
              background: AU.glass2,
              border: `1px solid ${AU.border2}`,
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              boxShadow: "0 60px 140px -30px rgba(167,139,250,0.35), inset 0 1px 0 rgba(255,255,255,0.14)",
            }}
          >
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.012, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[5/4] rounded-[22px] overflow-hidden"
            >
              {limitedHero.images?.[0] && (
                <Image
                  src={limitedHero.images[0]}
                  alt={limitedHero.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 60%, rgba(15,10,31,0.55) 100%)" }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <h3 style={{ ...SERIF, color: AU.text, fontSize: "clamp(1.8rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
              {limitedHero.name}
            </h3>
            <p
              className="mt-4 text-sm sm:text-base tracking-[0.04em]"
              style={{ color: AU.textMuted, fontWeight: 200, ...SANS }}
            >
              {formatCurrencyOMR(limitedHero.price)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ParticleBurst() {
  const particles = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 70 + (i % 3) * 12;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: i % 2 === 0 ? AU.lavender : AU.cyan }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="relative px-5 py-32 sm:py-40">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl p-8 sm:p-10 text-center overflow-hidden"
          style={{
            background: AU.glass2,
            border: `1px solid ${AU.border2}`,
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            boxShadow: "0 40px 90px -30px rgba(167,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: AU.lavender, ...SANS }}>
            First Access
          </p>
          <h2 style={{ ...SERIF, color: AU.text, fontSize: "clamp(2rem, 5.5vw, 3.4rem)", lineHeight: 1 }}>
            Stay in orbit.
          </h2>
          <p className="mt-5 text-sm sm:text-base" style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}>
            New arrivals, numbered editions, private viewings — quietly, occasionally.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="flex-1 h-12 rounded-full px-5 text-sm outline-none focus-visible:ring-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${AU.border2}`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color: AU.text,
                    ...SANS,
                    fontWeight: 300,
                  }}
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="h-12 px-7 rounded-full text-xs uppercase tracking-[0.22em] transition-transform hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.16)",
                    border: `1px solid ${AU.border3}`,
                    color: AU.text,
                    boxShadow: "0 0 28px rgba(167,139,250,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
                    ...SANS,
                  }}
                >
                  Enlist
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mt-8 relative h-20 flex flex-col items-center justify-center"
              >
                <ParticleBurst />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 18 }}
                  className="h-12 w-12 rounded-full inline-flex items-center justify-center"
                  style={{ background: AU.glass3, border: `1px solid ${AU.border3}`, color: AU.lavender }}
                >
                  <Check className="h-5 w-5" />
                </motion.div>
                <p className="mt-3 text-sm" style={{ ...SERIF, color: AU.text }}>
                  You&apos;re listed.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-[10px] uppercase tracking-[0.32em]" style={{ color: AU.textDim, ...SANS }}>
            One letter · Each season
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function AuroraFooter() {
  return (
    <footer
      className="relative px-5 py-14 sm:py-18 mt-10"
      style={{
        borderTop: `1px solid ${AU.border1}`,
        background: "rgba(15,10,31,0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4" style={{ color: AU.lavender }} />
              <span
                className="text-xs uppercase tracking-[0.34em]"
                style={{ color: AU.text, ...SANS, fontWeight: 500 }}
              >
                Diecast
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}>
              A quiet house of crafts, presenting hand-finished die-cast models from
              Muscat to the world.
            </p>
          </div>

          {[
            { title: "Catalogue", links: ["Automobiles", "Aviation", "Heavy Haul", "Two Wheels"] },
            { title: "House", links: ["Atelier", "Provenance", "Care", "Contact"] },
            { title: "Connect", links: ["Letter", "Instagram", "Private", "Press"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] uppercase tracking-[0.34em] mb-4" style={{ color: AU.lavender, ...SANS }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs transition-opacity hover:opacity-60"
                      style={{ color: AU.textMuted, fontWeight: 300, ...SANS }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${AU.border1}` }}
        >
          <p
            className="inline-flex items-center gap-2 text-[11px]"
            style={{ color: AU.textDim, ...SANS, fontWeight: 300 }}
          >
            <Moon className="h-3.5 w-3.5" style={{ color: AU.lavender }} />
            <span style={{ ...SERIF }}>© MMXXVI</span>
            <span>· Designed in Muscat</span>
          </p>
          <Link
            href="/preview"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] transition-opacity hover:opacity-60"
            style={{ color: AU.textMuted, ...SANS }}
          >
            <ArrowLeft className="h-3 w-3" />
            Other studies
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function LandingAuroraPage() {
  const reduced = useReducedMotionPref();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
        style={{ background: AU.base, color: AU.text, ...SANS, fontWeight: 300 }}
      >
        <AuroraBackground reduced={reduced} />
        <GlassNav />

        <main className="relative">
          <Hero reduced={reduced} />
          <ProductShowcase reduced={reduced} />
          <CategoryGrid />
          <OrbitalGallery reduced={reduced} />
          <LimitedEdition reduced={reduced} />
          <Newsletter />
          <AuroraFooter />
        </main>
      </div>
    </>
  );
}
