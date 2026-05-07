import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Command, Compass } from "lucide-react";
import { fetchFeaturedProducts, fetchLimitedProducts } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/lib/preview-mock";

export const metadata: Metadata = {
  title: "II — Concourse Noir · Diecast Muscat",
  robots: { index: false, follow: false },
};

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

export default async function ShowroomPreview() {
  const [featuredLive, limitedLive] = await Promise.all([
    fetchFeaturedProducts(8),
    fetchLimitedProducts(2),
  ]);
  const featured = featuredLive.length ? featuredLive : MOCK_PRODUCTS.featured;
  const limited = limitedLive.length ? limitedLive : MOCK_PRODUCTS.limited;
  const hero = limited[0] ?? featured[0];
  const second = limited[1] ?? featured[1];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          background: "#0B1014",
          color: "#E8E8E0",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Atmospheric backdrop */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 800px at 70% 0%, rgba(229,200,148,0.10), transparent 60%), radial-gradient(900px 600px at 10% 90%, rgba(30,90,138,0.08), transparent 70%)",
            zIndex: 0,
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            zIndex: 0,
          }}
        />

        {/* Top bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-xl"
          style={{
            background: "rgba(11,16,20,0.7)",
            borderBottom: "1px solid rgba(229,200,148,0.12)",
          }}
        >
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 h-16 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em]"
              style={{ color: "#8C8C84" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Studies
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: "rgba(229,200,148,0.35)", background: "linear-gradient(135deg, rgba(229,200,148,0.15), transparent)" }}>
                <span className="font-display text-xs" style={{ color: "#E5C894" }}>DM</span>
              </div>
              <span className="text-xs uppercase tracking-[0.4em]" style={{ color: "#E8E8E0" }}>
                Diecast Muscat
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {["Cars", "Aviation", "Trucks", "Motorcycles", "Concours"].map((l, i) => (
                <a key={l} href="#" className="px-3 py-1.5 text-[11px] uppercase tracking-[0.24em]"
                  style={{ color: i === 4 ? "#E5C894" : "#A8A8A0" }}>{l}</a>
              ))}
            </nav>
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 h-8 rounded-md text-[11px]"
              style={{ color: "#8C8C84", border: "1px solid rgba(229,200,148,0.15)" }}>
              <Command className="h-3 w-3" /> K
            </div>
          </div>
        </header>

        {/* Cinematic hero */}
        <section className="relative" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 pt-20 lg:pt-32">
            {/* Eyebrow with metadata */}
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-12">
              <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: "#E5C894" }}>
                Concours Edition · Vol. III
              </p>
              <p className="text-[11px] uppercase tracking-[0.32em]" style={{ color: "#6F6F68" }}>
                Sultanate of Oman / Spring 2026
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Headline */}
              <div className="col-span-12 lg:col-span-6">
                <h1
                  className="font-display tracking-[-0.025em]"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 8.5rem)",
                    lineHeight: "0.92",
                    fontWeight: 600,
                  }}
                >
                  Built to be
                  <br />
                  <span style={{ fontStyle: "italic", color: "#E5C894", fontWeight: 500 }}>
                    remembered.
                  </span>
                </h1>
                <div className="mt-12 max-w-md">
                  <p className="text-base lg:text-lg leading-[1.65]" style={{ color: "#C9C7BE" }}>
                    A concours-grade collection of die-cast objects, sourced from the six houses
                    that engineer them properly and presented in glass — as they should be.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 h-14 px-8 rounded-sm text-sm uppercase tracking-[0.24em] transition-all"
                    style={{
                      background: "#E5C894",
                      color: "#0B1014",
                      boxShadow: "0 0 0 1px rgba(229,200,148,0.4), 0 20px 50px -20px rgba(229,200,148,0.6)",
                    }}
                  >
                    Enter the Concourse
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products?limited=1"
                    className="inline-flex items-center gap-2 h-14 px-8 rounded-sm text-sm uppercase tracking-[0.24em] border transition-colors"
                    style={{ borderColor: "rgba(229,200,148,0.3)", color: "#E8E8E0" }}
                  >
                    Numbered editions
                  </Link>
                </div>
                <div className="mt-12 flex items-center gap-8 pt-8" style={{ borderTop: "1px solid rgba(229,200,148,0.12)" }}>
                  <Stat value="06" label="Maisons" />
                  <Stat value="1,240" label="Authenticated" />
                  <Stat value="14d" label="GCC Delivery" />
                </div>
              </div>

              {/* Glass case product */}
              <div className="col-span-12 lg:col-span-6">
                {hero?.images?.[0] && (
                  <figure className="relative">
                    {/* Pedestal glow */}
                    <div
                      className="absolute -inset-8 -z-10 rounded-[40px] blur-3xl opacity-50"
                      style={{
                        background:
                          "radial-gradient(closest-side, rgba(229,200,148,0.35), transparent)",
                      }}
                    />
                    {/* Glass case */}
                    <div
                      className="relative aspect-[5/4] overflow-hidden rounded-sm"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(229,200,148,0.06) 0%, rgba(11,16,20,0.4) 50%, rgba(11,16,20,0) 100%)",
                        border: "1px solid rgba(229,200,148,0.18)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.08), 0 60px 120px -40px rgba(0,0,0,0.8)",
                      }}
                    >
                      <Image
                        src={hero.images[0]}
                        alt={hero.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      {/* Glass highlight */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 100%)",
                        }}
                      />
                      {/* Caption */}
                      <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between text-[11px] uppercase tracking-[0.24em]"
                        style={{ color: "rgba(232,232,224,0.85)" }}>
                        <div>
                          <p style={{ color: "#E5C894" }}>Lot 001 / Featured</p>
                          <p className="font-display normal-case tracking-tight mt-1.5"
                            style={{ fontSize: "1.25rem", color: "#E8E8E0" }}>
                            {hero.name}
                          </p>
                        </div>
                        <p>{hero.scale}</p>
                      </div>
                    </div>

                    {/* Specifications strip */}
                    <div className="mt-6 grid grid-cols-3 gap-px rounded-sm overflow-hidden"
                      style={{ background: "rgba(229,200,148,0.12)" }}>
                      {[
                        { label: "Maison", value: hero.brand ?? "—" },
                        { label: "Scale", value: hero.scale ?? "—" },
                        { label: "Edition", value: hero.is_limited_edition ? "Limited" : "Curated" },
                      ].map((s) => (
                        <div key={s.label} className="px-5 py-4" style={{ background: "#0B1014" }}>
                          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#8C8C84" }}>
                            {s.label}
                          </p>
                          <p className="mt-1.5 font-display text-base" style={{ color: "#E8E8E0" }}>
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </figure>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Trophy case grid */}
        <section className="relative mt-32 lg:mt-48" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12 lg:mb-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: "#E5C894" }}>
                  The Vault
                </p>
                <h2 className="font-display tracking-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", fontWeight: 600 }}>
                  Currently <em style={{ fontStyle: "italic", color: "#E5C894", fontWeight: 500 }}>on display</em>
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]" style={{ color: "#8C8C84" }}>
                <Compass className="h-3.5 w-3.5" />
                Use ← → to browse
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {featured.slice(0, 8).map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group relative block aspect-[3/4] rounded-sm overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229,200,148,0.05), rgba(11,16,20,0.4))",
                    border: "1px solid rgba(229,200,148,0.12)",
                  }}
                >
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  )}
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-[60%]"
                    style={{ background: "linear-gradient(180deg, transparent, rgba(11,16,20,0.95))" }} />
                  {/* Lot number */}
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: "#E5C894" }}>
                    Lot {String(i + 1).padStart(3, "0")}
                  </span>
                  {/* Glass corner */}
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full"
                    style={{ background: "rgba(229,200,148,0.4)", boxShadow: "0 0 12px rgba(229,200,148,0.5)" }} />
                  {/* Caption */}
                  <div className="absolute left-4 right-4 bottom-4">
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#A8A8A0" }}>
                      {product.brand} · {product.scale}
                    </p>
                    <p className="mt-1 font-display tracking-tight line-clamp-1"
                      style={{ fontSize: "0.95rem", color: "#E8E8E0" }}>
                      {product.name}
                    </p>
                    <p className="mt-2 text-[11px]" style={{ color: "#E5C894" }}>
                      OMR {product.price.toFixed(3)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Single spotlight — second limited */}
        {second && (
          <section className="relative mt-32 lg:mt-48" style={{ zIndex: 1 }}>
            <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
              <div
                className="relative overflow-hidden rounded-sm grid grid-cols-12"
                style={{
                  background: "linear-gradient(135deg, #0F1518 0%, #0B1014 100%)",
                  border: "1px solid rgba(229,200,148,0.18)",
                }}
              >
                <div className="col-span-12 lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[600px]">
                  {second.images?.[0] && (
                    <Image
                      src={second.images[0]}
                      alt={second.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent 50%, rgba(11,16,20,0.6))" }} />
                </div>
                <div className="col-span-12 lg:col-span-5 p-10 lg:p-16 flex flex-col justify-center">
                  <p className="text-[11px] uppercase tracking-[0.4em]" style={{ color: "#E5C894" }}>
                    Concours Selection
                  </p>
                  <h3 className="mt-6 font-display tracking-tight"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: "1.0", fontWeight: 600 }}>
                    {second.name}
                  </h3>
                  <p className="mt-6 text-base leading-[1.7]" style={{ color: "#C9C7BE" }}>
                    {second.description}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-px rounded-sm overflow-hidden"
                    style={{ background: "rgba(229,200,148,0.12)" }}>
                    <div className="p-4" style={{ background: "#0B1014" }}>
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#8C8C84" }}>Maison</p>
                      <p className="mt-1 font-display" style={{ color: "#E8E8E0" }}>{second.brand}</p>
                    </div>
                    <div className="p-4" style={{ background: "#0B1014" }}>
                      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "#8C8C84" }}>Edition</p>
                      <p className="mt-1 font-display" style={{ color: "#E8E8E0" }}>
                        {second.is_limited_edition ? "Numbered" : "Curated"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/products/${second.id}`}
                    className="mt-10 inline-flex items-center justify-between h-14 px-6 rounded-sm text-sm uppercase tracking-[0.24em] border w-fit"
                    style={{
                      borderColor: "rgba(229,200,148,0.4)",
                      color: "#E5C894",
                    }}
                  >
                    View this lot &nbsp; <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="relative mt-32 pt-16 pb-12" style={{ zIndex: 1, borderTop: "1px solid rgba(229,200,148,0.15)" }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-5">
              <p className="font-display" style={{ fontSize: "1.75rem", fontWeight: 600 }}>
                Diecast <em style={{ color: "#E5C894", fontStyle: "italic" }}>Muscat</em>
              </p>
              <p className="mt-3 max-w-sm text-sm" style={{ color: "#8C8C84" }}>
                A concours of authenticated die-cast objects, sourced for the discerning collector
                across Oman and the GCC.
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.32em] mb-4" style={{ color: "#E5C894" }}>
                Concourse
              </p>
              <ul className="space-y-2 text-sm" style={{ color: "#A8A8A0" }}>
                <li>The Vault</li>
                <li>Lots</li>
                <li>Provenance</li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.32em] mb-4" style={{ color: "#E5C894" }}>Atelier</p>
              <ul className="space-y-2 text-sm" style={{ color: "#A8A8A0" }}>
                <li>Authentication</li>
                <li>Insurance</li>
                <li>Restoration</li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-3 md:text-right text-xs" style={{ color: "#6F6F68" }}>
              <p>© MMXXVI Diecast Muscat. Sultanate of Oman.</p>
              <Link href="/preview" className="mt-3 inline-flex items-center gap-1.5" style={{ color: "#E5C894" }}>
                <ArrowLeft className="h-3 w-3" /> Other studies
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display tracking-tight" style={{ fontSize: "1.75rem", color: "#E5C894", fontWeight: 600 }}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.28em]" style={{ color: "#8C8C84" }}>
        {label}
      </p>
    </div>
  );
}
