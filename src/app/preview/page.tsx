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

const LANDING_DEMOS = [
  {
    slug: "cabinet",
    label: "00",
    name: "The Cabinet",
    feel: "Clean · Classy · Auction-catalogue",
    description: "A collector's lit display cabinet. Cream editorial hero with a glass case, horizontal category shelves, lot-numbered cards, quick-look modal, curator's selection and limited editions. Mobile-first.",
    palette: ["#F1EDE4", "#9A7B4F", "#1C1A16"],
  },
  {
    slug: "flagship",
    label: "3D",
    name: "The Vault — 3D Flagship",
    feel: "Real 3D · Interactive · Awwwards-grade",
    description: "A real Three.js supercar you can spin. Cinematic scale-reveal intro, tilt-to-hold lighting (gyroscope on mobile), scroll-driven detail tour, live paint configurator. Works on phone, tablet, PC.",
    palette: ["#ECEAE4", "#B81D24", "#1A1916"],
  },
  {
    slug: "porsche-vault",
    label: "01",
    name: "Porsche · Vault",
    feel: "Light luxury · Museum vitrine",
    description: "Single-piece PDP. Soft radial gradient, HUD overlay, scroll-triggered spoiler rise, weight count-up, X-Ray toggle, Muscat Vault microcopy. Native-app feel. The Collectcar direction.",
    palette: ["#F5F4F1", "#E5E3DE", "#8B7E60"],
  },
  {
    slug: "porsche-studio",
    label: "02",
    name: "Porsche · Studio",
    feel: "Dark cinematic · Showroom at night",
    description: "Same PDP, dark cinematic treatment. Garage spotlight under the car, Porsche red price, headlights fade on as you scroll. Mobile-first native app.",
    palette: ["#1A1A1A", "#0A0A0A", "#D5001C"],
  },
  {
    slug: "landing-kinetic",
    label: "E",
    name: "Kinetic Brutalist",
    feel: "Electric yellow · Brutal type",
    description: "Mustard yellow on near-black. Marquee tickers, draggable category cards, oversized outlined type, lot-number editorial table. Balenciaga meets Sotheby's.",
    palette: ["#0A0A0A", "#F5D300", "#FAFAF7"],
  },
  {
    slug: "landing-aurora",
    label: "F",
    name: "Aurora Glass",
    feel: "Spatial · Atmospheric",
    description: "Aurora mesh gradient background, frosted glass cards, mouse-parallax depth. Apple Vision Pro aesthetic. Soft violet/cyan/rose.",
    palette: ["#0F0A1F", "#A78BFA", "#67E8F9"],
  },
  {
    slug: "landing-spatial",
    label: "G",
    name: "3D Spatial",
    feel: "Tilt cards · Cosmic depth",
    description: "Deep cosmic blue-black. 3D-tilt product cards respond to cursor, scroll-tied perspective, SVG annotation callouts. Like Apple iPad Pro page.",
    palette: ["#070A14", "#5E9EFF", "#F0F2F8"],
  },
  {
    slug: "landing-obsidian",
    label: "A",
    name: "Obsidian Vault",
    feel: "Dark luxury · Warm gold",
    description: "Black with animated gold particle shimmer. Italic hero fades up, horizontal shelf, 2-col curator grid, hairline gold CTA.",
    palette: ["#0A0A0A", "#111111", "#D4AF37"],
  },
  {
    slug: "landing-ivory",
    label: "B",
    name: "Ivory Atelier",
    feel: "Editorial · Light",
    description: "Cream off-white, dark text, gold rule above headline. Auction-house catalogue grid with generous whitespace.",
    palette: ["#F5F0E8", "#1A1A1A", "#B08A20"],
  },
  {
    slug: "landing-carbon",
    label: "C",
    name: "Carbon Series",
    feel: "Industrial · Sporty",
    description: "Cool dark with staggered ALL-CAPS letter animation. Red accent replaces gold. Timing-board feel.",
    palette: ["#0D0D0F", "#141417", "#C0392B"],
  },
  {
    slug: "landing-gallery",
    label: "D",
    name: "Gallery Edition",
    feel: "Minimalist · Exhibition",
    description: "Full-viewport hero image, minimal overlay. Products reveal one-by-one on scroll. Museum auction preview feel.",
    palette: ["#080808", "#0E0E0E", "#F0F0EE"],
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

        {/* ── New Landing Page Demos ── */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">
              Landing Page Demos · Round II
            </p>
            <h2 className="font-display text-3xl md:text-4xl">Premium PDP demos + landing directions.</h2>
            <p className="mt-3 text-sm text-text-muted max-w-lg">
              Mobile-first product detail pages (Porsche · Vault, Porsche · Studio) with HUD overlays, scroll animations, and native-app feel. Plus full landing directions below.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LANDING_DEMOS.map((demo) => (
              <Link
                key={demo.slug}
                href={`/preview/${demo.slug}`}
                className="group relative block rounded-lg bg-surface border border-border hover:border-gold-muted transition-colors p-6 focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="font-display text-5xl text-text-dim group-hover:text-gold transition-colors leading-none">
                    {demo.label}
                  </span>
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border-strong group-hover:border-gold group-hover:bg-gold group-hover:text-black text-text-muted transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1">{demo.feel}</p>
                <h3 className="font-display text-xl sm:text-2xl group-hover:text-gold transition-colors">{demo.name}</h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{demo.description}</p>
                <div className="mt-5 flex items-center gap-2">
                  {demo.palette.map((c) => (
                    <span
                      key={c}
                      className="h-7 w-7 rounded-sm border border-border-strong"
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">
            Direction Studies · Round I
          </p>
          <h2 className="font-display text-3xl md:text-4xl">Three homepage directions.</h2>
        </div>

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
