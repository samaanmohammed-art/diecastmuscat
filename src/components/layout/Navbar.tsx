"use client";

import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { useState } from "react";
import { useCartStore, cartSelectors } from "@/stores/cart";
import { MobileSearchSheet } from "./MobileSearchSheet";

const NAV_LINKS = [
  { href: "/products?category=cars", label: "Cars" },
  { href: "/products?category=planes", label: "Planes" },
  { href: "/products?category=trucks", label: "Trucks" },
  { href: "/products?category=bikes", label: "Bikes" },
  { href: "/products?limited=1", label: "Limited" },
];

export function Navbar() {
  const cartCount = useCartStore(cartSelectors.count);
  const openCart = useCartStore((s) => s.openCart);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/85 border-b border-border">
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="Diecast Muscat home">
              <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-md border border-gold-muted/40 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center group-hover:border-gold transition-colors">
                <span className="font-display text-gold text-lg lg:text-xl font-bold leading-none">DM</span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-display text-base font-semibold tracking-tight">Diecast</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted -mt-0.5">
                  Muscat
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Categories">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-text-muted hover:text-gold transition-colors uppercase tracking-[0.12em]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile: persistent search input */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden flex-1 flex items-center gap-2 h-10 px-3 rounded-full border border-border-strong bg-surface/60 text-left text-text-muted hover:border-gold/40 hover:text-text transition-colors"
              aria-label="Open search"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-xs truncate">Search models, brands…</span>
            </button>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold hover:bg-surface transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/account"
                className="h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold hover:bg-surface transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                className="relative h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold hover:bg-surface transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile single cart action (rest live in BottomNav) */}
            <button
              onClick={openCart}
              className="lg:hidden relative h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold transition-colors"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileSearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
