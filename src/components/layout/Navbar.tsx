"use client";

import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore, cartSelectors } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products?category=cars", label: "Cars" },
  { href: "/products?category=planes", label: "Planes" },
  { href: "/products?category=trucks", label: "Trucks" },
  { href: "/products?category=bikes", label: "Bikes" },
  { href: "/products", label: "All" },
];

export function Navbar() {
  const cartCount = useCartStore(cartSelectors.count);
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/85 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="h-10 w-10 rounded-md border border-gold-muted/40 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center group-hover:border-gold transition-colors">
                <span className="font-display text-gold text-xl font-bold leading-none">DM</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight">Diecast</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted -mt-0.5">Muscat</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
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

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
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
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:text-gold hover:bg-surface transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search bar (collapsible) */}
        {searchOpen && (
          <div className="pb-4 animate-in fade-in duration-200">
            <SearchBox onSearch={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-surface/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-text hover:text-gold uppercase tracking-[0.12em] border-b border-border last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchBox({ onSearch }: { onSearch: () => void }) {
  const [query, setQuery] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) {
          window.location.href = `/products?q=${encodeURIComponent(query.trim())}`;
          onSearch();
        }
      }}
      className="flex items-center gap-3 bg-surface border border-border-strong rounded-md px-4 h-12"
    >
      <Search className="h-4 w-4 text-text-muted shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try: 1:18 BMW under 100 OMR…"
        className="flex-1 bg-transparent text-sm placeholder:text-text-dim focus:outline-none"
        autoFocus
      />
      <Button type="submit" size="sm">
        Search
      </Button>
    </form>
  );
}
