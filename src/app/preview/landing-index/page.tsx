import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Landing Demos — Diecast Muscat",
  description: "Four animated landing page direction studies for Diecast Muscat.",
  robots: { index: false, follow: false },
};

const DEMOS = [
  {
    slug: "landing-obsidian",
    label: "A",
    name: "Obsidian Vault",
    tagline: "The current direction, elevated",
    description:
      "Full-bleed black with animated gold particle shimmer. Italic hero headline fades up with Framer Motion. Horizontal scroll shelf, 2-col curator grid, hairline gold CTA.",
    palette: ["#0A0A0A", "#111111", "#D4AF37"],
    paletteLabels: ["Obsidian", "Surface", "Gold"],
    feel: "Dark luxury · Warm gold",
  },
  {
    slug: "landing-ivory",
    label: "B",
    name: "Ivory Atelier",
    tagline: "Editorial auction-house aesthetic",
    description:
      "Cream off-white background, dark text, warm gold rule above headline. Product grid with generous whitespace and subtle shadow. Reads like a Sotheby's catalogue.",
    palette: ["#F5F0E8", "#1A1A1A", "#B08A20"],
    paletteLabels: ["Ivory", "Obsidian", "Warm gold"],
    feel: "Editorial · Light",
  },
  {
    slug: "landing-carbon",
    label: "C",
    name: "Carbon Series",
    tagline: "Industrial / sporty dark",
    description:
      "Near-black cool tint. Bold ALL-CAPS headline with staggered letter-by-letter Framer Motion entrance. Red accent stripe replaces gold. Timing-board feel.",
    palette: ["#0D0D0F", "#141417", "#C0392B"],
    paletteLabels: ["Carbon", "Surface", "Scarlet"],
    feel: "Industrial · Sporty",
  },
  {
    slug: "landing-gallery",
    label: "D",
    name: "Gallery Edition",
    tagline: "Museum / exhibition style",
    description:
      "Full-viewport hero image with minimal overlay: just a lot number and name, centred. Products reveal one-by-one as you scroll. Feels like an auction preview catalogue.",
    palette: ["#080808", "#0E0E0E", "#F0F0EE"],
    paletteLabels: ["Void", "Surface", "White"],
    feel: "Minimalist · Exhibition",
  },
] as const;

export default function LandingIndexPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-bg">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-20 lg:mb-28 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
            Direction Studies · Landing Pages
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-tight">
            Four lives this{" "}
            <span className="text-gradient-gold italic">landing page</span>{" "}
            could lead.
          </h1>
          <p className="mt-6 text-base lg:text-lg text-text-muted leading-relaxed max-w-lg">
            Each demo is a fully animated landing page in a different visual
            direction. The live site stays untouched. Pick a feel and we will
            evolve from there.
          </p>
        </header>

        {/* Demo cards — 2-col grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {DEMOS.map((demo) => (
            <Link
              key={demo.slug}
              href={`/preview/${demo.slug}`}
              className="group relative block rounded-lg bg-surface border border-border hover:border-gold-muted transition-colors p-6 sm:p-8 focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {/* Label */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-display text-5xl text-text-dim group-hover:text-gold transition-colors leading-none">
                  {demo.label}
                </span>
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border-strong group-hover:border-gold group-hover:bg-gold group-hover:text-black text-text-muted transition-all">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Name + tagline */}
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">
                {demo.tagline}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl group-hover:text-gold transition-colors">
                {demo.name}
              </h2>

              {/* Description */}
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                {demo.description}
              </p>

              {/* Palette swatches */}
              <div className="mt-6 flex items-center gap-3">
                {demo.palette.map((c, i) => (
                  <div key={c} className="flex flex-col items-center gap-1.5">
                    <span
                      className="h-8 w-8 rounded-sm border border-border-strong"
                      style={{ background: c }}
                      aria-label={demo.paletteLabels[i]}
                    />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim">
                      {demo.paletteLabels[i]}
                    </span>
                  </div>
                ))}
                <span className="ml-auto text-[10px] uppercase tracking-[0.24em] text-text-dim">
                  {demo.feel}
                </span>
              </div>

              {/* View Demo CTA */}
              <div className="mt-6 pt-6 border-t border-border">
                <span className="text-xs uppercase tracking-[0.24em] text-text-muted group-hover:text-gold transition-colors inline-flex items-center gap-1.5">
                  View Demo
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <footer className="mt-20 pt-12 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-dim">
          <Link
            href="/preview"
            className="text-text-muted hover:text-gold transition-colors"
          >
            All design studies →
          </Link>
          <p>Four animated landing concepts · Diecast Muscat · MMXXVI</p>
        </footer>
      </div>
    </div>
  );
}
