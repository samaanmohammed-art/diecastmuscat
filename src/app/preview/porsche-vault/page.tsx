"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, Plus, Truck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; padding: 0 !important; }
  html, body { background: #EDEBE6; }
`;

const PRODUCT = {
  name: "Porsche 911 GT3 RS",
  edition: "Weissach Package",
  scale: "1:18",
  year: 2024,
  weight: 1840,
  brand: "Minichamps",
  price: 374900,
  edition_number: "0042 / 0500",
  image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85",
} as const;

const V = {
  bgCenter: "#F5F4F1",
  bgEdge: "#E5E3DE",
  ink: "#0F0F0F",
  inkSoft: "#6B6B68",
  bronze: "#8B7E60",
  surface: "#FFFFFF",
  hairline: "rgba(15,15,15,0.06)",
  hairlineStrong: "rgba(15,15,15,0.15)",
  shadow: "0 30px 60px -20px rgba(15,15,15,0.08)",
  shadowDeep: "0 40px 80px -24px rgba(15,15,15,0.18)",
} as const;

const INTER_STACK = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const SERIF_STACK = "'Instrument Serif', 'Cormorant Garamond', Georgia, serif";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING_SOFT = { type: "spring" as const, stiffness: 300, damping: 25 };

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function useCountUp(target: number, durationMs: number, trigger: boolean, reduced: boolean) {
  const [value, setValue] = useState<number>(reduced ? target : 0);

  useEffect(() => {
    if (!trigger || reduced) return;
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = target;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, durationMs, reduced]);

  return reduced ? target : value;
}

export default function PorscheVaultPage() {
  const reduced = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({ container: scrollRef });
  const smoothScroll = useSpring(scrollY, { stiffness: 120, damping: 30, mass: 0.4 });

  const hudLeftY = useTransform(smoothScroll, [0, 400], [0, -10]);
  const hudRightY = useTransform(smoothScroll, [0, 400], [0, -20]);

  const carRotate = useTransform(smoothScroll, [0, 500], [0, reduced ? 0 : 3]);
  const carScale = useTransform(smoothScroll, [0, 500], [1, reduced ? 1 : 1.04]);

  const spoilerY = useTransform(smoothScroll, [0, 400], [0, reduced ? 0 : -12]);

  const floatY = useMotionValue(0);
  const shadowScale = useTransform(floatY, [-6, 6], [1.08, 0.86]);
  const shadowOpacity = useTransform(floatY, [-6, 6], [0.95, 1.1]);

  useEffect(() => {
    if (reduced) {
      floatY.set(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 5000) % 1;
      const v = Math.sin(t * Math.PI * 2) * 6;
      floatY.set(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [floatY, reduced]);

  const [priceHover, setPriceHover] = useState<boolean>(false);

  const [xray, setXray] = useState<boolean>(false);
  const [xrayHover, setXrayHover] = useState<boolean>(false);

  const specRef = useRef<HTMLDivElement>(null);
  const specInView = useInView(specRef, { once: true, margin: "-40px" });
  const weight = useCountUp(PRODUCT.weight, 900, specInView, reduced);

  const [scrolled, setScrolled] = useState<boolean>(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        ref={scrollRef}
        className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
        style={{
          fontFamily: INTER_STACK,
          color: V.ink,
          background: `radial-gradient(ellipse 90% 70% at 50% 38%, ${V.bgCenter} 0%, ${V.bgEdge} 100%)`,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
            mixBlendMode: "multiply",
          }}
        />

        <section
          className="relative w-full"
          style={{ minHeight: "100dvh" }}
          aria-label="Vault display"
        >
          <motion.div
            style={{ y: hudLeftY }}
            className="absolute left-5 top-12 z-20 sm:left-8 sm:top-14"
          >
            <div
              className="text-[10px] font-medium uppercase"
              style={{
                color: V.ink,
                letterSpacing: "0.32em",
              }}
            >
              {PRODUCT.scale} Scale
            </div>
            <div
              className="mt-2"
              style={{
                width: 24,
                height: 1,
                background: "rgba(15,15,15,0.3)",
              }}
            />
          </motion.div>

          <motion.div
            style={{ y: hudRightY }}
            className="absolute right-5 top-12 z-20 sm:right-8 sm:top-14"
            onMouseEnter={() => setPriceHover(true)}
            onMouseLeave={() => setPriceHover(false)}
            onTouchStart={() => setPriceHover((p) => !p)}
          >
            <button
              type="button"
              className="group flex flex-col items-end outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                color: V.ink,
                borderRadius: 4,
              }}
              aria-label="Show shipping detail"
            >
              <div
                className="text-[10px] font-medium uppercase"
                style={{
                  color: V.inkSoft,
                  letterSpacing: "0.32em",
                }}
              >
                Price
              </div>
              <div
                className="mt-1 text-2xl font-medium tabular-nums sm:text-[28px]"
                style={{
                  color: V.bronze,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {formatNumber(PRODUCT.price)}
                <span
                  className="ml-1.5 text-xs font-medium tabular-nums"
                  style={{ color: V.bronze, letterSpacing: "0.18em" }}
                >
                  OMR
                </span>
              </div>
            </button>

            <div className="relative mt-3 h-9 w-full">
              <AnimatePresence>
                {priceHover && (
                  <motion.div
                    key="vault-capsule"
                    initial={{ y: 8, opacity: 0, scale: 0.96 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 6, opacity: 0, scale: 0.97 }}
                    transition={SPRING_SOFT}
                    aria-live="polite"
                    className="absolute right-0 top-0 flex h-9 items-center gap-2 rounded-full px-3.5"
                    style={{
                      background: V.ink,
                      color: "#FFFFFF",
                      boxShadow: V.shadow,
                    }}
                  >
                    <Truck className="h-3 w-3" strokeWidth={2} />
                    <span
                      className="text-[9px] font-medium uppercase"
                      style={{ letterSpacing: "0.36em" }}
                    >
                      Muscat Vault to your door
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EXPO_OUT }}
            className="absolute left-1/2 top-[120px] z-10 w-full -translate-x-1/2 px-6 text-center sm:top-[140px]"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="text-[9px] font-medium uppercase"
              style={{ color: V.inkSoft, letterSpacing: "0.42em" }}
            >
              {PRODUCT.brand} — Edition {PRODUCT.year}
            </div>
            <h1
              className="mt-3 text-[22px] font-normal leading-tight sm:text-[28px] md:text-[32px]"
              style={{
                fontFamily: SERIF_STACK,
                fontStyle: "italic",
                color: V.ink,
                letterSpacing: "-0.01em",
              }}
            >
              {PRODUCT.name}
            </h1>
            <div
              className="mt-1.5 text-[10px] font-medium uppercase"
              style={{ color: V.ink, letterSpacing: "0.36em" }}
            >
              {PRODUCT.edition}
            </div>
          </motion.div>

          <div
            className="absolute inset-x-0 flex items-center justify-center"
            style={{
              top: "44%",
              transform: "translateY(-44%)",
            }}
          >
            <div className="relative w-[88vw] max-w-[860px]">
              <motion.div
                style={{
                  y: reduced ? 0 : floatY,
                  rotate: carRotate,
                  scale: carScale,
                }}
                className="relative aspect-[16/10]"
              >
                <AnimatePresence initial={false} mode="sync">
                  {!xray && (
                    <motion.div
                      key="photo"
                      initial={{ opacity: reduced ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: reduced ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.3, ease: EXPO_OUT }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={PRODUCT.image}
                        alt={`${PRODUCT.name} — ${PRODUCT.edition}, ${PRODUCT.scale} scale model`}
                        fill
                        priority
                        sizes="(min-width: 768px) 860px, 88vw"
                        className="object-contain"
                        style={{
                          filter: "drop-shadow(0 24px 36px rgba(15,15,15,0.18))",
                        }}
                      />
                    </motion.div>
                  )}

                  {xray && (
                    <motion.div
                      key="xray"
                      initial={{ opacity: reduced ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: reduced ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.3, ease: EXPO_OUT }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={PRODUCT.image}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 768px) 860px, 88vw"
                        className="object-contain"
                        style={{
                          filter:
                            "grayscale(1) contrast(1.6) invert(0.9) hue-rotate(180deg) brightness(0.95)",
                        }}
                      />
                      <XRaySchematic reduced={reduced} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  aria-hidden
                  style={{ y: spoilerY }}
                  className="pointer-events-none absolute inset-0"
                >
                  <div
                    className="absolute"
                    style={{
                      right: "12%",
                      top: "18%",
                      width: "22%",
                      height: "18%",
                      background:
                        "linear-gradient(180deg, rgba(15,15,15,0.18) 0%, rgba(15,15,15,0) 100%)",
                      mixBlendMode: "multiply",
                      borderRadius: 2,
                      filter: "blur(6px)",
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                aria-hidden
                style={{
                  scale: reduced ? 1 : shadowScale,
                  opacity: reduced ? 1 : shadowOpacity,
                }}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2"
              >
                <div
                  style={{
                    width: "62vw",
                    maxWidth: 540,
                    height: 60,
                    marginTop: 8,
                    background:
                      "radial-gradient(ellipse at center, rgba(15,15,15,0.18) 0%, rgba(15,15,15,0) 70%)",
                    filter: "blur(2px)",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div
            ref={specRef}
            className="absolute inset-x-0 z-10"
            style={{ bottom: 132 }}
          >
            <div className="mx-auto flex max-w-[520px] items-stretch justify-between px-8 sm:max-w-[640px]">
              <SpecCell label="Year" value={String(PRODUCT.year)} delay={0} />
              <Divider />
              <SpecCell label="Weight" value={`${formatNumber(weight)} G`} delay={0.05} />
              <Divider />
              <SpecCell label="Brand" value={PRODUCT.brand} delay={0.1} />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-8">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EXPO_OUT }}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              className="group inline-flex h-12 items-center gap-2.5 rounded-full px-7 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: V.ink,
                color: "#FFFFFF",
                boxShadow: V.shadow,
                minHeight: 48,
              }}
              aria-label="View full details"
            >
              <span
                className="text-[11px] font-medium uppercase"
                style={{ letterSpacing: "0.24em" }}
              >
                Full Details
              </span>
              <motion.span
                variants={{ hover: { x: 4 } }}
                transition={SPRING_SOFT}
                className="inline-flex"
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </motion.span>
            </motion.button>

            <div
              className="mt-5"
              style={{
                width: 80,
                height: 1,
                background: V.bronze,
                opacity: 0.5,
              }}
            />

            <div
              className="mt-4 text-[9px] font-medium uppercase tabular-nums"
              style={{
                color: V.inkSoft,
                letterSpacing: "0.36em",
                fontFamily: INTER_STACK,
              }}
            >
              Edition {PRODUCT.edition_number} — Sealed
            </div>
          </div>

          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 0 : 1 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            className="absolute left-1/2 z-[5] -translate-x-1/2"
            style={{ bottom: 8 }}
          >
            <div
              className="h-[14px] w-[1px]"
              style={{
                background: `linear-gradient(180deg, transparent, ${V.inkSoft})`,
              }}
            />
          </motion.div>
        </section>

        <ProvenanceSection reduced={reduced} />

        <XRayFab
          active={xray}
          onToggle={() => setXray((v) => !v)}
          hover={xrayHover}
          setHover={setXrayHover}
        />
      </div>
    </>
  );
}

function SpecCell({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: EXPO_OUT }}
      className="flex min-w-0 flex-1 flex-col items-center text-center"
    >
      <div
        className="text-[9px] font-medium uppercase"
        style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
      >
        {label}
      </div>
      <div
        className="mt-2 text-base font-medium tabular-nums"
        style={{ color: V.ink, letterSpacing: "-0.005em" }}
      >
        {value}
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden
      className="self-center"
      style={{
        width: 1,
        height: 32,
        background: "rgba(15,15,15,0.15)",
      }}
    />
  );
}

function XRayFab({
  active,
  onToggle,
  hover,
  setHover,
}: {
  active: boolean;
  onToggle: () => void;
  hover: boolean;
  setHover: (v: boolean) => void;
}) {
  return (
    <div
      className="fixed z-30"
      style={{
        right: 24,
        bottom: 24,
      }}
    >
      <div className="relative flex items-center">
        <AnimatePresence>
          {hover && (
            <motion.div
              key="xray-tooltip"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: EXPO_OUT }}
              className="pointer-events-none absolute right-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-2"
              style={{
                background: V.ink,
                color: "#FFFFFF",
                boxShadow: V.shadow,
              }}
            >
              <span
                className="text-[9px] font-medium uppercase"
                style={{
                  letterSpacing: "0.36em",
                  fontFamily: INTER_STACK,
                }}
              >
                X-Ray
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          whileTap={{ scale: 0.94 }}
          transition={SPRING_SOFT}
          aria-label={active ? "Disable X-Ray view" : "Enable X-Ray view"}
          aria-pressed={active}
          className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            width: 56,
            height: 56,
            background: active ? V.ink : V.surface,
            border: active ? "1px solid rgba(255,255,255,0.12)" : `1px solid ${V.hairline}`,
            color: active ? "#FFFFFF" : V.ink,
            boxShadow: active
              ? "0 20px 40px -16px rgba(15,15,15,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)"
              : V.shadow,
            transition: "background 280ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <motion.span
            key={active ? "x" : "plus"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25, ease: EXPO_OUT }}
            className="inline-flex"
          >
            {active ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            )}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}

function XRaySchematic({ reduced }: { reduced: boolean }) {
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: reduced ? 0 : 0.6, ease: EXPO_OUT, delay: 0.1 },
    },
  };

  const labelVariants: Variants = {
    hidden: { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.4, ease: EXPO_OUT, delay: 0.55 },
    },
  };

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <motion.line
        x1={760}
        y1={240}
        x2={880}
        y2={120}
        stroke="#0F0F0F"
        strokeWidth={1}
        variants={draw}
        initial="hidden"
        animate="show"
        strokeLinecap="round"
      />
      <motion.circle
        cx={760}
        cy={240}
        r={3}
        fill="#0F0F0F"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: reduced ? 0 : 0.3 }}
      />
      <motion.g variants={labelVariants} initial="hidden" animate="show">
        <line x1={880} y1={120} x2={950} y2={120} stroke="#0F0F0F" strokeWidth={1} />
        <text
          x={888}
          y={112}
          fill="#0F0F0F"
          fontFamily={INTER_STACK}
          fontSize={9}
          fontWeight={500}
          letterSpacing={3.5}
          textAnchor="start"
        >
          AERO
        </text>
      </motion.g>

      <motion.line
        x1={500}
        y1={380}
        x2={380}
        y2={500}
        stroke="#0F0F0F"
        strokeWidth={1}
        variants={draw}
        initial="hidden"
        animate="show"
        strokeLinecap="round"
      />
      <motion.circle
        cx={500}
        cy={380}
        r={3}
        fill="#0F0F0F"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: reduced ? 0 : 0.3 }}
      />
      <motion.g variants={labelVariants} initial="hidden" animate="show">
        <line x1={380} y1={500} x2={310} y2={500} stroke="#0F0F0F" strokeWidth={1} />
        <text
          x={302}
          y={494}
          fill="#0F0F0F"
          fontFamily={INTER_STACK}
          fontSize={9}
          fontWeight={500}
          letterSpacing={3.5}
          textAnchor="end"
        >
          CHASSIS
        </text>
      </motion.g>

      <motion.line
        x1={680}
        y1={320}
        x2={820}
        y2={460}
        stroke="#0F0F0F"
        strokeWidth={1}
        variants={draw}
        initial="hidden"
        animate="show"
        strokeLinecap="round"
      />
      <motion.circle
        cx={680}
        cy={320}
        r={3}
        fill="#0F0F0F"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: reduced ? 0 : 0.3 }}
      />
      <motion.g variants={labelVariants} initial="hidden" animate="show">
        <line x1={820} y1={460} x2={900} y2={460} stroke="#0F0F0F" strokeWidth={1} />
        <text
          x={908}
          y={454}
          fill="#0F0F0F"
          fontFamily={INTER_STACK}
          fontSize={9}
          fontWeight={500}
          letterSpacing={3.5}
          textAnchor="start"
        >
          ENGINE
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: reduced ? 0 : 0.4 }}
      >
        <line x1={440} y1={560} x2={560} y2={560} stroke="#0F0F0F" strokeWidth={1} />
        <line x1={440} y1={556} x2={440} y2={564} stroke="#0F0F0F" strokeWidth={1} />
        <line x1={560} y1={556} x2={560} y2={564} stroke="#0F0F0F" strokeWidth={1} />
        <text
          x={500}
          y={552}
          fill="#0F0F0F"
          fontFamily={INTER_STACK}
          fontSize={8}
          fontWeight={500}
          letterSpacing={3}
          textAnchor="middle"
        >
          1 : 18
        </text>
      </motion.g>
    </svg>
  );
}

const PROVENANCE_NOTES: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Crafted in Germany.",
    body: "Each model is hand-finished at the Minichamps atelier in Aachen. Body lines milled to within fifty microns of the original Weissach blueprints.",
  },
  {
    title: "Sealed presentation.",
    body: "Delivered in a tempered-glass vitrine on a brushed-aluminium plinth. Climate-stable, museum-grade — designed never to be opened.",
  },
  {
    title: "Numbered edition.",
    body: "Five-hundred pieces worldwide. Each plate hand-engraved and matched to a leather-bound certificate co-signed by the Porsche heritage office.",
  },
];

const DETAILS: ReadonlyArray<{ caption: string; pos: string }> = [
  { caption: "Front splitter", pos: "20% 50%" },
  { caption: "Side intake", pos: "45% 60%" },
  { caption: "Rear wing", pos: "75% 40%" },
  { caption: "Wheel detail", pos: "30% 80%" },
];

function ProvenanceSection({ reduced }: { reduced: boolean }) {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section
      className="relative w-full px-6 pb-32 pt-24 sm:px-10 sm:pt-32"
      aria-label="Provenance"
    >
      <div className="mx-auto max-w-[1080px]">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 12 }}
          animate={headInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
        >
          <div
            className="text-[10px] font-medium uppercase"
            style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
          >
            §02 — Provenance
          </div>
          <h2
            className="mt-4 text-[40px] font-normal leading-[1.05] sm:text-[56px] md:text-[68px]"
            style={{
              fontFamily: SERIF_STACK,
              fontStyle: "italic",
              color: V.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Provenance.
          </h2>
          <div
            className="mt-6"
            style={{
              width: 48,
              height: 1,
              background: V.bronze,
            }}
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-20 sm:grid-cols-3">
          {PROVENANCE_NOTES.map((note, i) => (
            <motion.article
              key={note.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: reduced ? 0 : i * 0.08,
                ease: EXPO_OUT,
              }}
              className="flex flex-col"
            >
              <div
                className="text-[9px] font-medium uppercase tabular-nums"
                style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
              >
                0{i + 1}
              </div>
              <h3
                className="mt-4 text-xl font-normal"
                style={{
                  fontFamily: SERIF_STACK,
                  fontStyle: "italic",
                  color: V.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {note.title}
              </h3>
              <p
                className="mt-3 text-[13.5px] font-normal leading-[1.65]"
                style={{
                  color: V.inkSoft,
                  letterSpacing: "0.005em",
                }}
              >
                {note.body}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-24 sm:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EXPO_OUT }}
            className="flex items-baseline justify-between gap-6 border-b pb-5"
            style={{ borderColor: V.hairline }}
          >
            <div>
              <div
                className="text-[10px] font-medium uppercase"
                style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
              >
                §03 — Details
              </div>
              <h3
                className="mt-3 text-2xl font-normal sm:text-3xl"
                style={{
                  fontFamily: SERIF_STACK,
                  fontStyle: "italic",
                  color: V.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                In closer study.
              </h3>
            </div>
            <div
              className="hidden text-[10px] font-medium uppercase sm:block"
              style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
            >
              Four crops
            </div>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-5">
            {DETAILS.map((d, i) => (
              <DetailThumb key={d.caption} detail={d} index={i} reduced={reduced} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EXPO_OUT }}
          className="mt-24 flex flex-col items-center text-center sm:mt-32"
        >
          <div
            style={{
              width: 1,
              height: 56,
              background: `linear-gradient(180deg, transparent, ${V.inkSoft})`,
            }}
          />
          <div
            className="mt-6 text-[9px] font-medium uppercase tabular-nums"
            style={{ color: V.inkSoft, letterSpacing: "0.42em" }}
          >
            Diecast Muscat — The Vault — MMXXVI
          </div>
          <div
            className="mt-3 max-w-md text-[13px] font-normal leading-[1.65]"
            style={{ color: V.inkSoft, fontStyle: "italic", fontFamily: SERIF_STACK }}
          >
            Held in climate-stable storage at our Al Mouj atrium. Private viewing by appointment.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DetailThumb({
  detail,
  index,
  reduced,
}: {
  detail: { caption: string; pos: string };
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: reduced ? 0 : index * 0.08,
        ease: EXPO_OUT,
      }}
      whileHover={reduced ? undefined : { y: -4, scale: 1.03 }}
      className="group relative overflow-hidden"
      style={{
        background: V.surface,
        border: `1px solid ${V.hairline}`,
        borderRadius: 6,
        boxShadow: V.shadow,
        cursor: "pointer",
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={PRODUCT.image}
          alt={`${PRODUCT.name} — ${detail.caption}`}
          fill
          sizes="(min-width: 640px) 240px, 45vw"
          className="object-cover"
          style={{
            objectPosition: detail.pos,
            transform: "scale(2.4)",
            transformOrigin: detail.pos,
            transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 80%, rgba(15,15,15,0.06) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
      <figcaption
        className="flex items-center justify-between border-t px-3.5 py-3"
        style={{
          borderColor: V.hairline,
          background: V.surface,
        }}
      >
        <span
          className="text-[9px] font-medium uppercase"
          style={{ color: V.inkSoft, letterSpacing: "0.36em" }}
        >
          0{index + 1}
        </span>
        <span
          className="text-[10.5px] font-medium"
          style={{ color: V.ink, letterSpacing: "0.04em" }}
        >
          {detail.caption}
        </span>
      </figcaption>
    </motion.figure>
  );
}
