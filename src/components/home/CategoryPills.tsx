import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const PILLS = [
  { label: "All", href: "/products", accent: false },
  { label: "Cars", href: "/products?category=cars" },
  { label: "Aviation", href: "/products?category=planes" },
  { label: "Heavy haul", href: "/products?category=trucks" },
  { label: "Motorcycles", href: "/products?category=bikes" },
  { label: "1:18", href: "/products?scale=1:18" },
  { label: "1:43", href: "/products?scale=1:43" },
  { label: "1:64", href: "/products?scale=1:64" },
  { label: "Limited", href: "/products?limited=1", accent: true },
  { label: "Under 50 OMR", href: "/products?maxPrice=50" },
];

export function CategoryPills() {
  return (
    <section className="relative bg-bg pt-6 sm:pt-8 pb-2">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-4 sm:px-6 lg:px-12 mb-3 flex items-baseline justify-between">
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
            Quick browse
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-gold transition-colors"
          >
            All filters
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="shelf-scroll overflow-x-auto">
          <ul className="flex gap-2 px-4 sm:px-6 lg:px-12 pb-2">
            {PILLS.map((pill) => (
              <li key={pill.href} className="shrink-0">
                <Link
                  href={pill.href}
                  className={`inline-flex items-center h-10 px-4 rounded-full border text-xs uppercase tracking-[0.18em] whitespace-nowrap transition-colors ${
                    pill.accent
                      ? "bg-gold/10 border-gold/50 text-gold hover:bg-gold/15"
                      : "bg-surface border-border-strong text-text-muted hover:border-gold/40 hover:text-text"
                  }`}
                >
                  {pill.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
