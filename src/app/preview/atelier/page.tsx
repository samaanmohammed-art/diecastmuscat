import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Ruler } from "lucide-react";
import { fetchFeaturedProducts, fetchLimitedProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "III — Atelier Blueprint · Diecast Muscat",
  robots: { index: false, follow: false },
};

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

export default async function AtelierPreview() {
  const [featured, limited] = await Promise.all([
    fetchFeaturedProducts(6),
    fetchLimitedProducts(1),
  ]);
  const hero = limited[0] ?? featured[0];
  const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          background: "#F5F4EE",
          color: "#1E1E1E",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Blueprint grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,90,138,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,90,138,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            zIndex: 0,
          }}
        />

        {/* Top bar */}
        <header
          className="sticky top-0 z-30"
          style={{
            background: "rgba(245,244,238,0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #1E1E1E",
          }}
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-14 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "#1E5A8A", fontFamily: MONO }}
            >
              <ArrowLeft className="h-3 w-3" /> ../studies
            </Link>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center h-7 w-7 border"
                style={{ borderColor: "#1E1E1E" }}
              >
                <span className="font-display text-sm" style={{ color: "#1E5A8A" }}>D</span>
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.32em]"
                style={{ fontFamily: MONO, color: "#1E1E1E" }}
              >
                DIECAST.MUSCAT.ATELIER
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em]"
              style={{ fontFamily: MONO, color: "#1E5A8A" }}>
              <span>REV.03</span>
              <span style={{ color: "#1E1E1E" }}>·</span>
              <span>2026.05.07</span>
            </div>
          </div>
        </header>

        {/* Document header */}
        <section className="relative" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-10 pb-6 border-b" style={{ borderColor: "#1E1E1E" }}>
            <div className="grid grid-cols-12 gap-4 text-[10px] uppercase tracking-[0.24em]"
              style={{ fontFamily: MONO, color: "#1E5A8A" }}>
              <Field label="Document" value="DM-CAT-V03" />
              <Field label="Issued" value="07 / 05 / 2026" />
              <Field label="Format" value="Catalogue" />
              <Field label="Plates" value={`${featured.length + 1} of 12`} />
              <Field label="Drafted" value="Muscat, OM" />
              <Field label="Sheet" value="01 / 03" />
            </div>
          </div>
        </section>

        {/* Hero — schematic plate */}
        <section className="relative" style={{ zIndex: 1 }}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 pt-16 lg:pt-24 pb-24">
            <p
              className="mb-6 text-[10px] uppercase tracking-[0.4em]"
              style={{ fontFamily: MONO, color: "#1E5A8A" }}
            >
              Plate 01 — Featured Object
            </p>
            <h1
              className="font-display tracking-[-0.025em]"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 7.5rem)",
                lineHeight: "0.92",
                fontWeight: 700,
              }}
            >
              Engineering, <em style={{ fontStyle: "italic", color: "#1E5A8A" }}>at scale.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base lg:text-lg leading-[1.7]" style={{ color: "#3A3A3A" }}>
              A drafted catalogue of authenticated die-cast objects. Every piece presented as it
              would be in our atelier — with provenance, dimension and the maker's mark.
            </p>

            {hero && (
              <div className="mt-20 grid grid-cols-12 gap-6 lg:gap-10">
                {/* Schematic image with dimension lines */}
                <div className="col-span-12 lg:col-span-8 relative">
                  <div className="relative">
                    {/* Dimension lines */}
                    <SchematicAnnotations />
                    <div
                      className="relative aspect-[16/10] overflow-hidden"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #1E1E1E",
                      }}
                    >
                      {hero.images?.[0] && (
                        <Image
                          src={hero.images[0]}
                          alt={hero.name}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          className="object-contain p-12"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      )}
                    </div>
                    {/* Corner registration marks */}
                    {[
                      "top-1.5 left-1.5",
                      "top-1.5 right-1.5",
                      "bottom-1.5 left-1.5",
                      "bottom-1.5 right-1.5",
                    ].map((pos) => (
                      <span key={pos} className={`absolute ${pos} h-2.5 w-2.5 border`}
                        style={{ borderColor: "#1E5A8A" }} />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.28em]"
                    style={{ fontFamily: MONO, color: "#1E5A8A" }}>
                    <span>FIG. 01 — {hero.name}, in {hero.scale ?? "scale"}</span>
                    <span>NTS</span>
                  </div>
                </div>

                {/* Provenance plate */}
                <aside className="col-span-12 lg:col-span-4">
                  <div
                    className="p-6 lg:p-8 h-full flex flex-col"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #1E1E1E",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.32em] mb-1"
                      style={{ fontFamily: MONO, color: "#1E5A8A" }}
                    >
                      Provenance Plate
                    </p>
                    <h2 className="font-display text-xl lg:text-2xl tracking-tight">
                      {hero.name}
                    </h2>
                    <p
                      className="mt-1 text-[11px] uppercase tracking-[0.24em]"
                      style={{ fontFamily: MONO, color: "#3A3A3A" }}
                    >
                      SKU · {hero.sku}
                    </p>

                    <dl className="mt-6 space-y-3 flex-1">
                      <Spec label="Maker" value={hero.brand ?? "—"} />
                      <Spec label="Scale" value={hero.scale ?? "—"} />
                      <Spec label="Category" value={hero.category} />
                      <Spec label="Condition" value={hero.condition} />
                      <Spec
                        label="Edition"
                        value={hero.is_limited_edition ? "Numbered" : "Series"}
                      />
                      <Spec label="In Stock" value={`${hero.stock} units`} />
                    </dl>

                    {hero.description && (
                      <p className="mt-6 pt-6 border-t text-sm leading-relaxed"
                        style={{ borderColor: "#1E1E1E", color: "#3A3A3A" }}>
                        {hero.description}
                      </p>
                    )}

                    <div className="mt-8 grid grid-cols-3 gap-px"
                      style={{ background: "#1E1E1E" }}>
                      <div className="px-4 py-3 col-span-2" style={{ background: "#FFFFFF" }}>
                        <p className="text-[10px] uppercase tracking-[0.24em]"
                          style={{ fontFamily: MONO, color: "#1E5A8A" }}>Listed</p>
                        <p className="font-display text-2xl">
                          OMR {hero.price.toFixed(3)}
                        </p>
                      </div>
                      <Link
                        href={`/products/${hero.id}`}
                        className="px-3 flex items-center justify-center text-[10px] uppercase tracking-[0.28em]"
                        style={{
                          background: "#1E5A8A",
                          color: "#F5F4EE",
                          fontFamily: MONO,
                        }}
                      >
                        View
                      </Link>
                    </div>

                    <p className="mt-6 text-[10px] uppercase tracking-[0.24em]"
                      style={{ fontFamily: MONO, color: "#7A7A6E" }}>
                      Drafted by hand · Muscat 2026
                    </p>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>

        {/* Plates index */}
        <section className="relative" style={{ zIndex: 1, background: "#1E1E1E", color: "#F5F4EE" }}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-20 lg:py-28">
            <div className="flex items-end justify-between mb-12 pb-6 border-b" style={{ borderColor: "rgba(245,244,238,0.25)" }}>
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.4em] mb-3"
                  style={{ fontFamily: MONO, color: "#88B6E0" }}
                >
                  Sheet 02 — Plates II–VII
                </p>
                <h2 className="font-display tracking-tight"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", fontWeight: 700 }}>
                  The current <em style={{ fontStyle: "italic", color: "#88B6E0" }}>register</em>
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em]"
                style={{ fontFamily: MONO, color: "#88B6E0" }}
              >
                Open full register <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "rgba(245,244,238,0.15)" }}>
              {featured.slice(0, 6).map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group p-6 lg:p-8 flex flex-col gap-5"
                  style={{ background: "#1E1E1E" }}
                >
                  <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.28em]"
                    style={{ fontFamily: MONO, color: "#88B6E0" }}>
                    <span>Plate {String(i + 2).padStart(2, "0")} / {product.scale}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{
                      background: "#F5F4EE",
                      border: "1px solid rgba(245,244,238,0.18)",
                    }}
                  >
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    )}
                    {/* registration corners */}
                    {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((p) => (
                      <span key={p} className={`absolute ${p} h-2 w-2 border`}
                        style={{ borderColor: "#1E5A8A" }} />
                    ))}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em]"
                      style={{ fontFamily: MONO, color: "#9DA5B0" }}>
                      {product.brand}
                    </p>
                    <h3 className="mt-1.5 font-display tracking-tight" style={{ fontSize: "1.25rem" }}>
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between mt-auto pt-4 border-t"
                    style={{ borderColor: "rgba(245,244,238,0.15)" }}>
                    <p className="text-[10px] uppercase tracking-[0.24em]"
                      style={{ fontFamily: MONO, color: "#88B6E0" }}>
                      Stock · {product.stock}
                    </p>
                    <p className="font-display text-lg" style={{ color: "#F5F4EE" }}>
                      OMR {product.price.toFixed(3)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Process / methodology strip */}
        <section className="relative" style={{ zIndex: 1, background: "#F5F4EE" }}>
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-20 lg:py-28">
            <p
              className="text-[10px] uppercase tracking-[0.4em] mb-6"
              style={{ fontFamily: MONO, color: "#1E5A8A" }}
            >
              Sheet 03 — Methodology
            </p>
            <h2 className="font-display tracking-[-0.02em] max-w-3xl"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: "1.0", fontWeight: 700 }}>
              Authenticate. Photograph. Box. <em style={{ fontStyle: "italic", color: "#1E5A8A" }}>Sign.</em>
            </h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px"
              style={{ background: "#1E1E1E", border: "1px solid #1E1E1E" }}>
              {[
                {
                  step: "01",
                  title: "Source",
                  body:
                    "Direct from six maisons. Every piece traced to the maker — never grey-market.",
                },
                {
                  step: "02",
                  title: "Authenticate",
                  body:
                    "Each item is opened, inspected, photographed, and sealed by our atelier in Muscat.",
                },
                {
                  step: "03",
                  title: "Catalogue",
                  body:
                    "We record provenance, condition and edition. Sketched, measured, plated.",
                },
                {
                  step: "04",
                  title: "Despatch",
                  body:
                    "Wrapped in archival tissue, signed, dated, and delivered across the Sultanate.",
                },
              ].map((s) => (
                <div key={s.step} className="p-6 lg:p-8" style={{ background: "#F5F4EE" }}>
                  <p
                    className="font-display tracking-tight leading-none"
                    style={{ fontSize: "3.5rem", color: "#1E5A8A", fontWeight: 700, fontStyle: "italic" }}
                  >
                    {s.step}
                  </p>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.28em]"
                    style={{ fontFamily: MONO, color: "#1E5A8A" }}>
                    Step {s.step}
                  </p>
                  <h3 className="mt-1 font-display text-xl" style={{ fontWeight: 600 }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6]" style={{ color: "#3A3A3A" }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer / drawing block */}
        <footer
          className="relative"
          style={{
            zIndex: 1,
            background: "#F5F4EE",
            borderTop: "2px solid #1E1E1E",
          }}
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-[10px] uppercase tracking-[0.28em]"
            style={{ fontFamily: MONO, color: "#1E1E1E" }}>
            <div>
              <p style={{ color: "#1E5A8A" }}>Title</p>
              <p className="mt-1">Diecast Muscat — Catalogue Vol. III</p>
            </div>
            <div>
              <p style={{ color: "#1E5A8A" }}>Drafted</p>
              <p className="mt-1">07 May 2026 · Muscat, OM</p>
            </div>
            <div>
              <p style={{ color: "#1E5A8A" }}>Specimen</p>
              <p className="mt-1">{featured.length + 1} plates registered</p>
            </div>
            <div className="md:text-right flex md:justify-end">
              <Link
                href="/preview"
                className="inline-flex items-center gap-1.5"
                style={{ color: "#1E5A8A" }}
              >
                <Ruler className="h-3 w-3" /> Other studies
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-6 md:col-span-2">
      <p style={{ color: "#7A7A6E" }}>{label}</p>
      <p className="mt-0.5" style={{ color: "#1E1E1E" }}>{value}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 items-baseline pb-2 border-b"
      style={{ borderColor: "#E5E0D5" }}>
      <dt className="text-[10px] uppercase tracking-[0.24em]"
        style={{ fontFamily: "ui-monospace, monospace", color: "#1E5A8A" }}>
        {label}
      </dt>
      <dd className="text-sm" style={{ color: "#1E1E1E", textTransform: "capitalize" }}>
        {value}
      </dd>
    </div>
  );
}

function SchematicAnnotations() {
  return (
    <>
      {/* Top dimension line */}
      <div className="absolute -top-7 left-0 right-0 h-3 flex items-center pointer-events-none">
        <div className="h-px flex-1" style={{ background: "#1E5A8A" }} />
        <span className="px-2 text-[10px] uppercase tracking-[0.28em]"
          style={{ fontFamily: "ui-monospace, monospace", color: "#1E5A8A", background: "#F5F4EE" }}>
          OVERALL
        </span>
        <div className="h-px flex-1" style={{ background: "#1E5A8A" }} />
      </div>
      {/* Tick marks */}
      <span className="absolute -top-7 left-0 w-px h-3" style={{ background: "#1E5A8A" }} />
      <span className="absolute -top-7 right-0 w-px h-3" style={{ background: "#1E5A8A" }} />
      {/* Left dimension line */}
      <div className="absolute -left-7 top-0 bottom-0 w-3 flex flex-col items-center pointer-events-none">
        <div className="w-px flex-1" style={{ background: "#1E5A8A" }} />
        <span className="py-2 text-[10px] uppercase tracking-[0.28em] -rotate-90 whitespace-nowrap"
          style={{ fontFamily: "ui-monospace, monospace", color: "#1E5A8A", background: "#F5F4EE" }}>
          PROFILE
        </span>
        <div className="w-px flex-1" style={{ background: "#1E5A8A" }} />
      </div>
      <span className="absolute -left-7 top-0 h-px w-3" style={{ background: "#1E5A8A" }} />
      <span className="absolute -left-7 bottom-0 h-px w-3" style={{ background: "#1E5A8A" }} />
    </>
  );
}
