import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeadlightReveal } from "@/components/home/concepts/HeadlightReveal";
import { MomentumScroll } from "@/components/home/concepts/MomentumScroll";
import { ParallaxShowroom } from "@/components/home/concepts/ParallaxShowroom";

export const metadata: Metadata = {
  title: "Hero Concepts — Diecast Muscat",
  robots: { index: false, follow: false },
};

const CONCEPTS = [
  {
    number: "I",
    name: "Headlight Reveal",
    description:
      "Car rolls onto the shelf from the left. When it stops, headlights flash on — a gold beam sweeps right and illuminates the store name.",
  },
  {
    number: "II",
    name: "Momentum Scroll",
    description:
      "Car speed is tied to your scroll velocity. Scroll fast and the wheels blur. Slow down and the chassis dips like it's braking. Letters bounce on impact.",
  },
  {
    number: "III",
    name: "Parallax Showroom",
    description:
      "Three depth layers move at different speeds. The background drifts slowly, the car stays anchored, and the store name slides in from the right.",
  },
] as const;

export default function HeroConceptsPage() {
  return (
    <div className="bg-bg">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 px-5 py-3 bg-bg/90 backdrop-blur-md border-b border-border flex items-center justify-between gap-4">
        <Link
          href="/preview"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Previews
        </Link>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
          Hero Animation Concepts
        </p>
        <p className="text-[10px] text-text-dim hidden sm:block">
          Scroll · pick one · we swap it in
        </p>
      </div>

      {/* Concept I */}
      <ConceptSection concept={CONCEPTS[0]}>
        <HeadlightReveal />
      </ConceptSection>

      {/* Concept II — tall section for scroll-linked animation */}
      <ConceptSection concept={CONCEPTS[1]} note="Scroll through this section slowly">
        <MomentumScroll />
      </ConceptSection>

      {/* Concept III */}
      <ConceptSection concept={CONCEPTS[2]}>
        <ParallaxShowroom />
      </ConceptSection>

      {/* Footer prompt */}
      <div className="px-6 py-16 text-center border-t border-border">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3">
          Ready to choose?
        </p>
        <p className="text-sm text-text-muted">
          Tell me which concept you prefer — I'll replace the live hero and push to Vercel.
        </p>
      </div>
    </div>
  );
}

function ConceptSection({
  concept,
  note,
  children,
}: {
  concept: (typeof CONCEPTS)[number];
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="px-5 sm:px-8 py-5 border-b border-border bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold">
            Concept {concept.number}
          </span>
          <h2 className="font-display text-lg sm:text-xl mt-0.5">
            {concept.name}
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            {concept.description}
          </p>
        </div>
        {note && (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-text-dim border border-border rounded-full px-3 py-1">
            {note}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
