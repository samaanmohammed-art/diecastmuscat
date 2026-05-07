"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/types/database";
import { CupboardCard } from "./CupboardCard";

export interface Drawer {
  id: string;
  label: string;
  sublabel?: string;
  products: Product[];
}

interface DrawerStackProps {
  drawers: Drawer[];
  defaultOpenId?: string;
}

export function DrawerStack({ drawers, defaultOpenId }: DrawerStackProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="relative">
      {drawers.map((drawer, idx) => {
        const isOpen = openId === drawer.id;
        const isLast = idx === drawers.length - 1;
        return (
          <DrawerRow
            key={drawer.id}
            drawer={drawer}
            isOpen={isOpen}
            isLast={isLast}
            onToggle={() => setOpenId(isOpen ? null : drawer.id)}
          />
        );
      })}
    </div>
  );
}

interface DrawerRowProps {
  drawer: Drawer;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
}

function DrawerRow({ drawer, isOpen, isLast, onToggle }: DrawerRowProps) {
  const count = drawer.products.length;
  const isEmpty = count === 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={isEmpty}
        aria-expanded={isOpen}
        aria-controls={`drawer-${drawer.id}`}
        className="group w-full flex items-center justify-between gap-4 px-1 py-5 lg:py-6 text-left disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-muted shrink-0">
            {String(count).padStart(2, "0")}
          </span>
          <span className="font-display text-2xl lg:text-3xl tracking-tight truncate">
            {drawer.label}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {drawer.sublabel && (
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              {drawer.sublabel}
            </span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-strong group-hover:border-gold-muted transition-colors"
            aria-hidden
          >
            <ChevronRight className="h-3.5 w-3.5 text-gold" />
          </motion.span>
        </div>
      </button>

      {!isLast && <div className="hairline-gold opacity-40" />}

      <AnimatePresence initial={false}>
        {isOpen && !isEmpty && (
          <motion.section
            id={`drawer-${drawer.id}`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", stiffness: 300, damping: 34 },
              opacity: { duration: 0.18 },
            }}
            className="overflow-hidden"
          >
            <div className="relative bg-gold-glow">
              <Shelf products={drawer.products} drawerId={drawer.id} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shelf({ products, drawerId }: { products: Product[]; drawerId: string }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const dotCount = Math.min(products.length, 6);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const card = el.querySelector<HTMLElement>("[data-card]");
        if (!card) return;
        const cardWidth = card.offsetWidth + 16;
        const idx = Math.round(el.scrollLeft / cardWidth);
        const capped = Math.min(Math.max(idx, 0), dotCount - 1);
        setActive(capped);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [dotCount]);

  return (
    <div className="relative pt-4 pb-8">
      <div
        className="pointer-events-none absolute top-0 bottom-8 left-0 w-6 lg:w-12 z-10"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-0 bottom-8 right-0 w-6 lg:w-12 z-10"
        style={{
          background:
            "linear-gradient(to left, var(--color-bg) 0%, transparent 100%)",
        }}
      />

      <div
        ref={scrollerRef}
        className="cupboard-shelf overflow-x-auto snap-x snap-mandatory scroll-pl-4 lg:scroll-pl-6 -mx-4 lg:-mx-6"
      >
        <ul className="flex gap-4 px-4 lg:px-6 pb-2">
          {products.map((product, i) => (
            <li
              key={product.id}
              data-card
              className="snap-start shrink-0 w-[78vw] sm:w-[46vw] md:w-[32vw] lg:w-[280px]"
            >
              <CupboardCard product={product} lot={i + 1} priority={i === 0} />
            </li>
          ))}
        </ul>
      </div>

      {dotCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={`${drawerId}-dot-${i}`}
              className={`h-1 transition-all duration-300 ease-out rounded-full ${
                i === active
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
      )}

      <ShelfStyles />
    </div>
  );
}

function ShelfStyles(): ReactNode {
  return (
    <style jsx global>{`
      .cupboard-shelf {
        scrollbar-width: none;
      }
      .cupboard-shelf::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  );
}
