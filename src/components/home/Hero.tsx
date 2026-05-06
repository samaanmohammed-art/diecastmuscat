"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-noise bg-gold-glow">
      {/* Faint grid overlay */}
      <div className="absolute inset-0 bg-grid-faint opacity-40 pointer-events-none" />
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-28 pb-24 lg:pt-40 lg:pb-32 min-h-[92vh] flex items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full"
        >
          {/* Headline column */}
          <div className="lg:col-span-7 xl:col-span-7 relative">
            <motion.p
              variants={item}
              className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-gold mb-8 flex items-center gap-3"
            >
              <span className="inline-block h-px w-8 bg-gold/60" />
              Premium Die-Cast · Sultanate of Oman
            </motion.p>

            <motion.h1
              variants={item}
              className="font-display leading-[0.92] tracking-tight text-4xl sm:text-6xl lg:text-8xl xl:text-9xl"
            >
              <span className="block">Models for</span>
              <span className="block">those who</span>
              <span className="block text-gradient-gold italic">never settle.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-10 max-w-md text-base lg:text-lg text-text-muted leading-relaxed"
            >
              A curated atelier of 1:18, 1:43 and 1:64 die-cast collectibles. Authenticated, mint-condition, hand-delivered across the Sultanate.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="xl">
                <Link href="/products">Explore the collection</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/products?limited=1">Limited editions</Link>
              </Button>
            </motion.div>
          </div>

          {/* Image column — asymmetric, bleeds right */}
          <motion.div
            variants={item}
            className="lg:col-span-5 xl:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full lg:w-[110%] lg:-mr-[10%]">
              {/* Gold ring frame */}
              <div className="absolute -inset-3 lg:-inset-5 border border-gold/15 rounded-sm pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden rounded-sm bg-surface">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85"
                  alt="Featured die-cast model"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                {/* Subtle gradient over image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-bg/60 via-transparent to-transparent" />
              </div>

              {/* Floating numeric tag */}
              <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 bg-bg border border-gold/40 px-4 py-2 backdrop-blur-sm">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-0.5">Featured</p>
                <p className="font-display text-sm">001 / 099</p>
              </div>

              {/* Floating caption */}
              <div className="absolute -bottom-4 right-2 lg:-bottom-6 lg:right-6 bg-bg border border-border-strong px-4 py-3">
                <p className="text-[9px] uppercase tracking-[0.3em] text-text-dim mb-0.5">Now showing</p>
                <p className="font-display text-sm">Porsche 911 GT3 RS</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-dim"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
