"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
  type Easing,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight, ArrowRight, Play, Check } from "lucide-react";

function InstagramGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.49 8.56L23 22h-6.945l-5.45-6.747L4.5 22H1.241l8.01-9.155L1 2h7.116l4.927 6.198L18.244 2Zm-2.428 18h1.9L7.27 4H5.244l10.572 16Z" />
    </svg>
  );
}
import {
  getFeaturedProducts,
  getLimitedProducts,
  getProductsByCategory,
} from "@/lib/sample-products";
import { formatCurrencyOMR } from "@/lib/utils";

const C = {
  bg: "#0A0A0A",
  surface: "#1A1A1A",
  border: "#3A3A3A",
  cream: "#FAFAF7",
  yellow: "#F5D300",
  red: "#FF3D00",
} as const;

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; padding: 0 !important; }
`;

const KEYFRAMES_CSS = `
  @keyframes kb-marquee {
    0%   { transform: translate3d(0,0,0); }
    100% { transform: translate3d(-50%,0,0); }
  }
  @keyframes kb-bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes kb-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .kb-pause-on-hover:hover .kb-marquee-track { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    .kb-marquee-track, .kb-bob, .kb-spin { animation: none !important; }
  }
`;

const fontStacks = {
  heading: "'Inter', system-ui, -apple-system, Segoe UI, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  serif: "Georgia, 'Times New Roman', serif",
} as const;

const ease: Easing = [0.2, 0.8, 0.2, 1];

type Cat = "cars" | "planes" | "trucks" | "bikes";
type LotStatus = "AVAILABLE" | "RESERVED" | "SOLD";

const featured = getFeaturedProducts(6);
const limited = getLimitedProducts(4);
const hero = featured[0];
const gridPieces = featured.slice(1, 4);

const CATEGORY_ORDER: Cat[] = ["cars", "planes", "trucks", "bikes"];
const categoryCards = CATEGORY_ORDER.map((slug, idx) => {
  const list = getProductsByCategory(slug);
  return {
    slug,
    label: slug.toUpperCase(),
    seq: String(idx + 1).padStart(2, "0"),
    hero: list[0],
    count: list.length,
  };
});

const LOT_NUMBERS = ["042", "011", "007", "099"];
const LOT_STATUSES: LotStatus[] = ["AVAILABLE", "RESERVED", "AVAILABLE", "SOLD"];

const TICKER_PARTS = [
  "DIECAST MUSCAT",
  "HOUSE OF CRAFTS",
  "LOT 042 NOW OPEN",
  "INTERNATIONAL SHIPPING",
  "ESTABLISHED MMXXVI",
];

function SplitText({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.03,
  outline = false,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  outline?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const charStyle: CSSProperties = outline
    ? { WebkitTextStroke: `2px ${C.cream}`, color: "transparent" }
    : { color: C.cream };

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", overflow: "hidden", ...style }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
          aria-hidden
        >
          <motion.span
            style={{ display: "inline-block", ...charStyle }}
            initial={reduce ? { y: 0 } : { y: "110%" }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: delay + i * stagger }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Marquee({
  children,
  duration = 40,
  className,
  style,
  pauseOnHover = false,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={`${className ?? ""} ${pauseOnHover ? "kb-pause-on-hover" : ""}`}
      style={{ overflow: "hidden", width: "100%", ...style }}
    >
      <div
        className="kb-marquee-track"
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          willChange: "transform",
          animation: `kb-marquee ${duration}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

function TopTicker() {
  const phrase = TICKER_PARTS.map((p) => p + "  ▲  ").join("");
  const block = (key: string) => (
    <span
      key={key}
      style={{
        fontFamily: fontStacks.mono,
        fontSize: 11,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        padding: "10px 0",
        color: C.bg,
        fontWeight: 700,
      }}
    >
      {phrase}
    </span>
  );

  return (
    <div style={{ background: C.yellow, borderBottom: "2px solid " + C.bg, position: "relative", zIndex: 10 }}>
      <Marquee duration={42}>
        {block("a")}
        {block("b")}
        {block("c")}
      </Marquee>
    </div>
  );
}

function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 14 });
  const sy = useSpring(my, { stiffness: 90, damping: 14 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set(((e.clientX - w / 2) / w) * 10);
      my.set(((e.clientY - h / 2) / h) * 10);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <section
      style={{ position: "relative", background: C.bg, color: C.cream, padding: "32px 16px 56px", overflow: "hidden" }}
      className="sm:px-6 lg:px-10 lg:pt-16 lg:pb-28"
    >
      <div
        className="flex items-center justify-between"
        style={{
          fontFamily: fontStacks.mono,
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: C.cream,
          marginBottom: 24,
        }}
      >
        <span
          style={{
            border: "1.5px solid " + C.yellow,
            color: C.yellow,
            padding: "6px 10px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 6, height: 6, background: C.yellow, display: "inline-block" }} />
          LOT №042 — LIVE
        </span>
        <span style={{ color: "#8A8A82" }}>2026 / COLLECTION 01</span>
      </div>

      <div
        style={{ display: "grid", gap: 40, gridTemplateColumns: "1fr" }}
        className="lg:[grid-template-columns:3fr_2fr] lg:gap-10"
      >
        <motion.div style={{ x: sx, y: sy }}>
          <h1
            style={{
              fontFamily: fontStacks.heading,
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.82,
              margin: 0,
            }}
            className="text-7xl md:text-[10rem] lg:text-[14rem]"
          >
            <span style={{ display: "block" }}>
              <SplitText text="DIE" />
            </span>
            <span style={{ display: "block" }}>
              <SplitText text="CAST" outline delay={0.18} />
            </span>
          </h1>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              fontFamily: fontStacks.mono,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8A8A82",
            }}
          >
            <span style={{ color: C.yellow }}>HOUSE OF CRAFTS</span>
            <span>·</span>
            <span>MUSCAT</span>
            <span>·</span>
            <span>MMXXVI</span>
          </div>

          <p
            style={{
              fontFamily: fontStacks.serif,
              fontStyle: "italic",
              color: C.cream,
              marginTop: 24,
              maxWidth: 520,
              lineHeight: 1.3,
            }}
            className="text-xl md:text-2xl lg:text-3xl"
          >
            Precision models for the obsessed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3" style={{ fontFamily: fontStacks.mono }}>
            <Link
              href="/products"
              style={{
                background: C.yellow,
                color: C.bg,
                padding: "16px 22px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
              }}
            >
              BROWSE THE VAULT
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              style={{
                background: "transparent",
                color: C.cream,
                border: "1.5px solid " + C.border,
                padding: "16px 22px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                cursor: "pointer",
              }}
            >
              <Play size={14} strokeWidth={2.5} />
              WATCH THE FILM
            </button>
          </div>
        </motion.div>

        <div style={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.3 }}
            style={{
              position: "relative",
              aspectRatio: "4 / 5",
              background: C.surface,
              border: "4px solid " + C.yellow,
              overflow: "hidden",
            }}
          >
            {hero?.images?.[0] ? (
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill
                sizes="(min-width:1024px) 40vw, 90vw"
                style={{ objectFit: "cover" }}
                priority
              />
            ) : null}

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                background: C.bg,
                color: C.yellow,
                padding: "10px 16px",
                fontFamily: fontStacks.mono,
                fontWeight: 800,
                letterSpacing: "0.18em",
                fontSize: 14,
              }}
            >
              № 042
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.95), transparent)",
                padding: "20px 16px 16px",
                color: C.cream,
              }}
            >
              <div
                style={{
                  fontFamily: fontStacks.mono,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#A6A69E",
                  marginBottom: 6,
                }}
              >
                {hero?.brand ?? "—"} · {hero?.scale ?? "1:18"}
              </div>
              <div
                style={{
                  fontFamily: fontStacks.heading,
                  fontWeight: 900,
                  fontSize: 18,
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                {hero?.name}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: C.yellow,
                color: C.bg,
                padding: "8px 12px",
                fontFamily: fontStacks.mono,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                transform: "rotate(4deg)",
              }}
            >
              {hero ? formatCurrencyOMR(hero.price) : "—"}
            </div>
          </motion.div>

          <div
            className="kb-bob"
            style={{
              position: "absolute",
              top: -22,
              right: -10,
              width: 90,
              height: 90,
              background: C.yellow,
              color: C.bg,
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontStacks.mono,
              fontWeight: 800,
              animation: "kb-bob 3.4s ease-in-out infinite",
              boxShadow: "0 8px 24px rgba(245,211,0,0.18)",
            }}
            aria-hidden
          >
            <span style={{ fontSize: 9, letterSpacing: "0.22em" }}>LOT</span>
            <span style={{ fontSize: 22, lineHeight: 1 }}>042</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function NamesMarquee() {
  const items = featured.map((p) => p.name.toUpperCase());
  return (
    <section
      style={{
        background: C.bg,
        borderTop: "1px solid " + C.yellow,
        borderBottom: "1px solid " + C.yellow,
        padding: "28px 0",
      }}
    >
      <Marquee duration={32} pauseOnHover>
        {items.map((name, i) => (
          <span
            key={"m-" + i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              fontFamily: fontStacks.heading,
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              paddingRight: 36,
              color: i % 2 === 0 ? C.cream : "transparent",
              WebkitTextStroke: i % 2 === 0 ? "0" : "1.5px " + C.cream,
            }}
          >
            {name}
            <span style={{ color: C.yellow, fontWeight: 900 }}>✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}

function Categories() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [constraint, setConstraint] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current || !trackRef.current) return;
      const c = containerRef.current.offsetWidth;
      const t = trackRef.current.scrollWidth;
      setConstraint(Math.max(0, t - c));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <section
      style={{ background: C.bg, color: C.cream, padding: "72px 16px 56px", position: "relative" }}
      className="sm:px-6 lg:px-10 lg:py-28"
    >
      <SectionHeader index="02" title="CATEGORIES" sub="Drag to explore the floor." />

      <div ref={containerRef} style={{ overflow: "hidden", marginTop: 32, cursor: "grab" }}>
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.08}
          whileTap={{ cursor: "grabbing" }}
          style={{ display: "flex", gap: 16, paddingBottom: 8, willChange: "transform" }}
        >
          {categoryCards.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </motion.div>
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: fontStacks.mono,
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#8A8A82",
        }}
      >
        ← DRAG · TOUCH · SCROLL →
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }: { cat: (typeof categoryCards)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease, delay: index * 0.05 }}
      style={{
        flex: "0 0 auto",
        width: "78vw",
        maxWidth: 420,
        transform: index % 2 === 0 ? "skewY(-1deg)" : "skewY(1deg)",
      }}
      className="sm:w-[60vw] md:w-[42vw] lg:w-[28vw]"
    >
      <div style={{ transform: index % 2 === 0 ? "skewY(1deg)" : "skewY(-1deg)" }}>
        <Link
          href={"/products?category=" + cat.slug}
          style={{
            position: "relative",
            display: "block",
            aspectRatio: "3 / 4",
            background: C.surface,
            overflow: "hidden",
            border: "1px solid " + C.border,
          }}
        >
          {cat.hero?.images?.[0] ? (
            <Image
              src={cat.hero.images[0]}
              alt={cat.label}
              fill
              sizes="(min-width:1024px) 28vw, 78vw"
              style={{ objectFit: "cover", filter: "grayscale(0.4) contrast(1.05)" }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.75) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              fontFamily: fontStacks.mono,
              fontWeight: 900,
              fontSize: "clamp(56px, 8vw, 110px)",
              lineHeight: 0.9,
              color: C.yellow,
              letterSpacing: "-0.03em",
            }}
          >
            {cat.seq}
          </div>
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 16,
              width: 36,
              height: 36,
              border: "1.5px solid " + C.cream,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.cream,
            }}
            aria-hidden
          >
            <ArrowUpRight size={18} strokeWidth={2} />
          </div>
          <div style={{ position: "absolute", bottom: 18, left: 16, right: 16 }}>
            <div
              style={{
                fontFamily: fontStacks.heading,
                fontWeight: 900,
                fontSize: "clamp(28px, 4vw, 48px)",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: C.cream,
                lineHeight: 1,
              }}
            >
              {cat.label}
            </div>
            <div
              style={{
                fontFamily: fontStacks.mono,
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#A6A69E",
                marginTop: 8,
              }}
            >
              {cat.count} OBJECTS
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

function FeaturedGrid() {
  return (
    <section style={{ background: C.bg, color: C.cream, padding: "72px 16px" }} className="sm:px-6 lg:px-10 lg:py-28">
      <SectionHeader index="03" title="FEATURED PIECES" sub="Three objects, three obsessions." />
      <div
        className="mt-10 grid gap-5 lg:gap-6 lg:[grid-template-columns:1fr_2fr_1fr]"
        style={{ gridTemplateColumns: "1fr" }}
      >
        {gridPieces.map((p, i) => (
          <FeaturedCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ product, index }: { product: (typeof featured)[number]; index: number }) {
  const lot = String((index + 1) * 17 + 100).padStart(3, "0");
  const [hover, setHover] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, x: -80, skewX: -4 }}
      whileInView={{ opacity: 1, x: 0, skewX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease, delay: index * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: C.surface,
        border: "4px solid " + (hover ? C.yellow : C.cream),
        padding: 14,
        transition: "border-color 220ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          transform: "rotate(-12deg)",
          fontFamily: fontStacks.mono,
          fontWeight: 900,
          color: C.yellow,
          fontSize: 14,
          letterSpacing: "0.18em",
          zIndex: 2,
          background: "rgba(10,10,10,0.7)",
          padding: "4px 8px",
        }}
      >
        № {lot}
      </div>

      <div style={{ position: "relative", aspectRatio: "4 / 3", background: C.bg, overflow: "hidden" }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 33vw, 90vw"
            style={{ objectFit: "cover" }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: C.yellow,
            color: C.bg,
            padding: "10px 14px",
            fontFamily: fontStacks.mono,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "0.16em",
          }}
        >
          {formatCurrencyOMR(product.price)}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            fontFamily: fontStacks.mono,
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#A6A69E",
          }}
        >
          {product.brand} · {product.scale}
        </div>
        <h3
          style={{
            fontFamily: fontStacks.heading,
            fontWeight: 900,
            fontSize: "clamp(20px, 2.4vw, 28px)",
            textTransform: "uppercase",
            letterSpacing: "-0.015em",
            lineHeight: 1.05,
            marginTop: 8,
            color: C.cream,
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: fontStacks.mono,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: hover ? C.yellow : "#8A8A82" }}>VIEW OBJECT</span>
          <ArrowUpRight
            size={18}
            strokeWidth={2.5}
            color={hover ? C.yellow : C.cream}
            style={{
              transition: "transform 220ms ease",
              transform: hover ? "translate(2px,-2px)" : "translate(0,0)",
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}

function LotList() {
  return (
    <section
      style={{ background: C.bg, color: C.cream, padding: "72px 16px", borderTop: "1px solid " + C.border }}
      className="sm:px-6 lg:px-10 lg:py-28"
    >
      <SectionHeader index="04" title="THE NUMBERED LOTS" sub="Limited editions, signed and stamped." />
      <div style={{ marginTop: 28 }}>
        {limited.map((p, i) => (
          <LotRow
            key={p.id}
            product={p}
            lot={LOT_NUMBERS[i] ?? String(i + 1).padStart(3, "0")}
            status={LOT_STATUSES[i] ?? "AVAILABLE"}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

function LotRow({
  product,
  lot,
  status,
  index,
}: {
  product: (typeof limited)[number];
  lot: string;
  status: LotStatus;
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const isSold = status === "SOLD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease, delay: index * 0.05 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "baseline",
        rowGap: 6,
        columnGap: 16,
        padding: "22px 12px",
        borderBottom: "1px solid " + C.border,
        background: hover ? C.yellow : "transparent",
        color: hover ? C.bg : C.cream,
        transition: "background 220ms ease, color 220ms ease",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: fontStacks.mono,
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: "0.22em",
          color: hover ? C.bg : C.yellow,
          minWidth: 56,
        }}
      >
        № {lot}
      </span>

      <span
        style={{
          fontFamily: fontStacks.serif,
          fontStyle: "italic",
          fontSize: "clamp(22px, 3.4vw, 40px)",
          lineHeight: 1.1,
          letterSpacing: "-0.005em",
          position: "relative",
          display: "inline-block",
        }}
      >
        {product.name.toUpperCase()}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ width: hover && !isSold ? "100%" : "0%" }}
          transition={{ duration: 0.28, ease }}
          style={{
            position: "absolute",
            left: 0,
            top: "55%",
            height: 4,
            background: C.red,
            willChange: "width",
          }}
        />
      </span>

      <span
        style={{
          fontFamily: fontStacks.mono,
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: "0.16em",
          color: hover ? C.bg : C.cream,
          whiteSpace: "nowrap",
        }}
      >
        {formatCurrencyOMR(product.price)}
      </span>

      <span
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          fontFamily: fontStacks.mono,
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          marginTop: 4,
          color: hover ? C.bg : "#8A8A82",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: isSold
              ? "#FF3D00"
              : status === "RESERVED"
              ? hover
                ? C.bg
                : "#A6A69E"
              : hover
              ? C.bg
              : C.yellow,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background:
                status === "AVAILABLE"
                  ? hover
                    ? C.bg
                    : C.yellow
                  : status === "RESERVED"
                  ? "#A6A69E"
                  : C.red,
              display: "inline-block",
            }}
          />
          {status}
        </span>

        <AnimatePresence>
          {hover && (
            <motion.span
              key="cta"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.22, ease }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: C.red,
                fontWeight: 800,
              }}
            >
              VIEW LOT
              <ArrowRight size={14} strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.div>
  );
}

function Statement() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);

  return (
    <section
      ref={ref}
      style={{
        background: C.bg,
        color: C.cream,
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px",
        position: "relative",
        overflow: "hidden",
      }}
      className="sm:px-6 lg:px-10"
    >
      <div
        style={{ position: "absolute", top: 24, left: 16, right: 16 }}
        className="sm:left-6 sm:right-6 lg:left-10 lg:right-10"
      >
        <SectionHeader index="05" title="MANIFESTO" sub="A note from the curator." />
      </div>

      <motion.h2
        style={{
          rotate,
          scale,
          fontFamily: fontStacks.heading,
          fontStyle: "italic",
          fontWeight: 900,
          textTransform: "uppercase",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          textAlign: "center",
          WebkitTextStroke: "2px " + C.yellow,
          color: "transparent",
          margin: 0,
          maxWidth: 1100,
          padding: "0 8px",
        }}
        className="text-6xl md:text-[8rem] lg:text-[10rem]"
      >
        Every object<br />tells a story.
      </motion.h2>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fontStacks.mono,
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#8A8A82",
        }}
      >
        — MUSCAT MANIFESTO, 2026
      </div>
    </section>
  );
}

function Newsletter() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 2400);
    setValue("");
  }

  return (
    <section
      style={{ background: C.yellow, color: C.bg, padding: "80px 16px" }}
      className="sm:px-6 lg:px-10 lg:py-32"
    >
      <div
        className="grid gap-10 lg:gap-16 lg:[grid-template-columns:1.1fr_1fr] lg:items-end"
        style={{ gridTemplateColumns: "1fr" }}
      >
        <div>
          <div
            style={{
              fontFamily: fontStacks.mono,
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
              color: C.bg,
            }}
          >
            № 06 / FIRST ACCESS
          </div>
          <h2
            style={{
              fontFamily: fontStacks.heading,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              margin: 0,
              color: C.bg,
            }}
            className="text-5xl md:text-7xl lg:text-8xl"
          >
            GET FIRST<br />ACCESS.
          </h2>
          <p
            style={{
              fontFamily: fontStacks.serif,
              fontStyle: "italic",
              marginTop: 18,
              color: C.bg,
              opacity: 0.78,
              maxWidth: 460,
            }}
            className="text-lg md:text-xl"
          >
            New objects drop monthly. Unsubscribe in one click.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <label
            htmlFor="kb-email"
            style={{
              fontFamily: fontStacks.mono,
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: C.bg,
            }}
          >
            EMAIL
          </label>
          <div
            style={{
              marginTop: 10,
              borderBottom: (focused ? 5 : 3) + "px solid " + C.bg,
              transition: "border-bottom-width 180ms ease",
              paddingBottom: 8,
            }}
          >
            <input
              id="kb-email"
              type="email"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="you@studio.example"
              style={{
                width: "100%",
                background: "transparent",
                border: 0,
                outline: "none",
                fontFamily: fontStacks.heading,
                fontWeight: 700,
                fontSize: 28,
                color: C.bg,
                letterSpacing: "-0.01em",
              }}
              className="md:text-4xl"
            />
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              style={{
                background: C.bg,
                color: C.yellow,
                borderRadius: 999,
                padding: "16px 26px",
                fontFamily: fontStacks.mono,
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
                cursor: "pointer",
                border: "none",
              }}
            >
              JOIN THE LIST
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <AnimatePresence>
              {sent && (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: fontStacks.mono,
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: C.bg,
                  }}
                >
                  <Check size={16} strokeWidth={2.5} /> ON THE LIST
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const col = (heading: string, items: string[]) => (
    <div>
      <div
        style={{
          fontFamily: fontStacks.mono,
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: C.yellow,
          marginBottom: 14,
        }}
      >
        {heading}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: fontStacks.mono,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.cream,
              cursor: "pointer",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer
      style={{
        background: C.bg,
        color: C.cream,
        borderTop: "1px solid " + C.border,
        padding: "56px 16px 32px",
      }}
      className="sm:px-6 lg:px-10 lg:pt-24"
    >
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            className="kb-spin"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: C.yellow,
              color: C.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontStacks.heading,
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "-0.02em",
              animation: "kb-spin 24s linear infinite",
            }}
            aria-hidden
          >
            DM
          </div>
          <div>
            <div
              style={{
                fontFamily: fontStacks.heading,
                fontWeight: 900,
                fontSize: 22,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              DIECAST MUSCAT
            </div>
            <div
              style={{
                fontFamily: fontStacks.mono,
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#8A8A82",
                marginTop: 4,
              }}
            >
              HOUSE OF CRAFTS · MMXXVI
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-16">
          {col("VAULT", ["Cars", "Planes", "Trucks", "Bikes"])}
          {col("HOUSE", ["About", "Authenticity", "Care", "Contact"])}
          {col("LEGAL", ["Terms", "Privacy", "Shipping", "Returns"])}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {[
            { Glyph: InstagramGlyph, label: "Instagram" },
            { Glyph: TwitterGlyph, label: "Twitter" },
          ].map(({ Glyph, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              style={{
                width: 44,
                height: 44,
                border: "1.5px solid " + C.border,
                background: "transparent",
                color: C.cream,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Glyph size={18} />
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: "1px solid " + C.border,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontFamily: fontStacks.mono,
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#8A8A82",
        }}
        className="md:flex-row md:items-center md:justify-between"
      >
        <span>© MMXXVI DIECAST MUSCAT — ALL RIGHTS RESERVED</span>
        <span>MUSCAT · OMAN · MMXXVI</span>
      </div>
    </footer>
  );
}

function SectionHeader({
  index,
  title,
  sub,
}: {
  index: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: fontStacks.mono,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.yellow,
          }}
        >
          № {index}
        </span>
        <h2
          style={{
            fontFamily: fontStacks.heading,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: C.cream,
            margin: 0,
            lineHeight: 1,
          }}
          className="text-4xl md:text-6xl"
        >
          {title}
        </h2>
      </div>
      {sub && (
        <p
          style={{
            fontFamily: fontStacks.serif,
            fontStyle: "italic",
            color: "#A6A69E",
            margin: 0,
            maxWidth: 380,
          }}
          className="text-base md:text-lg"
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function LandingKinetic() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS + KEYFRAMES_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{ background: C.bg, color: C.cream }}
      >
        <TopTicker />
        <Hero />
        <NamesMarquee />
        <Categories />
        <FeaturedGrid />
        <LotList />
        <Statement />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
}
