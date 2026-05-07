import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/database";
import { formatCurrencyOMR } from "@/lib/utils";

interface CupboardCardProps {
  product: Product;
  lot: number;
  priority?: boolean;
}

export function CupboardCard({ product, lot, priority = false }: CupboardCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block relative card-luxury overflow-hidden"
      aria-label={`${product.name}, ${formatCurrencyOMR(product.price)}`}
    >
      <div className="relative aspect-[4/3] bg-surface-elevated overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 280px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-elevated" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />

        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.32em] text-text/80 bg-bg/40 backdrop-blur px-2 py-1 rounded-sm">
          Lot {String(lot).padStart(3, "0")}
        </span>

        {product.is_limited_edition && (
          <span className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.32em] text-gold bg-bg/40 backdrop-blur px-2 py-1 rounded-sm">
            Numbered
          </span>
        )}

        {[
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} h-1.5 w-1.5 border border-gold/40 pointer-events-none`}
          />
        ))}
      </div>

      <div className="px-4 pt-4 pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
          {product.brand ?? "Atelier"} · {product.scale ?? "—"}
        </p>
        <h3 className="mt-1 font-display text-base leading-snug tracking-tight text-text line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-border">
          <p className="font-display text-lg text-gradient-gold">
            {formatCurrencyOMR(product.price)}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">
            {product.stock > 0 ? `${product.stock} on shelf` : "Reserved"}
          </p>
        </div>
      </div>
    </Link>
  );
}
