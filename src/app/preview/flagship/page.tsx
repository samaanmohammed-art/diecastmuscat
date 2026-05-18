"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Smartphone, MousePointer2 } from "lucide-react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const PAINTS = [
  { name: "Racing Red", hex: "#B81D24" },
  { name: "Gulf Blue", hex: "#2E6F9E" },
  { name: "Racing Green", hex: "#1E3A2A" },
  { name: "Obsidian", hex: "#16171B" },
  { name: "Brushed Silver", hex: "#C9CBCE" },
  { name: "Signal Yellow", hex: "#E6B017" },
];

/* ---------- scroll-driven caption ---------- */

function Caption({
  progress,
  range,
  index,
  title,
  body,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  index: string;
  title: string;
  body: string;
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [28, 0, 0, -28]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-[16%] px-6 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <p
          className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em]"
          style={{ color: "#9A5B2E" }}
        >
          {index}
        </p>
        <h2
          className="max-w-md text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "#1A1916" }}
        >
          {title}
        </h2>
        <p
          className="mt-4 max-w-sm text-sm leading-relaxed sm:text-base"
          style={{ color: "#5F5C55" }}
        >
          {body}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- animated counter ---------- */

function CountUp({ to, active }: { to: number; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);
  return <>{n.toLocaleString()}</>;
}

/* ---------- WebGL-less fallback ---------- */

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="relative mx-auto mb-8 aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
            alt="Collector-grade scale model car"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 90vw, 400px"
          />
        </div>
        <h1
          className="text-3xl font-medium tracking-tight"
          style={{ color: "#1A1916" }}
        >
          Life-size desire. Palm-size craft.
        </h1>
        <p className="mt-3 text-sm" style={{ color: "#5F5C55" }}>
          A curated vault of collector-grade scale models.
        </p>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function FlagshipPage() {
  const reduced = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState(PAINTS[0].hex);
  const [showConfig, setShowConfig] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [isTouch, setIsTouch] = useState(false);
  const [gyro, setGyro] = useState<"idle" | "on" | "denied">("idle");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
    const next = v > 0.8;
    setShowConfig((prev) => (prev === next ? prev : next));
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.07, 0.12], [1, 1, 0]);
  const hintOpacity = useTransform(
    scrollYProgress,
    [0, 0.02, 0.12, 0.16],
    [0, 1, 1, 0],
  );
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03, 0.06], [1, 1, 0]);

  /* environment checks — deferred out of the effect body */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const c = document.createElement("canvas");
        setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
      } catch {
        setWebgl(false);
      }
      setIsTouch(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* desktop pointer → light + rotation */
  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch]);

  /* gyroscope handler */
  const handleOrient = useCallback((e: DeviceOrientationEvent) => {
    const gamma = e.gamma ?? 0;
    const beta = e.beta ?? 0;
    pointerRef.current = {
      x: clamp(gamma / 40, -1, 1) * 0.5,
      y: clamp((beta - 45) / 40, -1, 1) * 0.5,
    };
  }, []);

  const enableGyro = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<"granted" | "denied"> }
      | undefined;
    try {
      if (DOE && typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setGyro("denied");
          return;
        }
      }
      window.addEventListener("deviceorientation", handleOrient);
      setGyro("on");
    } catch {
      setGyro("denied");
    }
  }, [handleOrient]);

  useEffect(() => {
    return () => window.removeEventListener("deviceorientation", handleOrient);
  }, [handleOrient]);

  return (
    <main
      className="relative w-full"
      style={{
        background:
          "radial-gradient(125% 90% at 50% 22%, #FCFBF9 0%, #ECEAE4 55%, #DBD8D0 100%)",
      }}
    >
      {/* hide the global gold chrome */}
      <style>{`header, footer, nav[aria-label="Primary"] { display: none !important; }`}</style>

      {/* 3D layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {webgl ? (
          <Scene
            scrollRef={scrollRef}
            pointerRef={pointerRef}
            color={color}
            reduced={reduced}
          />
        ) : (
          <StaticFallback />
        )}
      </div>

      {/* overlay UI layer */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {/* header */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#1A1916" }}
          >
            Diecast Muscat
          </span>
          <span
            className="hidden text-[10px] uppercase tracking-[0.34em] sm:block"
            style={{ color: "#9A5B2E" }}
          >
            House of Crafts
          </span>
        </div>

        {/* hero text */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-x-0 top-[20%] px-6 sm:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-6xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.7 }}
              className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em]"
              style={{ color: "#9A5B2E" }}
            >
              The Vault — Collector-Grade Models
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.55, duration: 0.8 }}
              className="text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "#1A1916" }}
            >
              Life-size desire.
              <br />
              Palm-size craft.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.8 }}
              className="mt-5 max-w-sm text-sm leading-relaxed sm:text-base"
              style={{ color: "#5F5C55" }}
            >
              A curated vault of die-cast scale models. Turn, tilt, and inspect
              each one — as if it were resting in your hand.
            </motion.p>
          </div>
        </motion.div>

        {/* tilt / cursor hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 bottom-[26%] flex justify-center px-6"
        >
          {isTouch ? (
            gyro === "on" ? (
              <span
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
                style={{ color: "#5F5C55" }}
              >
                <Smartphone className="h-3.5 w-3.5" /> Tilt your phone
              </span>
            ) : (
              <button
                type="button"
                onClick={enableGyro}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors"
                style={{ background: "#1A1916", color: "#FBFAF8" }}
              >
                <Smartphone className="h-4 w-4" />
                {gyro === "denied" ? "Drag to turn the model" : "Tap to hold the model"}
              </button>
            )
          ) : (
            <span
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
              style={{ color: "#5F5C55" }}
            >
              <MousePointer2 className="h-3.5 w-3.5" /> Move your cursor — the
              light follows
            </span>
          )}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] uppercase tracking-[0.34em]"
            style={{ color: "#8A867D" }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px"
            style={{ background: "#B5B1A6" }}
          />
        </motion.div>

        {/* scroll captions */}
        <Caption
          progress={scrollYProgress}
          range={[0.18, 0.25, 0.31, 0.37]}
          index="01 — Craft"
          title="Wheels, turned by hand."
          body="Photo-etched brake discs, rubber-compound tyres, every spoke set true to scale."
        />
        <Caption
          progress={scrollYProgress}
          range={[0.4, 0.47, 0.52, 0.58]}
          index="02 — Form"
          title="Bodywork, sculpted in scale."
          body="Hand-laid metallic paint over a die-cast metal shell. Panel gaps you could measure."
        />
        <Caption
          progress={scrollYProgress}
          range={[0.6, 0.66, 0.71, 0.77]}
          index="03 — Provenance"
          title="Sealed cabin. Numbered chassis."
          body="A stitched interior behind real glass — each model numbered, certified, and verified."
        />

        {/* configurator */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 36 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute inset-x-0 bottom-0 lg:inset-x-auto lg:right-10 lg:top-1/2 lg:bottom-auto lg:w-[370px] lg:-translate-y-1/2"
            >
              <div
                className="rounded-t-3xl border px-6 pb-9 pt-7 sm:px-8 lg:rounded-3xl"
                style={{
                  background: "rgba(252,251,249,0.86)",
                  borderColor: "rgba(26,25,22,0.08)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 30px 70px -28px rgba(26,25,22,0.32)",
                }}
              >
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.36em]"
                  style={{ color: "#9A5B2E" }}
                >
                  Configure
                </p>
                <h3
                  className="mt-2 text-2xl font-medium tracking-tight"
                  style={{ color: "#1A1916" }}
                >
                  Apex GT · Coupé
                </h3>
                <p className="mt-1 text-xs" style={{ color: "#8A867D" }}>
                  1:18 Scale — Die-cast metal
                </p>

                {/* spec row */}
                <div
                  className="mt-5 flex items-stretch gap-4 border-y py-3.5"
                  style={{ borderColor: "rgba(26,25,22,0.1)" }}
                >
                  {[
                    { l: "Weight", v: <CountUp to={1840} active={showConfig} />, s: "g" },
                    { l: "Edition", v: "0042", s: "/ 500" },
                    { l: "Year", v: "2024", s: "" },
                  ].map((c, i) => (
                    <div
                      key={c.l}
                      className="flex-1"
                      style={
                        i < 2
                          ? {
                              borderRight: "1px solid rgba(26,25,22,0.1)",
                              paddingRight: "1rem",
                            }
                          : undefined
                      }
                    >
                      <p
                        className="text-[9px] uppercase tracking-[0.3em]"
                        style={{ color: "#8A867D" }}
                      >
                        {c.l}
                      </p>
                      <p
                        className="mt-1 text-sm font-medium tabular-nums"
                        style={{ color: "#1A1916" }}
                      >
                        {c.v}
                        {c.s && (
                          <span style={{ color: "#8A867D" }}> {c.s}</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* paint swatches */}
                <p
                  className="mt-5 text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "#8A867D" }}
                >
                  Paint —{" "}
                  <span style={{ color: "#1A1916" }}>
                    {PAINTS.find((p) => p.hex === color)?.name}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {PAINTS.map((p) => {
                    const active = p.hex === color;
                    return (
                      <button
                        key={p.hex}
                        type="button"
                        aria-label={p.name}
                        aria-pressed={active}
                        onClick={() => setColor(p.hex)}
                        className="h-9 w-9 rounded-full transition-transform"
                        style={{
                          background: p.hex,
                          outline: active
                            ? "2px solid #1A1916"
                            : "1px solid rgba(26,25,22,0.15)",
                          outlineOffset: "2px",
                          transform: active ? "scale(1.08)" : "scale(1)",
                        }}
                      />
                    );
                  })}
                </div>

                {/* price + CTA */}
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: "#8A867D" }}
                    >
                      Price
                    </p>
                    <p
                      className="text-xl font-medium tabular-nums"
                      style={{ color: "#1A1916" }}
                    >
                      OMR 165.000
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
                  style={{ background: color, color: "#FBFAF8" }}
                >
                  Add to Collection
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="mt-2.5 w-full rounded-full border py-3 text-xs font-medium uppercase tracking-[0.2em]"
                  style={{
                    borderColor: "rgba(26,25,22,0.18)",
                    color: "#1A1916",
                  }}
                >
                  Browse the Vault
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* scroll driver — its height defines the journey length */}
      <div ref={containerRef} aria-hidden style={{ height: "520vh" }} />
    </main>
  );
}
