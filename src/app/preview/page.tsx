import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Design Previews — Diecast Muscat",
  description: "Three alternate visual directions for the Diecast Muscat platform.",
  robots: { index: false, follow: false },
};

const PREVIEWS = [
  {
    slug: "editorial",
    number: "I",
    name: "Editorial Ivory",
    tagline: "Magazine, in colour reversed.",
    description:
      "A light, slow, deliberate aesthetic. Massive serif headlines, asymmetric grids, oxblood accents on warm cream. Reads like a Hermès lookbook — built for connoisseurs who want time to linger.",
    palette: ["#F8F6F1", "#0E0E0E", "#9B3A2A"],
    references: ["Wallpaper Magazine", "Hermès Heritage", "Cereal"],
  },
  {
    slug: "showroom",
    number: "II",
    name: "Concourse Noir",
    tagline: "The current direction, taken further.",
    description:
      "Cinematic dark. Champagne instead of warm gold. Deep blue-black with subtle gradients. Each product framed in glass like a concours d'élégance display piece. Built for drama and prestige.",
    palette: ["#0B1014", "#E8E8E0", "#E5C894"],
    references: ["McLaren Speedtail", "A. Lange & Söhne", "Bugatti"],
  },
  {
    slug: "atelier",
    number: "III",
    name: "Atelier Blueprint",
    tagline: "The maker's drafting board.",
    description:
      "Chalk white with a faint technical grid, blueprint cyan, monospace specs. Products presented as objects of engineering — dimension lines, callouts, provenance plates. Built for collectors who care about how it's made.",
    palette: ["#F5F4EE", "#1E1E1E", "#1E5A8A"],
    references: ["Dieter Rams catalogues", "Architect's drafting set", "Kinfolk"],
  },
] as const;

export default function PreviewIndex() {
  return (
    <div className="min-h-screen px-6 lg:px-12 py-20 lg:py-32 bg-bg">
      <div className="mx-auto max-w-6xl">
        <header className="mb-20 lg:mb-32 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
            Direction Studies — Confidential
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Three lives <span className="text-gradient-gold italic">this brand</span> could lead.
          </h1>
          <p className="mt-8 text-base lg:text-lg text-text-muted leading-relaxed">
            Each route below is a fully designed preview of the Diecast Muscat homepage in a
            different visual direction. The live site stays untouched. Pick a feel — or mix
            elements from each — and we'll evolve from there.
          </p>
        </header>

        <ol className="space-y-px">
          {PREVIEWS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/preview/${p.slug}`}
                className="group grid grid-cols-12 gap-6 lg:gap-12 py-10 lg:py-14 border-t border-border hover:border-gold-muted transition-colors"
              >
                <div className="col-span-12 lg:col-span-1 flex lg:block items-baseline">
                  <span className="font-display text-6xl lg:text-7xl text-gold-muted group-hover:text-gold transition-colors leading-none">
                    {p.number}
                  </span>
                </div>

                <div className="col-span-12 lg:col-span-7">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-3">
                    {p.tagline}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl group-hover:text-gold transition-colors">
                    {p.name}
                  </h2>
                  <p className="mt-5 text-sm md:text-base text-text-muted leading-relaxed max-w-xl">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-text-dim">
                      References
                    </span>
                    {p.references.map((r) => (
                      <span key={r} className="text-xs text-text-muted">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-text-dim">Palette</p>
                  <div className="flex gap-2">
                    {p.palette.map((c) => (
                      <span
                        key={c}
                        className="h-12 w-12 rounded-sm border border-border-strong"
                        style={{ background: c }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-1 flex lg:justify-end items-end">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-border-strong group-hover:border-gold group-hover:bg-gold group-hover:text-black text-text-muted transition-all">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="mt-20 pt-12 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-dim">
          <p>
            Live production →{" "}
            <Link href="/" className="text-text-muted hover:text-gold transition-colors">
              diecast-muscat.vercel.app
            </Link>
          </p>
          <p>Press ⌘K on any preview to open the command palette (concept).</p>
        </footer>
      </div>
    </div>
  );
}
