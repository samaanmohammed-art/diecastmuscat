import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/database";
import { ProductCard } from "@/components/products/ProductCard";

interface CategoryShelfProps {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
  products: Product[];
  variant?: "default" | "compact";
}

export function CategoryShelf({
  eyebrow,
  title,
  href,
  products,
  variant = "default",
}: CategoryShelfProps) {
  if (products.length === 0) return null;
  const compact = variant === "compact";

  return (
    <section className="relative bg-bg py-10 sm:py-14 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-4 sm:px-6 lg:px-12 mb-5 sm:mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">
              {eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
              {title}
            </h2>
          </div>
          <Link
            href={href}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-gold transition-colors pb-1"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute top-0 bottom-3 left-0 w-6 lg:w-12 bg-gradient-to-r from-bg to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 bottom-3 right-0 w-6 lg:w-12 bg-gradient-to-l from-bg to-transparent z-10" />

          <div className="shelf-scroll overflow-x-auto snap-x snap-mandatory scroll-pl-4 lg:scroll-pl-12">
            <ul className="flex gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-12 pb-3">
              {products.map((p, i) => (
                <li
                  key={p.id}
                  className={
                    compact
                      ? "snap-start shrink-0 w-[60vw] sm:w-[280px] lg:w-[240px]"
                      : "snap-start shrink-0 w-[78vw] sm:w-[44vw] lg:w-[300px] xl:w-[320px]"
                  }
                >
                  <ProductCard product={p} compact={compact} priority={i < 2} />
                </li>
              ))}
              <li className="snap-start shrink-0 w-[40vw] sm:w-[200px] flex">
                <Link
                  href={href}
                  className="flex-1 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong text-text-muted hover:border-gold/60 hover:text-gold transition-colors min-h-[200px]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.22em]">
                    See all
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
