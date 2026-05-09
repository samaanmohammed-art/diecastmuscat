"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  { label: "1:18 Porsche", href: "/products?scale=1:18&q=porsche" },
  { label: "Limited editions", href: "/products?limited=1" },
  { label: "Under 50 OMR", href: "/products?maxPrice=50" },
  { label: "Aviation", href: "/products?category=planes" },
  { label: "AutoArt", href: "/products?brand=AutoArt" },
  { label: "Lamborghini", href: "/products?q=lamborghini" },
];

interface MobileSearchSheetProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSearchSheet({ open, onClose }: MobileSearchSheetProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = () => {
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-xl flex flex-col"
          role="dialog"
          aria-label="Search"
        >
          <div className="flex items-center gap-3 px-4 sm:px-6 pt-3 border-b border-border h-16"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
            <div className="flex-1 flex items-center gap-3 bg-surface border border-border-strong rounded-md px-4 h-12">
              <Search className="h-5 w-5 text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Try '1:18 Porsche under 100'"
                className="flex-1 bg-transparent text-base placeholder:text-text-dim focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-text-dim hover:text-text"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-3 text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-4">
              Quick filters
            </p>
            <ul className="flex flex-wrap gap-2 mb-10">
              {SUGGESTIONS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-border-strong bg-surface text-sm hover:border-gold/60 hover:text-gold transition-colors"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3 w-3 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-4">
              Browse by category
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {[
                { label: "Cars", href: "/products?category=cars" },
                { label: "Aviation", href: "/products?category=planes" },
                { label: "Heavy haul", href: "/products?category=trucks" },
                { label: "Motorcycles", href: "/products?category=bikes" },
              ].map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={onClose}
                    className="flex items-center justify-between h-14 px-4 rounded-md border border-border bg-surface hover:border-gold/40 transition-colors"
                  >
                    <span className="font-display text-base">{c.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
