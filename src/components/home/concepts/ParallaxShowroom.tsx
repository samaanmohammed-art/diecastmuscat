"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&q=80";
const BG =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&q=60";

export function ParallaxShowroom() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const textInView = useInView(textRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background moves slower (appears further)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  // Car subtle upward drift (feels closest)
  const carY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  return (
    <div
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-bg flex items-center"
    >
      {/* Background layer — slowest parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src={BG}
          alt=""
          fill
          className="object-cover opacity-20"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/60" />
      </motion.div>

      {/* Shelf line */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ bottom: "35%" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      </div>

      {/* Car — foreground (least parallax) */}
      <motion.div
        style={{ y: carY, bottom: "33%", left: "5%", width: "min(55%, 650px)" }}
        className="absolute pointer-events-none"
      >
        <Image
          src={CAR}
          alt="Die-cast model"
          width={650}
          height={380}
          className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
        />
        {/* Shadow puddle */}
        <div className="absolute -bottom-2 left-[15%] right-[15%] h-5 bg-black/50 blur-xl rounded-full" />
      </motion.div>

      {/* Store name — slides in via useInView */}
      <div
        ref={textRef}
        className="absolute right-[5%] sm:right-[8%] text-right"
        style={{ bottom: "40%" }}
      >
        <motion.p
          initial={{ opacity: 0, x: 40 }}
          animate={textInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-gold mb-3"
        >
          Muscat · Sultanate of Oman
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          animate={textInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display tracking-tight leading-[0.92]"
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
        >
          <span className="block text-text">Diecast</span>
          <span className="block text-gradient-gold italic">Muscat</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: 40 }}
          animate={textInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-sm text-text-muted max-w-[280px] ml-auto leading-relaxed"
        >
          Authenticated die-cast collectibles, hand-delivered across Oman.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={textInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex justify-end"
        >
          <Link
            href="/products"
            className="inline-flex h-11 items-center gap-2 px-7 rounded-full bg-gold text-bg text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors"
          >
            Explore
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </div>
  );
}
