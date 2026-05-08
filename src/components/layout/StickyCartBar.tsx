"use client";

import { usePathname } from "next/navigation";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartSelectors } from "@/stores/cart";
import { formatCurrencyOMR } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";

export function StickyCartBar() {
  const pathname = usePathname();
  const count = useCartStore(cartSelectors.count);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const openCart = useCartStore((s) => s.openCart);
  const mounted = useMounted();

  if (!mounted || count === 0) return null;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/products/")
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="cart-bar"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="lg:hidden fixed inset-x-3 z-30"
        style={{
          bottom: "calc(4rem + env(safe-area-inset-bottom) + 0.5rem)",
        }}
      >
        <button
          type="button"
          onClick={openCart}
          aria-label={`Open cart, ${count} items, total ${formatCurrencyOMR(subtotal)}`}
          className="group w-full h-14 px-5 rounded-full bg-gold text-bg flex items-center justify-between gap-3 shadow-[0_18px_60px_-15px_rgba(212,175,55,0.55)] active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg/15">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-bg text-gold text-[10px] font-bold flex items-center justify-center border border-gold/40">
                {count}
              </span>
            </span>
            <span className="flex flex-col items-start leading-tight min-w-0">
              <span className="text-[10px] uppercase tracking-[0.24em] opacity-80">
                Your collection
              </span>
              <span className="font-display text-base truncate">
                {formatCurrencyOMR(subtotal)}
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold">
            Checkout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
