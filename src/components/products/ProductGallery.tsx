"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  category?: string;
}

export function ProductGallery({ images, alt, category }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const single = images.length === 1;
  const current = images[active] ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-surface group">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current!}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <PlaceholderArt category={category} />
        )}

        {/* Floating dust particles for premium feel when single image */}
        {single && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: "100%", x: `${15 + i * 14}%`, opacity: 0 }}
                animate={{
                  y: "-20%",
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 6 + i * 0.7,
                  repeat: Infinity,
                  delay: i * 1.1,
                  ease: "linear",
                }}
                className="absolute h-1 w-1 rounded-full bg-gold/40 blur-[1px]"
              />
            ))}
          </div>
        )}

        {/* Gold corner accents */}
        <div className="pointer-events-none absolute inset-3 border border-gold/0 group-hover:border-gold/10 transition-colors duration-500" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-surface transition-all",
                i === active
                  ? "border-gold ring-1 ring-gold/40"
                  : "border-border hover:border-border-strong"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} — view ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceholderArt({ category }: { category?: string }) {
  const icon =
    { cars: "🚗", planes: "✈️", trucks: "🚚", bikes: "🏍️" }[category ?? ""] ?? "•";
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-elevated to-bg">
      <span className="text-9xl opacity-15 grayscale">{icon}</span>
    </div>
  );
}
