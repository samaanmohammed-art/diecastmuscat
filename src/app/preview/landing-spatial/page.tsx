"use client";
/* eslint-disable react-hooks/refs */

import { useEffect, useRef, useState, useMemo } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Play,
  Camera,
  Globe,
  Mail,
  Plus,
} from "lucide-react";
import {
  getFeaturedProducts,
  getLimitedProducts,
  getProductsByCategory,
  SAMPLE_PRODUCTS,
} from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; padding: 0 !important; }
  html, body { background: #070A14; }
`;

const P = {
  bg: "#070A14",
  bgDeeper: "#04060D",
  surface: "rgba(20, 24, 36, 0.7)",
  surfaceSolid: "#12162A",
  surfaceElevated: "rgba(28, 34, 52, 0.78)",
  rim: "rgba(255, 255, 255, 0.08)",
  rimStrong: "rgba(255, 255, 255, 0.14)",
  text: "#F0F2F8",
  textSoft: "rgba(240, 242, 248, 0.72)",
  textMuted: "rgba(240, 242, 248, 0.55)",
  textDim: "rgba(240, 242, 248, 0.32)",
  accent: "#5E9EFF",
  accentSoft: "rgba(94, 158, 255, 0.18)",
  accentGlow: "rgba(94, 158, 255, 0.35)",
  divider: "rgba(255, 255, 255, 0.06)",
} as const;

const FONT_SANS = `'Inter', system-ui, -apple-system, "Segoe UI", sans-serif`;
const FONT_MONO = `'JetBrains Mono', 'SF Mono', Menlo, monospace`;

const PAGE_STYLES = `
  @keyframes spatial-spin-y { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
  @keyframes spatial-drift-a { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-10px,0); } }
  @keyframes spatial-drift-b { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,8px,0); } }
  @keyframes spatial-drift-c { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-14px,0); } }
  .spatial-page *:focus-visible { outline: 2px solid #5E9EFF !important; outline-offset: 3px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) {
    .spatial-page * { animation: none !important; transition-duration: 0.01ms !important; }
  }
`;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function useGlobalMouse() {
  const mxN = useMotionValue(0);
  const myN = useMotionValue(0);
  useEffect(() => {
    let frame = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: PointerEvent) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          mxN.set(nx);
          myN.set(ny);
          frame = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mxN, myN]);
  return { mxN, myN };
}

type TiltOpts = { max?: number; trackGloss?: boolean };
function useTilt({ max = 12, trackGloss = false }: TiltOpts = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 25 });
  const [hover, setHover] = useState(false);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateXRaw.set((0.5 - py) * max * 2);
    rotateYRaw.set((px - 0.5) * max * 2);
    if (trackGloss) {
      ref.current.style.setProperty("--mx", `${px * 100}%`);
      ref.current.style.setProperty("--my", `${py * 100}%`);
    }
  };
  const onPointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    setHover(false);
  };
  const onPointerEnter = () => setHover(true);

  return { ref, rotateX, rotateY, hover, onPointerMove, onPointerLeave, onPointerEnter };
}

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const target = document.querySelector(".spatial-page");
    target?.addEventListener("scroll", onScroll, { passive: true });
    return () => target?.removeEventListener("scroll", onScroll);
  }, []);
  const items = ["Collection", "Stories", "Vault", "Contact"] as const;
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        background: scrolled ? "rgba(8, 12, 24, 0.78)" : "rgba(12, 16, 28, 0.55)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        border: `1px solid ${P.rim}`,
        borderRadius: 999,
        padding: "6px 6px 6px 18px",
        boxShadow: scrolled
          ? "0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset"
          : "0 8px 30px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.03) inset",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/preview"
          aria-label="Back to preview index"
          className="hidden sm:inline-flex items-center justify-center"
          style={{ width: 32, height: 32, borderRadius: 999, color: P.textMuted, transition: "all 200ms" }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2">
          <span
            style={{ width: 8, height: 8, borderRadius: 999, background: P.accent, boxShadow: `0 0 12px ${P.accentGlow}` }}
            aria-hidden
          />
          <span style={{ fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em", color: P.text }}>
            Diecast Muscat
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className="spatial-nav-item"
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: P.textMuted,
                padding: "8px 14px",
                borderRadius: 999,
                transition: "all 200ms",
              }}
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#vault"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: P.accent,
            color: "#04102B",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
            padding: "10px 16px",
            borderRadius: 999,
            transition: "all 200ms",
            marginLeft: "auto",
            minHeight: 36,
          }}
          className="spatial-cta-glow"
        >
          Open Vault
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <style>{`
        .spatial-nav-item:hover { color: ${P.text} !important; background: rgba(255,255,255,0.04); box-shadow: inset 0 0 0 1px ${P.rim}, 0 0 16px ${P.accentSoft}; }
        .spatial-cta-glow:hover { box-shadow: 0 0 28px ${P.accentGlow}, 0 6px 16px rgba(0,0,0,0.4); transform: translateY(-1px); }
      `}</style>
    </motion.header>
  );
}

function SpecCallout({ label, value, tone }: { label: string; value: string; tone: "default" | "accent" }) {
  return (
    <div
      style={{
        background: "rgba(18,22,38,0.78)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: `1px solid ${P.rim}`,
        borderRadius: 12,
        padding: "10px 14px",
        minWidth: 132,
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      }}
    >
      <p style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
        {label}
      </p>
      <p
        style={{
          fontFamily: tone === "accent" ? FONT_MONO : FONT_SANS,
          fontSize: tone === "accent" ? 14 : 13,
          fontWeight: 500,
          color: tone === "accent" ? P.accent : P.text,
          margin: "4px 0 0",
          letterSpacing: tone === "accent" ? "0.02em" : "-0.01em",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function SectionEyebrow({ text, centered }: { text: string; centered?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: centered ? "center" : "flex-start" }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: P.accent, boxShadow: `0 0 8px ${P.accentGlow}` }} aria-hidden />
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: P.textMuted }}>
        {text}
      </span>
    </div>
  );
}

function SectionHeading({ children, centered }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <h2
      style={{
        fontSize: "clamp(36px, 5.6vw, 72px)",
        fontWeight: 500,
        letterSpacing: "-0.03em",
        lineHeight: 1.02,
        color: P.text,
        margin: "16px 0 0",
        textAlign: centered ? "center" : "left",
        maxWidth: "16ch",
        marginLeft: centered ? "auto" : 0,
        marginRight: centered ? "auto" : 0,
      }}
    >
      {children}
    </h2>
  );
}

function Hero() {
  const heroProduct = SAMPLE_PRODUCTS[0];
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const { mxN, myN } = useGlobalMouse();
  const tiltMax = isMobile ? 6 : 14;
  const tilt = useTilt({ max: tiltMax });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scrollTiltX = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const composedRotateX = useTransform<number, number>(
    [tilt.rotateX, scrollTiltX] as MotionValue<number>[] as never,
    (values: number[]) => values[0] + values[1],
  );
  const calloutShiftA = useTransform(mxN, (v) => v * -22);
  const calloutShiftB = useTransform(mxN, (v) => v * 16);
  const calloutShiftC = useTransform(mxN, (v) => v * -30);
  const calloutShiftD = useTransform(mxN, (v) => v * 24);
  const calloutShiftY = useTransform(myN, (v) => v * -14);

  return (
    <section ref={sectionRef} style={{ position: "relative", minHeight: "100vh", paddingTop: 120, paddingBottom: 80, perspective: 1500 }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94,158,255,0.10) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: P.textMuted, padding: "6px 14px", borderRadius: 999, border: "1px solid " + P.rim, background: "rgba(20,24,36,0.5)", backdropFilter: "blur(8px)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: P.accent, boxShadow: "0 0 10px " + P.accentGlow }} aria-hidden />
            New Collection · Volume I
          </span>
        </motion.div>

        <h1 style={{ textAlign: "center", fontWeight: 500, fontSize: "clamp(48px, 9vw, 132px)", lineHeight: 0.95, letterSpacing: "-0.035em", color: P.text, margin: 0 }}>
          <motion.span initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }} animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }} transition={{ duration: 0.95, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }} style={{ display: "block" }}>
            Hold the
          </motion.span>
          <motion.span initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }} animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }} transition={{ duration: 0.95, ease: [0.2, 0.8, 0.2, 1], delay: 0.32 }} style={{ display: "block", fontStyle: "italic", fontWeight: 400 }}>
            moment.
          </motion.span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }} style={{ marginTop: 28, textAlign: "center", fontSize: 17, fontWeight: 300, lineHeight: 1.55, color: P.textSoft, maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
          Muscat-curated precision models — built by hand, scaled with conviction, kept in residence for those who notice the detail.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} style={{ marginTop: 36, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <a href="#featured" className="spatial-cta-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: P.accent, color: "#04102B", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", padding: "14px 22px", borderRadius: 999, transition: "all 220ms", minHeight: 48 }}>
            Browse Collection
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#film" className="spatial-cta-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: P.text, fontSize: 13, fontWeight: 400, letterSpacing: "0.04em", padding: "13px 22px", borderRadius: 999, border: "1px solid " + P.rim, background: "rgba(20,24,36,0.4)", backdropFilter: "blur(8px)", transition: "all 220ms", minHeight: 48 }}>
            <span style={{ width: 22, height: 22, borderRadius: 999, background: P.accent, color: "#04102B", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Play className="h-3 w-3" fill="currentColor" />
            </span>
            Watch Film
          </a>
        </motion.div>

        <style>{`
          .spatial-cta-primary:hover { box-shadow: 0 0 36px rgba(94,158,255,0.35), 0 10px 30px rgba(0,0,0,0.5); transform: translateY(-1px); }
          .spatial-cta-ghost:hover { border-color: rgba(255,255,255,0.14) !important; background: rgba(28,34,52,0.6) !important; }
        `}</style>

        <div style={{ marginTop: 64, position: "relative", perspective: 1500, height: "min(640px, 70vh)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(640px, 70vw)", height: "min(640px, 70vw)", background: "radial-gradient(circle at 50% 50%, rgba(94,158,255,0.22) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />

          {!isMobile && (
            <motion.div style={{ position: "absolute", top: "8%", left: "8%", x: calloutShiftA, y: calloutShiftY, translateZ: 60, animation: reduce ? undefined : "spatial-drift-a 7s ease-in-out infinite" }}>
              <SpecCallout label="Scale" value="1:18" tone="default" />
            </motion.div>
          )}
          <motion.div style={{ position: "absolute", top: isMobile ? "4%" : "12%", right: isMobile ? "4%" : "10%", x: calloutShiftB, y: calloutShiftY, translateZ: 90, animation: reduce ? undefined : "spatial-drift-b 9s ease-in-out infinite" }}>
            <SpecCallout label="Finish" value="Hand-painted" tone="default" />
          </motion.div>
          <motion.div style={{ position: "absolute", bottom: isMobile ? "4%" : "10%", left: isMobile ? "4%" : "6%", x: calloutShiftC, y: calloutShiftY, translateZ: 70, animation: reduce ? undefined : "spatial-drift-c 8s ease-in-out infinite" }}>
            <SpecCallout label="Price" value={formatCurrencyOMR(heroProduct.price)} tone="accent" />
          </motion.div>
          {!isMobile && (
            <motion.div style={{ position: "absolute", bottom: "14%", right: "8%", x: calloutShiftD, y: calloutShiftY, translateZ: 100, animation: reduce ? undefined : "spatial-drift-a 10s ease-in-out infinite" }}>
              <SpecCallout label="In residence" value={heroProduct.stock + " pieces"} tone="default" />
            </motion.div>
          )}

          <motion.div ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerEnter={tilt.onPointerEnter} onPointerLeave={tilt.onPointerLeave} initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.0, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }} style={{ position: "relative", width: "min(520px, 80vw)", aspectRatio: "4 / 5", borderRadius: 24, background: P.surface, backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)", border: "1px solid " + P.rim, boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 -20px 60px rgba(94,158,255,0.08) inset", rotateX: composedRotateX, rotateY: tilt.rotateY, scale: scrollScale, transformStyle: "preserve-3d", overflow: "hidden", cursor: "grab" }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <Image src={heroProduct.images?.[0] ?? ""} alt={heroProduct.name} fill priority sizes="(max-width: 768px) 80vw, 520px" style={{ objectFit: "cover" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 35%, transparent 65%, rgba(94,158,255,0.08) 100%)", mixBlendMode: "screen", pointerEvents: "none" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(7,10,20,0.4) 75%, rgba(7,10,20,0.92) 100%)", pointerEvents: "none" }} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "20px 24px 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, color: P.text }}>
              <div>
                <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
                  {heroProduct.brand}
                </p>
                <p style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", margin: "4px 0 0", maxWidth: "22ch", lineHeight: 1.2 }}>
                  {heroProduct.name}
                </p>
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: P.accent, flexShrink: 0 }}>
                {formatCurrencyOMR(heroProduct.price)}
              </span>
            </div>
          </motion.div>

          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(7,10,20,0.85) 95%)", pointerEvents: "none" }} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} style={{ display: "flex", justifyContent: "center", marginTop: 36, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: P.textDim }}>
          Scroll · Inspect
        </motion.div>
      </div>
    </section>
  );
}

type Cat = { slug: "cars" | "planes" | "trucks" | "bikes"; label: string };
const CATS: Cat[] = [
  { slug: "cars", label: "Cars" },
  { slug: "planes", label: "Planes" },
  { slug: "trucks", label: "Trucks" },
  { slug: "bikes", label: "Bikes" },
];

function CategoryStack() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const interactionRef = useRef<number>(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (Date.now() - interactionRef.current > 6000) {
        setActive((prev) => (prev + 1) % CATS.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [reduce]);

  const markInteract = () => { interactionRef.current = Date.now(); };

  const categoryData = useMemo(
    () => CATS.map((c) => ({ ...c, product: getProductsByCategory(c.slug)[0], count: getProductsByCategory(c.slug).length })),
    [],
  );

  return (
    <section style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow text="Four domains" />
        <SectionHeading>Choose your fascination.</SectionHeading>
        <p style={{ color: P.textSoft, fontSize: 16, fontWeight: 300, maxWidth: "44ch", marginTop: 16, lineHeight: 1.55 }}>
          Every collection begins with an obsession. Four domains, each curated with the same reverence for the original engineering.
        </p>

        <div style={{ position: "relative", perspective: 1400, height: isMobile ? 500 : 560, marginTop: 64, display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d" }} onMouseEnter={markInteract}>
          {categoryData.map((c, i) => {
            const diff = i - active;
            const absDiff = Math.abs(diff);
            const offsetX = isMobile ? diff * 60 : diff * 140;
            const offsetZ = -120 * absDiff;
            const rotateY = (isMobile ? 6 : 10) * diff;
            const scale = 1 - 0.06 * absDiff;
            const opacity = absDiff > 2 ? 0 : 1 - 0.18 * absDiff;
            const zIndex = 10 - absDiff;
            return (
              <motion.div
                key={c.slug}
                onClick={() => { setActive(i); markInteract(); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); markInteract(); } }}
                animate={{ x: offsetX, z: offsetZ, rotateY, scale, opacity }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                style={{
                  position: "absolute",
                  width: isMobile ? 260 : 340,
                  height: isMobile ? 380 : 460,
                  borderRadius: 20,
                  background: P.surface,
                  backdropFilter: "blur(24px) saturate(140%)",
                  WebkitBackdropFilter: "blur(24px) saturate(140%)",
                  border: "1px solid " + (diff === 0 ? P.rimStrong : P.rim),
                  overflow: "hidden",
                  boxShadow: diff === 0
                    ? "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 60px rgba(94,158,255,0.12)"
                    : "0 30px 60px rgba(0,0,0,0.45)",
                  cursor: "pointer",
                  pointerEvents: absDiff > 2 ? "none" : "auto",
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
              >
                <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "62%", overflow: "hidden" }}>
                  {c.product?.images?.[0] && (
                    <Image src={c.product.images[0]} alt={c.label} fill sizes={isMobile ? "260px" : "340px"} style={{ objectFit: "cover" }} />
                  )}
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(7,10,20,0.7) 100%)" }} />
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: "62%", padding: "22px 22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
                      Domain · {String(i + 1).padStart(2, "0")}
                    </p>
                    <p style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", color: P.text, margin: "6px 0 0" }}>
                      {c.label}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.textMuted }}>{c.count} pieces</span>
                    <ChevronRight className="h-4 w-4" style={{ color: P.accent }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4, marginTop: 48 }}>
          {categoryData.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => { setActive(i); markInteract(); }}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: i === active ? P.text : P.textDim,
                background: "transparent",
                border: "none",
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom: i === active ? "1px solid " + P.accent : "1px solid transparent",
                transition: "all 200ms",
                minHeight: 44,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const items = SAMPLE_PRODUCTS.slice(0, 8);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const stripX = useTransform(smoothProgress, [0, 1], ["10%", "-78%"]);

  return (
    <section ref={sectionRef} style={{ position: "relative", height: isMobile ? "180vh" : "220vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8" style={{ marginBottom: 40 }}>
          <SectionEyebrow text="In circulation" />
          <SectionHeading>Currently on the floor.</SectionHeading>
        </div>
        <div style={{ position: "relative", perspective: 1400, transformStyle: "preserve-3d" }}>
          <motion.div style={{ display: "flex", gap: 28, x: stripX, transformStyle: "preserve-3d", willChange: "transform", paddingLeft: "0vw" }}>
            {items.map((p, i) => (
              <CarouselCard key={p.id} product={p} index={i} total={items.length} progress={smoothProgress} isMobile={isMobile} />
            ))}
          </motion.div>
          <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 120, background: "linear-gradient(90deg, " + P.bg + " 0%, transparent 100%)", pointerEvents: "none", zIndex: 5 }} />
          <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 120, background: "linear-gradient(270deg, " + P.bg + " 0%, transparent 100%)", pointerEvents: "none", zIndex: 5 }} />
        </div>
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8" style={{ marginTop: 40 }}>
          <div style={{ height: 2, background: P.rim, borderRadius: 999, overflow: "hidden", position: "relative" }}>
            <motion.div style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: P.accent, boxShadow: "0 0 8px " + P.accentGlow, scaleX: smoothProgress, transformOrigin: "left center", width: "100%" }} />
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textDim }}>
            <span>Scroll to traverse</span>
            <span>{items.length} pieces</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselCard({ product, index, total, progress, isMobile }: { product: (typeof SAMPLE_PRODUCTS)[number]; index: number; total: number; progress: MotionValue<number>; isMobile: boolean }) {
  const cardCenter = (index + 0.5) / total;
  const rotateY = useTransform(progress, (v) => (v - cardCenter) * 80);
  const scale = useTransform(progress, (v) => 1 - Math.min(0.18, Math.abs(v - cardCenter) * 0.5));
  const translateZ = useTransform(progress, (v) => -Math.abs(v - cardCenter) * 120);
  return (
    <motion.div style={{ flexShrink: 0, width: isMobile ? 240 : 320, aspectRatio: "3 / 4", borderRadius: 18, background: P.surface, backdropFilter: "blur(20px) saturate(140%)", WebkitBackdropFilter: "blur(20px) saturate(140%)", border: "1px solid " + P.rim, overflow: "hidden", position: "relative", rotateY, scale, z: translateZ, transformStyle: "preserve-3d", boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>
      <Image src={product.images?.[0] ?? ""} alt={product.name} fill sizes={isMobile ? "240px" : "320px"} style={{ objectFit: "cover" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(7,10,20,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 20px 20px" }}>
        <p style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
          {product.brand} · {product.scale}
        </p>
        <p style={{ fontSize: 15, fontWeight: 500, color: P.text, margin: "6px 0 0", letterSpacing: "-0.01em", lineHeight: 1.25, maxWidth: "20ch" }}>
          {product.name}
        </p>
        <p style={{ fontFamily: FONT_MONO, fontSize: 13, color: P.accent, margin: "10px 0 0" }}>
          {formatCurrencyOMR(product.price)}
        </p>
      </div>
    </motion.div>
  );
}

function DetailAnnotations() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { mxN, myN } = useGlobalMouse();
  const isMobile = useIsMobile();
  const product = SAMPLE_PRODUCTS[1];
  const parallaxRotateY = useTransform(mxN, (v) => v * 4);
  const parallaxRotateX = useTransform(myN, (v) => -v * 3);

  const annotations = [
    { dotX: 30, dotY: 38, lineEndX: 12, lineEndY: 14, label: "Working scissor doors", sub: "Hinged in micro-cast steel.", align: "left" as const },
    { dotX: 68, dotY: 56, lineEndX: 92, lineEndY: 26, label: "Pirelli P Zero tyres", sub: "Authentic compound texture.", align: "right" as const },
    { dotX: 44, dotY: 65, lineEndX: 14, lineEndY: 88, label: "Hand-finished metallic paint", sub: "Five coats. Wet-sanded between.", align: "left" as const },
    { dotX: 78, dotY: 32, lineEndX: 92, lineEndY: 78, label: "Numbered edition", sub: "0042 / 0500. Certificate enclosed.", align: "right" as const },
  ];

  return (
    <section ref={ref} style={{ position: "relative", padding: "140px 0", overflow: "hidden" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow text="Inspection" />
        <SectionHeading>Look closer.</SectionHeading>
        <p style={{ color: P.textSoft, fontSize: 16, fontWeight: 300, maxWidth: "44ch", marginTop: 16, lineHeight: 1.55 }}>
          Every detail rendered for the patient eye. Hover the image and the marks reveal what we obsessed over.
        </p>
        <div style={{ position: "relative", marginTop: 64, display: "flex", justifyContent: "center", perspective: 1400 }}>
          <motion.div style={{ position: "relative", width: "100%", maxWidth: 800, aspectRatio: "4 / 3", borderRadius: 20, overflow: "visible", rotateY: parallaxRotateY, rotateX: parallaxRotateX, transformStyle: "preserve-3d" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 20, overflow: "hidden", background: P.surface, border: "1px solid " + P.rim, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset" }}>
              <Image src={product.images?.[0] ?? ""} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 800px" style={{ objectFit: "cover" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7,10,20,0.55) 95%)" }} />
            </div>
            <svg viewBox="0 0 100 75" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} aria-hidden>
              {annotations.map((a, i) => (
                <g key={i}>
                  <motion.circle cx={a.dotX} cy={a.dotY} r={0.8} fill="none" stroke={P.accent} strokeWidth={0.15} initial={{ opacity: 0 }} animate={inView ? { opacity: [0.6, 0, 0.6], r: [0.8, 2.6, 0.8] } : { opacity: 0 }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1 + i * 0.15 }} />
                  <motion.circle cx={a.dotX} cy={a.dotY} r={0.7} fill={P.accent} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }} transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }} style={{ transformOrigin: a.dotX + "px " + a.dotY + "px" }} />
                  <motion.path d={"M " + a.dotX + " " + a.dotY + " L " + a.lineEndX + " " + a.lineEndY} stroke={P.rimStrong} strokeWidth={0.18} fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0 }} transition={{ duration: 0.9, delay: 1.0 + i * 0.15, ease: "easeInOut" }} />
                </g>
              ))}
            </svg>
            {annotations.map((a, i) => {
              const isLeft = a.align === "left";
              const labelStyle: CSSProperties = {
                position: "absolute",
                left: isLeft ? "0%" : "auto",
                right: isLeft ? "auto" : "0%",
                top: ((a.lineEndY / 75) * 100) + "%",
                transform: isLeft ? "translate(-10%, -110%)" : "translate(10%, -110%)",
                maxWidth: isMobile ? 140 : 200,
                textAlign: isLeft ? "left" : "right",
                pointerEvents: "none",
              };
              return (
                <motion.div key={"label-" + i} style={labelStyle} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ duration: 0.5, delay: 1.5 + i * 0.15 }}>
                  <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: P.accent, margin: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: P.text, margin: "4px 0 0", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                    {a.label}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 300, color: P.textMuted, margin: "4px 0 0", lineHeight: 1.4 }}>
                    {a.sub}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedGrid() {
  const products = getFeaturedProducts(6);
  return (
    <section id="featured" style={{ position: "relative", padding: "140px 0" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <SectionEyebrow text="Pieces" />
            <SectionHeading>Featured holdings.</SectionHeading>
          </div>
          <a href="#" className="spatial-viewall" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textMuted, padding: "10px 0", transition: "color 200ms" }}>
            View all
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {products.map((p, i) => (
            <TiltProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
      <style>{`.spatial-viewall:hover { color: ${P.accent} !important; }`}</style>
    </section>
  );
}

function TiltProductCard({ product, index }: { product: (typeof SAMPLE_PRODUCTS)[number]; index: number }) {
  const tilt = useTilt({ max: 8, trackGloss: true });
  return (
    <motion.div
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerEnter={tilt.onPointerEnter}
      onPointerLeave={tilt.onPointerLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: "relative",
        borderRadius: 18,
        background: P.surface,
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid " + (tilt.hover ? P.rimStrong : P.rim),
        overflow: "hidden",
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        transformStyle: "preserve-3d",
        transition: "border-color 200ms, box-shadow 300ms",
        boxShadow: tilt.hover
          ? "0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 40px rgba(94,158,255,0.18)"
          : "0 24px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
        <Image src={product.images?.[0] ?? ""} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(7,10,20,0.7) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.16), transparent 55%)", mixBlendMode: "screen", opacity: tilt.hover ? 1 : 0, transition: "opacity 250ms", pointerEvents: "none" }} />
        {product.is_limited_edition && (
          <span style={{ position: "absolute", top: 14, left: 14, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: P.accent, background: "rgba(94,158,255,0.14)", border: "1px solid " + P.accentSoft, padding: "4px 8px", borderRadius: 999, backdropFilter: "blur(8px)" }}>
            Limited
          </span>
        )}
      </div>
      <div style={{ padding: "18px 20px 22px" }}>
        <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
          {product.brand} · {product.scale}
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: P.text, margin: "8px 0 0", letterSpacing: "-0.01em", lineHeight: 1.3, minHeight: "2.6em" }}>
          {product.name}
        </p>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: P.accent }}>
            {formatCurrencyOMR(product.price)}
          </span>
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: 999, background: tilt.hover ? P.accent : "rgba(255,255,255,0.06)", color: tilt.hover ? "#04102B" : P.text, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 220ms" }}>
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingFragment({ text, style, delay, mono }: { text: string; style: CSSProperties & { translateZ?: number }; delay: number; mono?: boolean }) {
  const { translateZ, ...rest } = style;
  return (
    <motion.div initial={{ opacity: 0, z: -100 }} whileInView={{ opacity: 1, z: translateZ ?? 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.0, delay, ease: [0.2, 0.8, 0.2, 1] }} style={{ position: "absolute", ...rest, pointerEvents: "none" }}>
      <span style={{ fontFamily: mono ? FONT_MONO : FONT_SANS, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textSoft, padding: "8px 14px", background: "rgba(12, 16, 28, 0.6)", border: "1px solid " + P.rim, borderRadius: 999, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", whiteSpace: "nowrap", display: "inline-block" }}>
        {text}
      </span>
    </motion.div>
  );
}

function LimitedDrop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const product = SAMPLE_PRODUCTS.find((p) => p.id === "1a2b3c4d-0009") ?? getLimitedProducts(1)[0];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const farY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const nearY = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section ref={sectionRef} style={{ position: "relative", minHeight: "100vh", padding: "120px 0", overflow: "hidden" }}>
      <motion.div aria-hidden style={{ position: "absolute", inset: 0, y: farY, backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(240,242,248,0.5), transparent 50%), radial-gradient(1px 1px at 80% 70%, rgba(240,242,248,0.4), transparent 50%), radial-gradient(1px 1px at 45% 85%, rgba(240,242,248,0.4), transparent 50%), radial-gradient(1px 1px at 65% 15%, rgba(240,242,248,0.4), transparent 50%), radial-gradient(1px 1px at 10% 60%, rgba(240,242,248,0.3), transparent 50%), radial-gradient(1px 1px at 90% 40%, rgba(240,242,248,0.4), transparent 50%)", backgroundSize: "300px 300px", opacity: 0.7 }} />
      <motion.div aria-hidden style={{ position: "absolute", inset: 0, y: nearY, backgroundImage: "radial-gradient(1.5px 1.5px at 30% 50%, rgba(94,158,255,0.6), transparent 50%), radial-gradient(1.5px 1.5px at 70% 20%, rgba(240,242,248,0.5), transparent 50%), radial-gradient(2px 2px at 15% 80%, rgba(94,158,255,0.5), transparent 50%), radial-gradient(1.5px 1.5px at 85% 60%, rgba(240,242,248,0.5), transparent 50%)", backgroundSize: "600px 600px", opacity: 0.6 }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SectionEyebrow text="Limited Drop · Volume I" centered />
        <SectionHeading centered>
          One piece. <em style={{ fontWeight: 400, fontStyle: "italic" }}>Numbered.</em>
        </SectionHeading>
        <div style={{ position: "relative", marginTop: 80, width: "min(640px, 90vw)", height: "min(640px, 75vh)", perspective: 1600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70%", height: "70%", borderRadius: 999, background: "radial-gradient(circle at 50% 50%, rgba(94,158,255,0.28) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div style={{ position: "relative", width: "min(420px, 70vw)", aspectRatio: "1 / 1", borderRadius: "50%", overflow: "hidden", border: "1px solid " + P.rim, boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 80px rgba(94,158,255,0.18)", animation: reduce ? undefined : "spatial-spin-y 30s linear infinite", transformStyle: "preserve-3d" }}>
            <Image src={product.images?.[0] ?? ""} alt={product.name} fill sizes="(max-width: 768px) 90vw, 420px" style={{ objectFit: "cover" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(circle at 70% 80%, rgba(94,158,255,0.15), transparent 50%)", mixBlendMode: "screen" }} />
          </div>
          <FloatingFragment text="Numbered 0007 / 0099" mono style={{ top: "8%", left: "4%", translateZ: 80 }} delay={0.2} />
          <FloatingFragment text="Sealed · Mint" mono style={{ top: "16%", right: "4%", translateZ: 60 }} delay={0.35} />
          <FloatingFragment text="Presentation box" mono style={{ bottom: "18%", left: "0%", translateZ: 100 }} delay={0.5} />
          <FloatingFragment text="Hand-finished" mono style={{ bottom: "8%", right: "2%", translateZ: 50 }} delay={0.65} />
        </div>
        <div style={{ marginTop: 56 }}>
          <p style={{ fontSize: 22, fontWeight: 500, color: P.text, letterSpacing: "-0.01em", margin: 0 }}>
            {product.name}
          </p>
          <p style={{ fontFamily: FONT_MONO, fontSize: 16, color: P.accent, margin: "10px 0 0" }}>
            {formatCurrencyOMR(product.price)}
          </p>
        </div>
        <a href="#" className="spatial-reserve" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 32, background: P.accent, color: "#04102B", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", padding: "16px 28px", borderRadius: 999, transition: "all 220ms", boxShadow: "0 0 30px " + P.accentGlow, minHeight: 48 }}>
          Reserve this lot
          <ArrowRight className="h-4 w-4" />
        </a>
        <style>{`.spatial-reserve:hover { box-shadow: 0 0 50px ${P.accentGlow}, 0 10px 30px rgba(0,0,0,0.5) !important; transform: translateY(-2px); }`}</style>
      </div>
    </section>
  );
}

function Testimonial() {
  const tilt = useTilt({ max: 10 });
  const product = SAMPLE_PRODUCTS.find((p) => p.id === "1a2b3c4d-0010") ?? getLimitedProducts()[0];
  return (
    <section style={{ padding: "140px 0", position: "relative" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" style={{ perspective: 1400 }}>
        <div className="testimonial-grid">
          <motion.div initial={{ opacity: 0, z: -200 }} whileInView={{ opacity: 1, z: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }} style={{ transformStyle: "preserve-3d" }}>
            <SectionEyebrow text="Words" />
            <p style={{ fontWeight: 300, fontSize: "clamp(26px, 3.4vw, 42px)", lineHeight: 1.25, letterSpacing: "-0.02em", color: P.text, margin: "16px 0 0", maxWidth: "22ch" }}>
              <span style={{ color: P.accent }}>&ldquo;</span>It is rare to find craft this precise. They send a small object; what arrives is patience.<span style={{ color: P.accent }}>&rdquo;</span>
            </p>
            <p style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textDim, marginTop: 28 }}>
              Anon · Collector · Doha
            </p>
          </motion.div>
          <motion.div ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerEnter={tilt.onPointerEnter} onPointerLeave={tilt.onPointerLeave} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, delay: 0.2 }} style={{ position: "relative", width: "min(320px, 80vw)", aspectRatio: "4 / 5", borderRadius: 18, background: P.surface, backdropFilter: "blur(20px) saturate(140%)", WebkitBackdropFilter: "blur(20px) saturate(140%)", border: "1px solid " + P.rim, overflow: "hidden", rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset", justifySelf: "end" }}>
            <Image src={product.images?.[0] ?? ""} alt={product.name} fill sizes="320px" style={{ objectFit: "cover" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(7,10,20,0.92) 100%)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "20px 22px" }}>
              <p style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
                On quiet display
              </p>
              <p style={{ fontSize: 15, fontWeight: 500, color: P.text, margin: "6px 0 0", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
                {product.name}
              </p>
              <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: P.accent, margin: "8px 0 0" }}>
                {formatCurrencyOMR(product.price)}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
        @media (min-width: 768px) { .testimonial-grid { grid-template-columns: 1.2fr 1fr; gap: 64px; } }
      `}</style>
    </section>
  );
}

function CtaVault() {
  const [email, setEmail] = useState("");
  const [hover, setHover] = useState(false);
  return (
    <section id="vault" style={{ padding: "140px 0 100px", position: "relative" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" style={{ perspective: 1400 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} style={{ position: "relative", background: "rgba(20, 24, 36, 0.55)", backdropFilter: "blur(28px) saturate(160%)", WebkitBackdropFilter: "blur(28px) saturate(160%)", border: "1px solid " + P.rim, borderRadius: 28, padding: "clamp(40px, 6vw, 64px)", textAlign: "center", boxShadow: "0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 -30px 80px rgba(94,158,255,0.1) inset", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: "120%", height: "100%", background: "radial-gradient(ellipse at 50% 100%, rgba(94,158,255,0.16) 0%, transparent 60%)", pointerEvents: "none" }} />
          <SectionEyebrow text="Access" centered />
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 500, letterSpacing: "-0.03em", color: P.text, margin: "12px 0 0", lineHeight: 1 }}>
            Step into <em style={{ fontStyle: "italic", fontWeight: 400 }}>the vault.</em>
          </h2>
          <p style={{ color: P.textMuted, fontSize: 15, fontWeight: 300, maxWidth: "32ch", margin: "20px auto 0", lineHeight: 1.55 }}>
            First access to new lots. Numbered pieces, sealed crates, no noise.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); }} style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 520, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
            <label htmlFor="vault-email" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
              Email address
            </label>
            <input
              id="vault-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@elsewhere.com"
              required
              style={{ flex: "1 1 220px", background: "rgba(7,10,20,0.5)", border: "1px solid " + P.rim, color: P.text, fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.02em", padding: "0 18px", height: 52, borderRadius: 999, outline: "none", transition: "all 200ms", minWidth: 0 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = P.accent; e.currentTarget.style.boxShadow = "0 0 0 3px " + P.accentSoft; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = P.rim; e.currentTarget.style.boxShadow = "none"; }}
            />
            <motion.button
              type="submit"
              onHoverStart={() => setHover(true)}
              onHoverEnd={() => setHover(false)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{ position: "relative", background: P.accent, color: "#04102B", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", padding: "0 24px", height: 52, borderRadius: 999, border: "none", cursor: "pointer", perspective: 600, boxShadow: hover ? "0 0 40px " + P.accentGlow + ", 0 12px 24px rgba(0,0,0,0.4)" : "0 0 20px " + P.accentSoft + ", 0 8px 16px rgba(0,0,0,0.3)", transition: "box-shadow 220ms", minHeight: 48 }}
            >
              <motion.span animate={{ z: hover ? 14 : 0 }} transition={{ type: "spring", stiffness: 250, damping: 20 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, transformStyle: "preserve-3d" }}>
                Request access
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </form>
          <p style={{ marginTop: 24, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: P.textDim }}>
            By invitation · Reviewed quarterly
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FooterBlock() {
  const cols = [
    { heading: "Catalogue", links: ["Cars", "Planes", "Trucks", "Bikes", "Limited editions"] },
    { heading: "Atelier", links: ["Authentication", "Restoration", "Storage", "Insurance"] },
    { heading: "Diecast Muscat", links: ["About", "Stories", "Contact", "Press"] },
  ];
  return (
    <footer style={{ position: "relative", paddingTop: 80, paddingBottom: 56, marginTop: 40 }}>
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(94,158,255,0.5) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(94,158,255,0.06) 0%, transparent 100%)", pointerEvents: "none" }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" style={{ position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, paddingBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: P.accent, boxShadow: "0 0 12px " + P.accentGlow }} aria-hidden />
              <span style={{ fontSize: 14, fontWeight: 500, color: P.text }}>Diecast Muscat</span>
            </div>
            <p style={{ marginTop: 18, fontSize: 13, fontWeight: 300, color: P.textMuted, lineHeight: 1.6, maxWidth: "32ch" }}>
              Premium die-cast collectibles, curated and shipped from Muscat to careful hands.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.heading}>
              <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
                {col.heading}
              </p>
              <ul style={{ marginTop: 18, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="spatial-footer-link" style={{ fontSize: 13, fontWeight: 300, color: P.textMuted, transition: "color 200ms" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, paddingTop: 32, borderTop: "1px solid " + P.divider }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: P.textDim, margin: 0 }}>
            Diecast Muscat · 2026 — Built in Muscat
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ Icon: Camera, label: "Photography" }, { Icon: Globe, label: "Films" }, { Icon: Mail, label: "Email" }].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="spatial-social" style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid " + P.rim, display: "inline-flex", alignItems: "center", justifyContent: "center", color: P.textMuted, transition: "all 200ms" }}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .spatial-footer-link:hover { color: ${P.text} !important; }
        .spatial-social:hover { color: ${P.accent} !important; border-color: ${P.accentSoft} !important; box-shadow: 0 0 16px ${P.accentSoft}; }
      `}</style>
    </footer>
  );
}

export default function LandingSpatial() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <div className="spatial-page" style={{ position: "fixed", inset: 0, overflowY: "auto", overflowX: "hidden", background: P.bg, color: P.text, fontFamily: FONT_SANS, fontWeight: 300, zIndex: 100 }}>
        <div aria-hidden style={{ position: "fixed", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(94,158,255,0.06) 100%)", pointerEvents: "none", zIndex: 0 }} />
        <FloatingNav />
        <main style={{ position: "relative", zIndex: 1 }}>
          <Hero />
          <CategoryStack />
          <ScrollCarousel />
          <DetailAnnotations />
          <FeaturedGrid />
          <LimitedDrop />
          <Testimonial />
          <CtaVault />
          <FooterBlock />
        </main>
      </div>
    </>
  );
}
