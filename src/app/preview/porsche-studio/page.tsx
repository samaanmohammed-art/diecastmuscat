"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Plus, Truck, X } from "lucide-react";

const PRODUCT = {
  name: "Porsche 911 GT3 RS",
  edition: "Weissach Package",
  scale: "1:18",
  year: 2024,
  weight: 1840,
  brand: "Minichamps",
  price: 374900,
  edition_number: "0042 / 0500",
  image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85",
} as const;

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;
const FONT_SANS = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; padding: 0 !important; }
  html, body { background: #0A0A0A !important; }
`;

const PROVENANCE = [
  {
    title: "Crafted in Germany.",
    body: "Each shell hand-assembled in Aachen by Minichamps' senior modelmakers.",
  },
  {
    title: "Sealed presentation.",
    body: "Delivered in a numbered acrylic vitrine with provenance certificate.",
  },
  {
    title: "Numbered edition.",
    body: "Five hundred examples worldwide. Once they're gone, the mould is retired.",
  },
];

const DETAIL_CROPS = [
  { label: "Front quarter", position: "20% 40%" },
  { label: "Rear wing", position: "85% 55%" },
  { label: "Cockpit", position: "55% 35%" },
  { label: "Wheel", position: "30% 80%" },
];

const XRAY_CALLOUTS = [
  { label: "AERO", x1: 0.32, y1: 0.18, x2: 0.18, y2: 0.08 },
  { label: "CHASSIS", x1: 0.5, y1: 0.62, x2: 0.74, y2: 0.86 },
  { label: "ENGINE", x1: 0.68, y1: 0.42, x2: 0.9, y2: 0.22 },
  { label: "BRAKES", x1: 0.24, y1: 0.66, x2: 0.08, y2: 0.84 },
];

function useCountUp(target: number, durationMs = 900, trigger = false): number {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    if (reduced) {
      raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, durationMs, reduced]);

  return value;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export default function PorscheStudioPage() {
  const reduced = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const smoothScroll = useSpring(scrollY, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const hudLeftY = useTransform(smoothScroll, [0, 400], [0, -10]);
  const hudRightY = useTransform(smoothScroll, [0, 400], [0, -20]);

  const carRotate = useTransform(smoothScroll, [0, 400], [0, reduced ? 0 : 3]);
  const carScale = useTransform(smoothScroll, [0, 400], [1, reduced ? 1 : 1.04]);
  const headlightOpacity = useTransform(smoothScroll, [40, 280], [0, 1]);
  const spoilerY = useTransform(smoothScroll, [40, 280], [0, -10]);
  const spoilerOpacity = useTransform(smoothScroll, [40, 280], [0, 0.55]);

  const floatY = useMotionValue(0);
  const spotlightScale = useTransform(floatY, [-6, 6], [1.05, 0.95]);

  const [priceOpen, setPriceOpen] = useState(false);
  const priceHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openPrice() {
    if (priceHoverTimer.current) clearTimeout(priceHoverTimer.current);
    setPriceOpen(true);
  }
  function schedulePriceClose() {
    if (priceHoverTimer.current) clearTimeout(priceHoverTimer.current);
    priceHoverTimer.current = setTimeout(() => setPriceOpen(false), 1800);
  }

  const [xray, setXray] = useState(false);
  const [xrayTip, setXrayTip] = useState(false);

  const weightRef = useRef<HTMLDivElement | null>(null);
  const weightInView = useInView(weightRef, { once: true, margin: "-40px" });
  const weightValue = useCountUp(PRODUCT.weight, 900, weightInView);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        ref={scrollContainerRef}
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          background:
            "linear-gradient(180deg, #1A1A1A 0%, #141414 45%, #0A0A0A 100%)",
          fontFamily: FONT_SANS,
          color: "#FFFFFF",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <section
          className="relative w-full"
          style={{ minHeight: "100dvh" }}
          aria-label="Product hero"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              top: "38%",
              width: "min(120vw, 60vh)",
              height: "60vh",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 28%, rgba(255,255,255,0) 65%)",
              filter: "blur(2px)",
              scale: spotlightScale,
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "22%",
              width: "min(92vw, 720px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
            }}
          />

          <motion.div
            className="absolute left-5 z-30"
            style={{
              top: "calc(env(safe-area-inset-top, 0px) + 48px)",
              y: hudLeftY,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_APPLE, delay: 0.1 }}
          >
            <div
              className="text-[10px] uppercase font-medium"
              style={{
                color: "#FFFFFF",
                letterSpacing: "0.32em",
              }}
            >
              {PRODUCT.scale} Scale
            </div>
            <div
              aria-hidden
              className="mt-2"
              style={{
                width: "24px",
                height: "1px",
                background: "rgba(255,255,255,0.3)",
              }}
            />
          </motion.div>

          <motion.div
            className="absolute right-5 z-30 flex flex-col items-end"
            style={{
              top: "calc(env(safe-area-inset-top, 0px) + 44px)",
              y: hudRightY,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_APPLE, delay: 0.15 }}
          >
            <div
              className="text-[10px] uppercase font-medium"
              style={{
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.32em",
              }}
            >
              Price
            </div>

            <button
              type="button"
              className="mt-1 cursor-pointer select-none outline-none"
              onMouseEnter={openPrice}
              onMouseLeave={schedulePriceClose}
              onFocus={openPrice}
              onBlur={schedulePriceClose}
              onClick={() => setPriceOpen((v) => !v)}
              aria-expanded={priceOpen}
              aria-controls="muscat-vault-capsule"
              aria-label={`Price ${formatNumber(PRODUCT.price)} Omani rial`}
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <div
                className="text-2xl font-medium tabular-nums"
                style={{
                  color: "#D5001C",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                }}
              >
                {formatNumber(PRODUCT.price)}{" "}
                <span
                  className="text-[11px] font-medium"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.18em",
                  }}
                >
                  OMR
                </span>
              </div>
            </button>

            <div
              id="muscat-vault-capsule"
              aria-live="polite"
              className="mt-2"
              style={{ minHeight: "26px" }}
            >
              <AnimatePresence>
                {priceOpen ? (
                  <motion.div
                    key="capsule"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 26,
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Truck className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    <span
                      className="text-[9px] uppercase font-medium"
                      style={{
                        color: "#FFFFFF",
                        letterSpacing: "0.36em",
                      }}
                    >
                      Muscat Vault to Your Door
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>

          <div
            className="relative z-10 mx-auto flex w-full items-center justify-center"
            style={{ paddingTop: "22vh" }}
          >
            <motion.div
              className="relative"
              style={{
                width: "88vw",
                maxWidth: 720,
                aspectRatio: "16 / 10",
                rotate: carRotate,
                scale: carScale,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE_APPLE, delay: 0.2 }}
            >
              <motion.div
                className="relative h-full w-full"
                animate={
                  reduced
                    ? undefined
                    : {
                        y: [-6, 6, -6],
                      }
                }
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 5,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                }
                onUpdate={(latest) => {
                  const y = (latest as { y?: number }).y;
                  if (typeof y === "number") floatY.set(y);
                }}
              >
                <AnimatePresence mode="sync">
                  {!xray ? (
                    <motion.div
                      key="photo"
                      className="absolute inset-0"
                      initial={{ opacity: reduced ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_APPLE }}
                    >
                      <Image
                        src={PRODUCT.image}
                        alt={`${PRODUCT.name} - ${PRODUCT.edition}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 88vw, 720px"
                        style={{
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0 30px 40px rgba(0,0,0,0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.35))",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="xray"
                      className="absolute inset-0"
                      initial={{ opacity: reduced ? 1 : 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_APPLE }}
                    >
                      <Image
                        src={PRODUCT.image}
                        alt={`${PRODUCT.name} schematic`}
                        fill
                        sizes="(max-width: 768px) 88vw, 720px"
                        style={{
                          objectFit: "contain",
                          filter:
                            "grayscale(1) contrast(1.7) invert(0.92) hue-rotate(195deg)",
                        }}
                      />
                      <svg
                        viewBox="0 0 100 62.5"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full"
                        aria-hidden
                      >
                        {XRAY_CALLOUTS.map((c, i) => (
                          <motion.g key={c.label}>
                            <motion.line
                              x1={c.x1 * 100}
                              y1={c.y1 * 62.5}
                              x2={c.x2 * 100}
                              y2={c.y2 * 62.5}
                              stroke="rgba(255,255,255,0.85)"
                              strokeWidth={0.18}
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{
                                duration: 0.6,
                                ease: EASE_APPLE,
                                delay: 0.1 + i * 0.08,
                              }}
                            />
                            <motion.circle
                              cx={c.x1 * 100}
                              cy={c.y1 * 62.5}
                              r={0.6}
                              fill="#D5001C"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                duration: 0.4,
                                ease: EASE_APPLE,
                                delay: 0.2 + i * 0.08,
                              }}
                            />
                            <motion.text
                              x={c.x2 * 100}
                              y={c.y2 * 62.5 - 1.2}
                              fill="rgba(255,255,255,0.95)"
                              fontSize={1.6}
                              fontFamily={FONT_SANS}
                              fontWeight={500}
                              letterSpacing="0.36em"
                              textAnchor={c.x2 > c.x1 ? "start" : "end"}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.4,
                                ease: EASE_APPLE,
                                delay: 0.45 + i * 0.08,
                              }}
                            >
                              {c.label}
                            </motion.text>
                          </motion.g>
                        ))}
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    left: "16%",
                    top: "44%",
                    width: "14%",
                    height: "22%",
                    background:
                      "radial-gradient(circle at center, rgba(255,240,200,0.85) 0%, rgba(255,240,200,0.35) 35%, transparent 70%)",
                    mixBlendMode: "screen",
                    filter: "blur(6px)",
                    opacity: reduced ? 1 : headlightOpacity,
                  }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    left: "26%",
                    top: "42%",
                    width: "12%",
                    height: "20%",
                    background:
                      "radial-gradient(circle at center, rgba(255,240,200,0.8) 0%, rgba(255,240,200,0.3) 35%, transparent 70%)",
                    mixBlendMode: "screen",
                    filter: "blur(6px)",
                    opacity: reduced ? 1 : headlightOpacity,
                  }}
                />

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    right: "10%",
                    top: "26%",
                    width: "18%",
                    height: "22%",
                    background:
                      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
                    mixBlendMode: "multiply",
                    filter: "blur(4px)",
                    y: spoilerY,
                    opacity: spoilerOpacity,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          <div
            className="absolute left-0 right-0 z-20 px-5"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
          >
            <motion.div
              className="mx-auto flex w-full max-w-xl items-stretch justify-between"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_APPLE, delay: 0.55 }}
            >
              <div className="flex-1 px-2 text-center">
                <div
                  className="text-[9px] uppercase font-medium"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.36em",
                  }}
                >
                  Year
                </div>
                <div
                  className="mt-1.5 text-base font-medium tabular-nums"
                  style={{ color: "#FFFFFF", letterSpacing: "-0.005em" }}
                >
                  {PRODUCT.year}
                </div>
              </div>

              <div
                aria-hidden
                className="self-center"
                style={{
                  width: "1px",
                  height: "32px",
                  background: "rgba(255,255,255,0.15)",
                }}
              />

              <div ref={weightRef} className="flex-1 px-2 text-center">
                <div
                  className="text-[9px] uppercase font-medium"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.36em",
                  }}
                >
                  Weight
                </div>
                <div
                  className="mt-1.5 text-base font-medium tabular-nums"
                  style={{ color: "#FFFFFF", letterSpacing: "-0.005em" }}
                >
                  {formatNumber(weightValue)}{" "}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "0.7em",
                      letterSpacing: "0.2em",
                    }}
                  >
                    G
                  </span>
                </div>
              </div>

              <div
                aria-hidden
                className="self-center"
                style={{
                  width: "1px",
                  height: "32px",
                  background: "rgba(255,255,255,0.15)",
                }}
              />

              <div className="flex-1 px-2 text-center">
                <div
                  className="text-[9px] uppercase font-medium"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.36em",
                  }}
                >
                  Brand
                </div>
                <div
                  className="mt-1.5 text-base font-medium"
                  style={{ color: "#FFFFFF", letterSpacing: "-0.005em" }}
                >
                  {PRODUCT.brand}
                </div>
              </div>
            </motion.div>
          </div>

          <div
            className="absolute left-0 right-0 z-20 flex flex-col items-center px-5"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
          >
            <motion.button
              type="button"
              className="group inline-flex items-center justify-center gap-2 rounded-full"
              style={{
                background: "#FFFFFF",
                color: "#0A0A0A",
                height: "48px",
                paddingLeft: "28px",
                paddingRight: "28px",
                minWidth: "44px",
                fontFamily: FONT_SANS,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_APPLE, delay: 0.7 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`See full details for ${PRODUCT.name}`}
            >
              <span
                className="text-[13px] font-medium"
                style={{ letterSpacing: "0.01em" }}
              >
                Full Details
              </span>
              <motion.span
                className="inline-flex"
                whileHover={{ x: 4 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </motion.span>
            </motion.button>

            <motion.div
              className="mt-4 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_APPLE, delay: 0.85 }}
            >
              <div
                aria-hidden
                style={{
                  width: "40px",
                  height: "1px",
                  background: "rgba(255,255,255,0.25)",
                }}
              />
              <div
                className="mt-3 text-[10px] uppercase font-medium"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.32em",
                }}
              >
                Edition {PRODUCT.edition_number} - Sealed
              </div>
            </motion.div>
          </div>

          <div
            className="fixed z-40 flex items-center gap-3"
            style={{
              right: "calc(env(safe-area-inset-right, 0px) + 24px)",
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
            }}
          >
            <AnimatePresence>
              {xrayTip && !xray ? (
                <motion.div
                  key="tip"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: EASE_APPLE }}
                  className="rounded-full px-3 py-1.5"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily:
                      "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
                  }}
                >
                  <span
                    className="text-[10px] uppercase font-medium"
                    style={{
                      color: "#FFFFFF",
                      letterSpacing: "0.32em",
                    }}
                  >
                    X-Ray
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setXray((v) => !v)}
              onMouseEnter={() => setXrayTip(true)}
              onMouseLeave={() => setXrayTip(false)}
              onFocus={() => setXrayTip(true)}
              onBlur={() => setXrayTip(false)}
              aria-label={xray ? "Switch to product photo" : "Switch to X-Ray view"}
              aria-pressed={xray}
              className="relative flex items-center justify-center rounded-full outline-none"
              style={{
                width: "56px",
                height: "56px",
                background: xray
                  ? "rgba(213, 0, 28, 0.16)"
                  : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: xray
                  ? "1.5px solid #D5001C"
                  : "1px solid rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                boxShadow: xray
                  ? "0 0 24px rgba(213, 0, 28, 0.35), 0 8px 24px rgba(0,0,0,0.4)"
                  : "0 8px 24px rgba(0,0,0,0.4)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {xray ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE_APPLE }}
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE_APPLE }}
                  >
                    <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <motion.div
            className="absolute left-0 right-0 z-10 text-center"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 168px)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_APPLE, delay: 0.45 }}
          >
            <div
              className="text-[10px] uppercase font-medium"
              style={{
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.36em",
              }}
            >
              {PRODUCT.edition}
            </div>
            <div
              className="mt-1.5 text-[15px] font-medium"
              style={{
                color: "#FFFFFF",
                letterSpacing: "0.02em",
              }}
            >
              {PRODUCT.name}
            </div>
          </motion.div>
        </section>

        <section
          className="relative w-full px-5 sm:px-8"
          style={{
            paddingTop: "12vh",
            paddingBottom: "16vh",
          }}
          aria-label="Provenance"
        >
          <div className="mx-auto w-full max-w-5xl">
            <motion.h2
              className="text-4xl sm:text-5xl"
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE_APPLE }}
            >
              Provenance.
            </motion.h2>

            <motion.div
              aria-hidden
              className="mt-6"
              style={{
                width: "48px",
                height: "1px",
                background: "rgba(255,255,255,0.25)",
                transformOrigin: "left center",
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE_APPLE, delay: 0.1 }}
            />

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
              {PROVENANCE.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_APPLE,
                    delay: 0.1 + i * 0.08,
                  }}
                >
                  <div
                    className="text-[10px] uppercase font-medium"
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "0.32em",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <h3
                    className="mt-3 text-lg font-medium"
                    style={{
                      color: "#FFFFFF",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-2 text-[14px]"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.6,
                      letterSpacing: "0.005em",
                    }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: EASE_APPLE }}
              >
                <div
                  className="text-[10px] uppercase font-medium"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.32em",
                  }}
                >
                  Details
                </div>
                <div
                  className="text-[10px] uppercase font-medium tabular-nums"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.32em",
                  }}
                >
                  04 - Frames
                </div>
              </motion.div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {DETAIL_CROPS.map((crop, i) => (
                  <motion.figure
                    key={crop.label}
                    className="group relative overflow-hidden rounded-lg"
                    style={{
                      aspectRatio: "1 / 1",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.7,
                      ease: EASE_APPLE,
                      delay: 0.05 + i * 0.08,
                    }}
                    whileHover={{ y: -4, scale: 1.03 }}
                  >
                    <Image
                      src={PRODUCT.image}
                      alt={`${PRODUCT.name} - ${crop.label}`}
                      fill
                      sizes="(max-width: 640px) 45vw, 22vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: crop.position,
                        filter: "brightness(0.95) contrast(1.05)",
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.55) 100%)",
                      }}
                    />
                    <figcaption
                      className="absolute bottom-2 left-2.5 text-[9px] uppercase font-medium"
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: "0.32em",
                      }}
                    >
                      {crop.label}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-20 flex flex-col items-center text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE_APPLE }}
            >
              <div
                aria-hidden
                style={{
                  width: "1px",
                  height: "48px",
                  background:
                    "linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
              <p
                className="mt-6 max-w-md"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.65,
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontSize: "16px",
                }}
              >
                Five hundred made. Forty-two yours, if you choose it.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
