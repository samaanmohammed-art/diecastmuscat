"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useAnimationFrame,
} from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&q=80";

// Pre-computed scatter targets per letter (no Math.random at render)
const SCATTER: { x: number; y: number; r: number }[] = [
  { x: -18, y: -32, r: -12 }, // D
  { x:   8, y: -28, r:  15 }, // I
  { x: -22, y: -15, r:  -8 }, // E
  { x:  15, y: -35, r:  20 }, // C
  { x: -10, y: -22, r: -18 }, // A
  { x:  20, y: -18, r:  10 }, // S
  { x: -15, y: -30, r: -22 }, // T
  { x:   0, y:   0, r:   0 }, // space
  { x:  18, y: -26, r:  16 }, // M
  { x: -20, y: -33, r: -14 }, // U
  { x:  12, y: -20, r:  18 }, // S
  { x:  -8, y: -28, r: -10 }, // C
  { x:  22, y: -15, r: -20 }, // A
  { x: -12, y: -35, r:  12 }, // T
];

const TITLE = "DIECAST MUSCAT";

type Phase = "idle" | "scattered" | "settling";

function ScatterLetter({
  char,
  index,
  phase,
}: {
  char: string;
  index: number;
  phase: Phase;
}) {
  const s = SCATTER[index] ?? { x: 0, y: 0, r: 0 };
  return (
    <motion.span
      animate={
        phase === "scattered"
          ? { x: s.x, y: s.y, rotate: s.r, opacity: 0.6 }
          : { x: 0, y: 0, rotate: 0, opacity: 1 }
      }
      transition={
        phase === "scattered"
          ? { duration: 0.12, ease: "easeOut" }
          : {
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.025,
            }
      }
      className="font-display text-3xl sm:text-5xl lg:text-[4.2rem] text-text leading-none"
      style={{ display: "inline-block", whiteSpace: "pre" }}
    >
      {char}
    </motion.span>
  );
}

export function MomentumScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const collisionRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Car position
  const carX = useTransform(scrollYProgress, [0, 0.52], ["-90vw", "0vw"]);

  // Velocity chain
  const rawVel   = useVelocity(scrollYProgress);
  const smoothVel = useSpring(rawVel, { stiffness: 500, damping: 50 });

  // Absolute velocity (both scroll directions cause effects)
  const absVel = useTransform(smoothVel, (v) => Math.abs(v));

  // Blur when fast
  const blurPx    = useTransform(absVel, [0, 0.35], [0, 12]);
  const blurStyle = useTransform(blurPx, (v) => `blur(${v}px)`);

  // Chassis pitch — forward lean when scrolling
  const chassisTilt = useTransform(smoothVel, [-0.3, 0, 0.3], [3, 0, 3]);

  // Speed line opacity + width
  const sl0Opacity = useTransform(absVel, [0, 0.2], [0, 0.70]);
  const sl1Opacity = useTransform(absVel, [0, 0.2], [0, 0.55]);
  const sl2Opacity = useTransform(absVel, [0, 0.2], [0, 0.38]);
  const sl3Opacity = useTransform(absVel, [0, 0.2], [0, 0.22]);
  const slWidth    = useTransform(absVel, [0, 0.35], ["0%", "11%"]);

  // Wheel rotation
  const wheelRot = useMotionValue(0);
  useAnimationFrame(() => {
    wheelRot.set(wheelRot.get() + smoothVel.get() * 320);
  });

  // CTA + glow after car arrives
  const ctaOpacity = useTransform(scrollYProgress, [0.54, 0.70], [0, 1]);
  const ctaY       = useTransform(scrollYProgress, [0.54, 0.70], [10, 0]);
  const glowOp     = useTransform(scrollYProgress, [0.48, 0.56], [0, 0.6]);
  const hintOp     = useTransform(scrollYProgress, [0,    0.06], [1, 0]);

  // Collision → scatter → reform
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.50 && v <= 0.54 && !collisionRef.current) {
      collisionRef.current = true;
      setPhase("scattered");
      setTimeout(() => setPhase("settling"), 140);
      setTimeout(() => {
        setPhase("idle");
        collisionRef.current = false;
      }, 900);
    }
  });

  const slOpacities = [sl0Opacity, sl1Opacity, sl2Opacity, sl3Opacity];

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-bg">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-noise opacity-35 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-faint opacity-[0.28] pointer-events-none" />

        {/* Shelf */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: "58%" }}>
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.5)] to-transparent" />
          <div className="mt-px h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.14)] to-transparent" />
        </div>

        {/* Ambient glow when car arrives */}
        <motion.div
          style={{
            opacity: glowOp,
            bottom: "40%",
            left: "0%",
            width: "55%",
            height: "30vh",
            background: "radial-gradient(60% 120px at 50% 80%, rgba(212,175,55,0.2), transparent)",
          }}
          className="absolute pointer-events-none"
        />

        {/* Speed lines — left of car */}
        <div
          className="absolute pointer-events-none flex flex-col gap-2.5 items-end"
          style={{ bottom: "46%", right: "55%" }}
        >
          {slOpacities.map((op, i) => (
            <motion.div
              key={i}
              style={{ opacity: op, width: slWidth }}
              className="h-px bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.7)]"
            />
          ))}
        </div>

        {/* Store name */}
        <div
          className="absolute right-[5%] sm:right-[8%] flex flex-col items-end"
          style={{ bottom: "44%" }}
        >
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.38em] text-gold mb-3">
            Premium die-cast · Oman
          </p>
          <div className="flex flex-wrap justify-end gap-y-0">
            {TITLE.split("").map((ch, i) => (
              <ScatterLetter key={i} char={ch} index={i} phase={phase} />
            ))}
          </div>
        </div>

        {/* Rolling car — bottom aligned to shelf */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: "42%", left: "4vw" }}
        >
          <motion.div
            style={{ x: carX, rotate: chassisTilt, filter: blurStyle }}
            className="w-[42vw] sm:w-[36vw] max-w-[520px] relative"
          >
            <Image
              src={CAR}
              alt="Die-cast model car"
              width={520}
              height={300}
              className="object-contain"
              style={{
                transform: "scaleX(-1)",
                filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.85))",
              }}
            />

            {/* Wheel indicators — front & rear */}
            <div className="absolute bottom-1 flex justify-between px-[8%] w-full pointer-events-none">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  style={{ rotate: wheelRot }}
                  className="w-7 h-7 rounded-full border-2 border-[rgba(212,175,55,0.35)] border-t-[rgba(212,175,55,0.8)]"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 px-8 rounded-full bg-gold text-bg text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_10px_40px_-10px_rgba(212,175,55,0.8)]"
          >
            Browse Collection
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          style={{ opacity: hintOp }}
          className="absolute bottom-8 inset-x-0 text-center text-[10px] uppercase tracking-[0.32em] text-text-dim pointer-events-none"
        >
          Scroll to reveal
        </motion.p>
      </div>
    </div>
  );
}
