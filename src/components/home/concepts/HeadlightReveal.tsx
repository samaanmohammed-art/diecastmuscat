"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";

const CAR =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&q=80";

export function HeadlightReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  const carCtrl = useAnimation();
  const beamCtrl = useAnimation();
  const titleCtrl = useAnimation();
  const ctaCtrl = useAnimation();

  useEffect(() => {
    if (!inView) return;
    void (async () => {
      await carCtrl.start({
        x: 0,
        transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
      });
      await new Promise<void>((r) => setTimeout(r, 180));
      await beamCtrl.start({
        opacity: 1,
        scaleX: 1,
        transition: { duration: 0.14 },
      });
      void titleCtrl.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      });
      await new Promise<void>((r) => setTimeout(r, 280));
      void ctaCtrl.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      });
    })();
  }, [inView, carCtrl, beamCtrl, titleCtrl, ctaCtrl]);

  return (
    <div ref={ref} className="relative h-screen bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint opacity-20 pointer-events-none" />

      {/* Shelf */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{ bottom: "32%" }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="h-20 bg-gradient-to-b from-gold/5 to-transparent" />
      </div>

      {/* Car */}
      <motion.div
        animate={carCtrl}
        initial={{ x: "-110vw" }}
        className="absolute pointer-events-none"
        style={{ bottom: "30%", left: "4%", width: "min(52%, 600px)" }}
      >
        <Image
          src={CAR}
          alt="Die-cast model"
          width={600}
          height={340}
          priority
          className="object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
          style={{ transform: "scaleX(-1)" }}
        />
        <div className="absolute -bottom-3 left-[20%] right-[20%] h-6 bg-gold/8 blur-xl rounded-full" />
      </motion.div>

      {/* Headlight beams */}
      <motion.div
        animate={beamCtrl}
        initial={{ opacity: 0, scaleX: 0 }}
        className="absolute pointer-events-none"
        style={{
          left: "46%",
          bottom: "32%",
          width: "54%",
          height: "42vh",
          transformOrigin: "0% 65%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: [
              "conic-gradient(from -14deg at 0% 60%, rgba(212,175,55,0.22) 0deg, transparent 32deg)",
              "conic-gradient(from -6deg at 2% 70%, rgba(255,248,200,0.14) 0deg, transparent 26deg)",
            ].join(", "),
            filter: "blur(22px)",
          }}
        />
      </motion.div>

      {/* Store name */}
      <div
        className="absolute right-[5%] sm:right-[8%] text-right"
        style={{ bottom: "38%" }}
      >
        <motion.p
          animate={titleCtrl}
          initial={{ opacity: 0, y: 8 }}
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-gold mb-3"
        >
          House of Crafts · Muscat, Oman
        </motion.p>
        <motion.h2
          animate={titleCtrl}
          initial={{ opacity: 0, y: 8 }}
          className="font-display tracking-tight leading-[0.92]"
          style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
        >
          <span
            className="block text-text"
            style={{ textShadow: "0 0 60px rgba(212,175,55,0.3)" }}
          >
            Diecast
          </span>
          <span
            className="block text-gradient-gold italic"
            style={{ textShadow: "0 0 80px rgba(212,175,55,0.55)" }}
          >
            Muscat
          </span>
        </motion.h2>
      </div>

      {/* CTA */}
      <motion.div
        animate={ctaCtrl}
        initial={{ opacity: 0, y: 8 }}
        className="absolute"
        style={{ right: "5%", bottom: "24%" }}
      >
        <Link
          href="/products"
          className="inline-flex h-11 items-center gap-2 px-7 rounded-full bg-gold text-bg text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-gold-bright transition-colors shadow-[0_8px_40px_-8px_rgba(212,175,55,0.9)]"
        >
          Shop Now
        </Link>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </div>
  );
}
