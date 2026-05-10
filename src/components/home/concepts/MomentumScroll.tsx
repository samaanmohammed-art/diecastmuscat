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
  useMotionValueEvent,
} from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&q=80";

const TITLE = "DIECAST MUSCAT";

function BounceLetter({
  char,
  bounceKey,
  delay,
}: {
  char: string;
  bounceKey: number;
  delay: number;
}) {
  return (
    <motion.span
      key={bounceKey}
      initial={{ y: 0 }}
      animate={{ y: bounceKey > 0 ? [-14, 4, -5, 1, 0] : 0 }}
      transition={{ duration: 0.52, delay, ease: "easeOut" }}
      className="font-display text-3xl sm:text-5xl lg:text-[4.5rem] text-text leading-none"
      style={{ display: "inline-block", whiteSpace: "pre" }}
    >
      {char}
    </motion.span>
  );
}

export function MomentumScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounceKey, setBounceKey] = useState(0);
  const bouncingRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const carX = useTransform(scrollYProgress, [0, 0.55], ["-85vw", "0vw"]);

  const rawVel = useVelocity(scrollYProgress);
  const smoothVel = useSpring(rawVel, { stiffness: 500, damping: 50 });
  const blurPx = useTransform(smoothVel, [-0.4, 0, 0.4], [10, 0, 10]);
  const blurStyle = useTransform(blurPx, (v) => `blur(${v}px)`);
  const chassisY = useTransform(smoothVel, [-0.25, 0, 0.25], [-4, 0, -4]);

  const ctaOpacity = useTransform(scrollYProgress, [0.56, 0.72], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.56, 0.72], [10, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.52 && v <= 0.58 && !bouncingRef.current) {
      bouncingRef.current = true;
      setBounceKey((k) => k + 1);
      setTimeout(() => {
        bouncingRef.current = false;
      }, 900);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-bg">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-grid-faint opacity-25 pointer-events-none" />
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "58%",
            height: "200px",
            background:
              "radial-gradient(60% 100px at 50% 0%, rgba(212,175,55,0.06), transparent)",
          }}
        />

        {/* Shelf */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{ top: "58%" }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="mt-px h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        </div>

        {/* Store name */}
        <div
          className="absolute right-[5%] sm:right-[8%] flex flex-col items-end"
          style={{ bottom: "44%" }}
        >
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.36em] text-gold mb-3">
            Premium die-cast · Oman
          </p>
          <div className="flex flex-wrap justify-end">
            {TITLE.split("").map((char, i) => (
              <BounceLetter
                key={i}
                char={char}
                bounceKey={bounceKey}
                delay={i * 0.022}
              />
            ))}
          </div>
        </div>

        {/* Rolling car */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: "42%", left: "4vw" }}
        >
          <motion.div
            style={{ x: carX, y: chassisY, filter: blurStyle }}
            className="w-[44vw] sm:w-[38vw] max-w-[520px]"
          >
            <Image
              src={CAR}
              alt="Die-cast model car"
              width={520}
              height={300}
              className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              style={{ transform: "scaleX(-1)" }}
            />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 px-8 rounded-full bg-gold text-bg text-xs uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_10px_40px_-10px_rgba(212,175,55,0.7)]"
          >
            Browse Collection
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 inset-x-0 text-center text-[10px] uppercase tracking-[0.3em] text-text-dim pointer-events-none"
        >
          Scroll to reveal
        </motion.p>
      </div>
    </div>
  );
}
