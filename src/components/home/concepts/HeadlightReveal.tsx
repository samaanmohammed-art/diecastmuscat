"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&q=80";

// Fixed particle positions — no Math.random() at render time
const PARTICLES = [
  { id: 0, x: 8,  d: 0,    dur: 2.5, s: 1.5 },
  { id: 1, x: 18, d: 0.4,  dur: 3.0, s: 1.0 },
  { id: 2, x: 28, d: 0.8,  dur: 2.2, s: 2.0 },
  { id: 3, x: 38, d: 0.2,  dur: 3.5, s: 1.0 },
  { id: 4, x: 48, d: 0.6,  dur: 2.8, s: 1.5 },
  { id: 5, x: 58, d: 1.0,  dur: 2.4, s: 1.0 },
  { id: 6, x: 68, d: 0.3,  dur: 3.2, s: 2.0 },
  { id: 7, x: 78, d: 0.7,  dur: 2.6, s: 1.5 },
  { id: 8, x: 88, d: 1.1,  dur: 2.0, s: 1.0 },
  { id: 9, x: 13, d: 0.5,  dur: 3.8, s: 1.5 },
  { id: 10, x: 43, d: 0.9, dur: 2.3, s: 2.0 },
  { id: 11, x: 73, d: 1.3, dur: 3.0, s: 1.0 },
];

const LETTER_VARIANT = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.28, ease: "easeOut" as const } },
} as const;

export function HeadlightReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  const carCtrl     = useAnimation();
  const hlCtrl      = useAnimation(); // headlight dots
  const beamCtrl    = useAnimation(); // light shafts
  const floorCtrl   = useAnimation(); // floor glow
  const dustCtrl    = useAnimation(); // beam particles
  const titleCtrl   = useAnimation(); // letter reveal
  const ctaCtrl     = useAnimation();

  useEffect(() => {
    if (!inView) return;
    void (async () => {
      // 1 — car rolls in (barely visible silhouette → full brightness)
      await carCtrl.start({
        x: 0,
        opacity: 0.9,
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
      });
      // settle overshoot
      await carCtrl.start({ x: 10, transition: { duration: 0.08 } });
      await carCtrl.start({ x: 0, opacity: 1, transition: { duration: 0.28, ease: "easeOut" } });

      await new Promise<void>((r) => setTimeout(r, 280));

      // 2 — headlights snap on
      await hlCtrl.start({ opacity: 1, scale: 1, transition: { duration: 0.07 } });

      // 3 — beams sweep right + floor glow + dust simultaneously
      beamCtrl.start({ scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: [0.2, 0, 0.6, 1] } });
      floorCtrl.start({ opacity: 1, transition: { duration: 0.5 } });
      dustCtrl.start({ opacity: 1, transition: { duration: 0.4 } });

      await new Promise<void>((r) => setTimeout(r, 200));

      // 4 — store name reveals letter by letter
      titleCtrl.start("visible");

      await new Promise<void>((r) => setTimeout(r, 700));

      // 5 — CTA
      ctaCtrl.start({ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } });
    })();
  }, [inView, carCtrl, hlCtrl, beamCtrl, floorCtrl, dustCtrl, titleCtrl, ctaCtrl]);

  return (
    <div ref={ref} className="relative h-screen bg-black overflow-hidden select-none">
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-faint opacity-10 pointer-events-none" />
      <div
        className="absolute inset-y-0 left-0 w-[28%] pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(10,10,10,0.92), transparent)" }}
      />

      {/* Shelf */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ top: "60%" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.6)] to-[rgba(212,175,55,0.08)]" />
        <div className="h-px mt-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent" />
      </div>

      {/* Car — bottom edge aligned to shelf (bottom: 40% = shelf top: 60%) */}
      <motion.div
        animate={carCtrl}
        initial={{ x: "-120vw", opacity: 0.15 }}
        className="absolute pointer-events-none"
        style={{ bottom: "40%", left: "5%", width: "min(50%, 580px)" }}
      >
        <Image
          src={CAR}
          alt="Die-cast model"
          width={580}
          height={330}
          priority
          className="object-contain"
          style={{
            transform: "scaleX(-1)",
            filter: "drop-shadow(0 30px 80px rgba(0,0,0,0.98)) drop-shadow(0 0 40px rgba(212,175,55,0.08))",
          }}
        />
      </motion.div>

      {/* Headlight dots — at car front (right side, roughly 58% from top) */}
      <motion.div
        animate={hlCtrl}
        initial={{ opacity: 0, scale: 0 }}
        className="absolute flex flex-col gap-2 pointer-events-none"
        style={{ top: "57%", left: "49%" }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_16px_6px_rgba(255,255,255,0.85),0_0_40px_12px_rgba(212,175,55,0.3)]" />
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_16px_6px_rgba(255,255,255,0.85),0_0_40px_12px_rgba(212,175,55,0.3)]" />
      </motion.div>

      {/* Headlight beams */}
      <motion.div
        animate={beamCtrl}
        initial={{ scaleX: 0, opacity: 0 }}
        className="absolute pointer-events-none"
        style={{
          top: "37%",
          left: "48%",
          width: "55vw",
          height: "46vh",
          transformOrigin: "0% 55%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from -12deg at 0% 55%, rgba(212,175,55,0.25) 0deg, transparent 28deg)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from -5deg at 2% 68%, rgba(255,250,210,0.18) 0deg, transparent 22deg)",
            filter: "blur(28px)",
          }}
        />
        {/* Bright central ray */}
        <div
          className="absolute"
          style={{
            top: "48%",
            left: 0,
            width: "70%",
            height: "2px",
            background: "linear-gradient(to right, rgba(255,255,255,0.4), transparent)",
            filter: "blur(3px)",
          }}
        />

        {/* Beam dust particles */}
        <motion.div animate={dustCtrl} initial={{ opacity: 0 }} className="absolute inset-0">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.s,
                height: p.s,
                left: `${p.x}%`,
                top: "52%",
                backgroundColor: "rgba(212,175,55,0.55)",
              }}
              animate={{ y: [0, -35, -70], opacity: [0, 0.9, 0] }}
              transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Floor glow beneath shelf */}
      <motion.div
        animate={floorCtrl}
        initial={{ opacity: 0 }}
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: "60%",
          height: "18vh",
          background:
            "radial-gradient(75% 80px at 58% 0%, rgba(212,175,55,0.14), transparent)",
        }}
      />

      {/* Store name — right side, above shelf */}
      <div
        className="absolute right-[5%] sm:right-[7%] text-right pointer-events-none"
        style={{ bottom: "42%" }}
      >
        <motion.p
          animate={titleCtrl}
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5 } },
          }}
          initial="hidden"
          className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2"
        >
          House of Crafts · Muscat, Oman
        </motion.p>

        {/* "Diecast" — clip-path letter reveal */}
        <motion.div
          animate={titleCtrl}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          className="flex justify-end overflow-hidden"
        >
          {"Diecast".split("").map((ch, i) => (
            <motion.span
              key={i}
              variants={LETTER_VARIANT}
              className="font-display text-text"
              style={{
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                lineHeight: 1,
                display: "inline-block",
                whiteSpace: "pre",
                textShadow: "0 0 80px rgba(212,175,55,0.4)",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>

        {/* "Muscat" — gold italic, slight delay */}
        <motion.div
          animate={titleCtrl}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }}
          initial="hidden"
          className="flex justify-end overflow-hidden"
        >
          {"Muscat".split("").map((ch, i) => (
            <motion.span
              key={i}
              variants={LETTER_VARIANT}
              className="font-display italic text-gradient-gold"
              style={{
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                lineHeight: 1,
                display: "inline-block",
                whiteSpace: "pre",
                textShadow: "0 0 100px rgba(212,175,55,0.6)",
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        animate={ctaCtrl}
        initial={{ opacity: 0, y: 10 }}
        className="absolute right-[5%] sm:right-[7%]"
        style={{ bottom: "28%" }}
      >
        <Link
          href="/products"
          className="inline-flex h-11 items-center gap-2 px-7 rounded-full bg-gold text-bg text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_8px_40px_-8px_rgba(212,175,55,0.9)]"
        >
          Shop Now
        </Link>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </div>
  );
}
