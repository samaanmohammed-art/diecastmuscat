import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Truck, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About — Diecast Muscat",
  description:
    "A curated atelier of authenticated die-cast collectibles, sourced and inspected in Muscat for collectors across Oman and the GCC.",
};

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Source",
    body: "We source directly from six established maisons. Every piece is traceable to the maker — never grey-market, never unverified.",
  },
  {
    number: "02",
    title: "Authenticate",
    body: "Each item arrives at our Muscat atelier where it is opened, inspected under light, photographed, and signed off before it enters the register.",
  },
  {
    number: "03",
    title: "Catalogue",
    body: "Provenance, edition, condition, and scale are recorded. Limited-run pieces are numbered. Every SKU has a history.",
  },
  {
    number: "04",
    title: "Despatch",
    body: "Wrapped in archival tissue inside a custom-fitted outer, signed, dated, and dispatched insured — within 2–3 days across the Sultanate.",
  },
];

const VALUES = [
  {
    icon: Shield,
    label: "Authenticated",
    body: "No piece reaches the register without a physical inspection at our Muscat vault.",
  },
  {
    icon: Sparkles,
    label: "Curated",
    body: "We maintain a deliberate edit. Quantity is secondary to quality of provenance.",
  },
  {
    icon: Truck,
    label: "Insured shipping",
    body: "Worldwide despatch via DHL in bespoke protective packaging. Every order is signed for.",
  },
  {
    icon: RotateCcw,
    label: "14-day exchange",
    body: "If a piece does not match its catalogue description, we make it right — no argument.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-28 lg:pb-32">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
          The Atelier
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.0] text-text max-w-3xl">
          Collected,{" "}
          <em className="not-italic text-gold italic">not assembled.</em>
        </h1>
        <p className="mt-8 max-w-xl text-base lg:text-lg text-text-muted leading-relaxed">
          Diecast Muscat is an atelier for die-cast model collectibles based in Muscat, Oman.
          We source from the world's leading maisons, authenticate every piece by hand, and
          deliver to collectors across the Sultanate and the wider GCC.
        </p>
        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-bright transition-colors"
          >
            Explore the collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Separator />

      {/* Brand story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
              Our story
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-text">
              A collector's eye.{" "}
              <em className="not-italic text-gold italic">A curator's discipline.</em>
            </h2>
            <div className="mt-8 space-y-5 text-text-muted leading-relaxed text-base">
              <p>
                Diecast Muscat began the way most collections do — with a single piece
                that refused to leave a shelf. What started as a personal pursuit became
                a question: why was it so difficult to source authenticated, mint-condition
                die-cast models in the Gulf?
              </p>
              <p>
                Most listings online are grey-market. Most local retailers carry only
                mass-market runs. There was no atelier in Oman treating die-cast models
                with the same rigour applied to watches or vintage prints.
              </p>
              <p>
                So we built one. Today we maintain active relationships with six maisons —
                from Hotwheels RLC to Amalgam Collection — and every piece in our register
                has been physically handled, inspected, and catalogued in Muscat before
                it is offered to a collector.
              </p>
            </div>
          </div>

          {/* Pull-quote card */}
          <div className="rounded-xl border border-gold/20 bg-surface/40 p-8 lg:p-10">
            <blockquote className="font-display text-xl lg:text-2xl text-text leading-snug italic">
              "A die-cast model at 1:18 scale is an engineering object. It deserves
              to be presented — and preserved — as one."
            </blockquote>
            <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-gold">
              — Founder, Diecast Muscat
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Authentication process */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="mb-12 lg:mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            The process
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-text max-w-2xl">
            From maison to{" "}
            <em className="not-italic text-gold italic">your collection.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface/30 px-6 py-8 lg:px-8 lg:py-10 flex flex-col"
            >
              <span className="font-display text-5xl lg:text-6xl text-gold/20 leading-none font-bold italic">
                {step.number}
              </span>
              <h3 className="mt-5 font-display text-xl text-text">{step.title}</h3>
              <p className="mt-3 text-sm text-text-muted leading-relaxed flex-1">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="mb-12 lg:mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4">
            Our commitments
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight text-text max-w-lg">
            What every collector should expect.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.label}
                className="rounded-lg border border-border bg-surface/30 px-6 py-6 flex gap-4"
              >
                <div className="shrink-0 mt-0.5 h-9 w-9 rounded-md border border-gold/20 bg-gold/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{v.label}</p>
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{v.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl sm:text-3xl text-text">
              Ready to start your{" "}
              <em className="not-italic text-gold italic">collection?</em>
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Browse authenticated pieces — from 1:64 daily-drivers to 1:18 limited editions.
            </p>
          </div>
          <Link
            href="/products"
            className="shrink-0 inline-flex items-center gap-2 bg-gold text-bg px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold-bright transition-colors"
          >
            View the register <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
