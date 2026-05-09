import Link from "next/link";

const BRANDS = [
  { name: "AutoArt", initials: "AA" },
  { name: "Minichamps", initials: "MC" },
  { name: "Bburago", initials: "BB" },
  { name: "Herpa Wings", initials: "HW" },
  { name: "Hobby Master", initials: "HM" },
  { name: "Tekno", initials: "TK" },
  { name: "Eligor", initials: "EL" },
  { name: "Italeri", initials: "IT" },
  { name: "Maisto", initials: "MS" },
];

export function BrandStrip() {
  return (
    <section className="relative bg-bg py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="px-4 sm:px-6 lg:px-12 mb-6 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">
              The houses
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
              Sourced direct from <em className="text-gold not-italic font-display">nine maisons</em>
            </h2>
          </div>
        </div>

        <div className="shelf-scroll overflow-x-auto">
          <ul className="flex items-center gap-3 px-4 sm:px-6 lg:px-12 pb-2">
            {BRANDS.map((b) => (
              <li key={b.name} className="shrink-0">
                <Link
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="group flex flex-col items-center gap-2 w-[88px]"
                >
                  <div className="h-16 w-16 rounded-full border border-border-strong bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center group-hover:border-gold/60 group-hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.5)] transition-all">
                    <span className="font-display text-base text-gold-muted group-hover:text-gold transition-colors">
                      {b.initials}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted group-hover:text-text text-center line-clamp-1 transition-colors">
                    {b.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
