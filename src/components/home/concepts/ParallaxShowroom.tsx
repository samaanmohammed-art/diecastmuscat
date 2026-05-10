"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&q=80";
const BG =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&q=60";

const SPRING_CFG = { stiffness: 80, damping: 20 };

export function ParallaxShowroom() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  // Layer 1 — background (slowest = furthest)
  const bgX = useSpring(useTransform(rawX, [-1, 1], [-18, 18]), SPRING_CFG);
  const bgY = useSpring(useTransform(rawY, [-1, 1], [-12, 12]), SPRING_CFG);

  // Layer 2 — atmosphere glow (mid depth)
  const midX = useSpring(useTransform(rawX, [-1, 1], [-10, 10]), SPRING_CFG);
  const midY = useSpring(useTransform(rawY, [-1, 1], [-7,   7]), SPRING_CFG);

  // Layer 3 — car (barely moves — feels in-focus / closest)
  const carPX = useSpring(useTransform(rawX, [-1, 1], [-6, 6]), SPRING_CFG);
  const carPY = useSpring(useTransform(rawY, [-1, 1], [-4, 4]), SPRING_CFG);

  // Layer 4 — text moves OPPOSITE to car, sells depth separation
  const txtX = useSpring(useTransform(rawX, [-1, 1], [14, -14]), SPRING_CFG);
  const txtY = useSpring(useTransform(rawY, [-1, 1], [ 9,  -9]), SPRING_CFG);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden bg-bg">
      {/* ── Layer 1: Background ── */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 scale-[1.12] pointer-events-none"
      >
        <Image src={BG} alt="" fill className="object-cover opacity-[0.22]" aria-hidden />
      </motion.div>

      {/* Static vignette overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.35) 38%, transparent 68%)",
            "linear-gradient(to left,  rgba(10,10,10,0.5) 0%, transparent 40%)",
            "linear-gradient(to top,   rgba(10,10,10,0.8) 0%, transparent 32%)",
          ].join(", "),
        }}
      />

      {/* ── Layer 2: Atmosphere glow ── */}
      <motion.div
        style={{
          x: midX,
          y: midY,
          bottom: "28%",
          left: "5%",
          width: "55%",
          height: "42vh",
          background:
            "radial-gradient(55% 60% at 50% 80%, rgba(212,175,55,0.13), transparent)",
        }}
        className="absolute pointer-events-none"
      />

      {/* Shelf */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ bottom: "35%" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.38)] to-transparent" />
      </div>

      {/* ── Layer 3: Car — entry wrapper (opacity + initial y slide) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="absolute pointer-events-none"
        style={{ bottom: "35%", left: "7%", width: "min(50%, 620px)" }}
      >
        {/* Parallax inner (x/y motion values separate from entry animation) */}
        <motion.div style={{ x: carPX, y: carPY }}>
        {/* Ambient float */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={CAR}
            alt="Die-cast model"
            width={620}
            height={360}
            className="object-contain"
            style={{
              filter:
                "drop-shadow(0 28px 70px rgba(0,0,0,0.92)) drop-shadow(0 0 50px rgba(212,175,55,0.07))",
            }}
          />
        </motion.div>

        {/* Floor reflection */}
        <div
          className="absolute left-0 right-0 overflow-hidden pointer-events-none"
          style={{ top: "97%", height: 55 }}
        >
          <Image
            src={CAR}
            alt=""
            width={620}
            height={360}
            className="object-contain opacity-[0.07]"
            style={{ transform: "scaleY(-1)", filter: "blur(3px)" }}
            aria-hidden
          />
        </div>
        </motion.div> {/* closes parallax inner */}
      </motion.div> {/* closes entry wrapper */}

      {/* ── Layer 4: Store name (moves opposite) ── */}
      <motion.div
        style={{ x: txtX, y: txtY, bottom: "40%", right: "6%" }}
        className="absolute text-right"
      >
        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3"
        >
          Muscat · Sultanate of Oman
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display tracking-tight leading-[0.9]"
          style={{ fontSize: "clamp(3rem, 6.5vw, 5.8rem)" }}
        >
          <span className="block text-text">Diecast</span>
          <span className="block text-gradient-gold italic">Muscat</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-sm text-text-muted max-w-[260px] ml-auto leading-relaxed"
        >
          Authenticated die-cast collectibles, hand-delivered across Oman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex justify-end"
        >
          <Link
            href="/products"
            className="inline-flex h-11 items-center gap-2 px-7 rounded-full bg-gold text-bg text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_6px_30px_-6px_rgba(212,175,55,0.7)]"
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      <p className="absolute bottom-6 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-text-dim pointer-events-none">
        Move your mouse · feel the depth
      </p>
    </div>
  );
}
