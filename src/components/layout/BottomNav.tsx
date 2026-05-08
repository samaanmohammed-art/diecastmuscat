"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useCartStore, cartSelectors } from "@/stores/cart";
import { useWishlistStore, wishlistSelectors } from "@/stores/wishlist";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/useMounted";
import { MobileSearchSheet } from "./MobileSearchSheet";

const TABS = [
  { id: "home", href: "/", label: "Home", icon: Home },
  { id: "browse", href: "/products", label: "Browse", icon: LayoutGrid },
  { id: "search", href: "#search", label: "Search", icon: Search },
  { id: "cart", href: "#cart", label: "Bag", icon: ShoppingBag },
  { id: "account", href: "/account", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore(cartSelectors.count);
  const wishCount = useWishlistStore(wishlistSelectors.count);
  const openCart = useCartStore((s) => s.openCart);
  const [searchOpen, setSearchOpen] = useState(false);
  const mounted = useMounted();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("#")) return false;
    return pathname.startsWith(href);
  };

  if (pathname.startsWith("/admin") || pathname.startsWith("/preview")) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="absolute inset-0 bg-bg/90 backdrop-blur-xl border-t border-border" />
        <ul className="relative flex items-stretch justify-around h-16">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            const badge =
              tab.id === "cart" && mounted && cartCount > 0
                ? cartCount
                : tab.id === "account" && mounted && wishCount > 0
                ? wishCount
                : null;
            const isAction = tab.href.startsWith("#");

            const inner = (
              <span className="relative flex flex-col items-center justify-center gap-1 h-full px-3">
                <span
                  className={cn(
                    "relative inline-flex h-6 items-center justify-center transition-colors",
                    active ? "text-gold" : "text-text-muted"
                  )}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
                  {badge !== null && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-gold text-bg text-[10px] font-bold flex items-center justify-center">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.18em]",
                    active ? "text-gold" : "text-text-dim"
                  )}
                >
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </span>
            );

            if (isAction) {
              return (
                <li key={tab.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (tab.id === "search") setSearchOpen(true);
                      else if (tab.id === "cart") openCart();
                    }}
                    className="w-full h-full"
                    aria-label={tab.label}
                  >
                    {inner}
                  </button>
                </li>
              );
            }

            return (
              <li key={tab.id} className="flex-1">
                <Link href={tab.href} className="block w-full h-full" aria-label={tab.label}>
                  {inner}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <MobileSearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
