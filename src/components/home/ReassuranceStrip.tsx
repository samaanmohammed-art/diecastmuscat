import { Shield, Truck, Sparkles, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    icon: Shield,
    title: "Authenticated",
    body: "Every piece inspected, signed, and sealed in our Muscat vault.",
  },
  {
    icon: Truck,
    title: "Insured shipping",
    body: "Custom-fitted packaging. Oman 2–3 days, GCC 5–7, world 7–10.",
  },
  {
    icon: Sparkles,
    title: "Curated by collectors",
    body: "Sourced from nine maisons — never grey-market.",
  },
  {
    icon: RotateCcw,
    title: "14-day exchange",
    body: "Unboxed but unused? Return for full credit.",
  },
];

export function ReassuranceStrip() {
  return (
    <section className="relative bg-surface/40 border-y border-border py-10 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="flex flex-col items-start gap-2 p-4 lg:p-5 rounded-lg bg-bg/40 border border-border hover:border-gold-muted/60 transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold mb-1">
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </span>
                <p className="font-display text-sm sm:text-base text-text leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
