import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { fetchFeaturedProducts, fetchLimitedProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "I — Editorial Ivory · Diecast Muscat",
  robots: { index: false, follow: false },
};

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

export default async function EditorialPreview() {
  const [featured, limited] = await Promise.all([
    fetchFeaturedProducts(6),
    fetchLimitedProducts(1),
  ]);
  const hero = limited[0] ?? featured[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          background: "#F8F6F1",
          color: "#0E0E0E",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(900px 600px at 80% -10%, rgba(155,58,42,0.06), transparent 70%)",
          }}
        />

        {/* Top bar */}
        <header
          className="sticky top-0 z-30 backdrop-blur-md"
          style={{ background: "rgba(248,246,241,0.85)", borderBottom: "1px solid #E5E0D5" }}
        >
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 h-16 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em]"
              style={{ color: "#6E5A4A" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Studies
            </Link>
            <div className="font-display text-sm tracking-[0.4em] uppercase">DIECAST MUSCAT</div>
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em]" style={{ color: "#6E5A4A" }}>
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">⌘K</span>
            </div>
          </div>
        </header>

        {/* Masthead */}
        <section className="relative">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 pt-12 lg:pt-20">
            <div className="flex items-end justify-between gap-6 pb-6"
              style={{ borderBottom: "1px solid #1E1E1E" }}>
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "#9B3A2A" }}>
                  Volume I · Issued from Muscat
                </p>
                <p className="text-[10px] tracking-[0.32em] uppercase mt-1" style={{ color: "#6E5A4A" }}>
                  Spring · Twenty Twenty Six
                </p>
              </div>
              <p className="hidden md:block text-[10px] tracking-[0.32em] uppercase" style={{ color: "#6E5A4A" }}>
                Volume One — Number Three
              </p>
            </div>
          </div>
        </section>

        {/* Hero — asymmetric editorial */}
        <section className="relative">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 pt-20 lg:pt-28 pb-24 lg:pb-40">
            <div className="grid grid-cols-12 gap-6 lg:gap-12 items-end">
              {/* Massive issue number */}
              <div className="col-span-12 lg:col-span-2">
                <p
                  className="font-display leading-none"
                  style={{ fontSize: "min(28vw, 12rem)", color: "#9B3A2A", fontStyle: "italic", fontWeight: 800 }}
                >
                  01
                </p>
              </div>

              {/* Headline + lede */}
              <div className="col-span-12 lg:col-span-6 lg:pb-8">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: "#9B3A2A" }}>
                  The Curator's Letter
                </p>
                <h1 className="font-display leading-[0.92] tracking-[-0.02em]" style={{ fontSize: "clamp(2.75rem, 6vw, 6.5rem)", fontWeight: 800 }}>
                  We sell <em style={{ fontStyle: "italic" }}>memory</em>,
                  <br /> in 1:18 scale.
                </h1>
                <div className="mt-10 max-w-md">
                  <p className="text-base leading-[1.7]" style={{ color: "#1E1E1E" }}>
                    A model is not a toy. It is the first time you saw the car that became your
                    obsession, set in metal at the size of a jewellery box. We hand-curate twelve
                    pieces a season, photograph them honestly, and ship them sealed, mint, and
                    boxed in archival paper.
                  </p>
                  <p className="mt-6 text-sm tracking-[0.18em] uppercase" style={{ color: "#9B3A2A" }}>
                    — The House of Muscat
                  </p>
                </div>
              </div>

              {/* Hero image — single piece */}
              <div className="col-span-12 lg:col-span-4">
                {hero?.images?.[0] && (
                  <figure>
                    <div
                      className="relative aspect-[4/5] overflow-hidden"
                      style={{ background: "#EDEAE3", border: "1px solid #1E1E1E" }}
                    >
                      <Image
                        src={hero.images[0]}
                        alt={hero.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-4 grid grid-cols-[auto,1fr] gap-x-4 text-xs" style={{ color: "#6E5A4A" }}>
                      <span className="uppercase tracking-[0.24em]">Plate 01</span>
                      <span className="font-display italic" style={{ color: "#1E1E1E" }}>
                        {hero.name}, photographed under daylight in our Muscat studio.
                      </span>
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Hairline + section heading */}
        <section style={{ background: "#0E0E0E", color: "#F8F6F1" }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 py-20 lg:py-32">
            <div className="grid grid-cols-12 gap-6 lg:gap-12">
              <div className="col-span-12 lg:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: "#E5C894" }}>
                  The Provenance
                </p>
                <h2 className="font-display leading-[0.95]" style={{ fontSize: "clamp(2rem, 4.5vw, 4.5rem)", fontWeight: 700 }}>
                  Six houses. <em style={{ fontStyle: "italic", color: "#E5C894" }}>One ear.</em>
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                <div className="columns-1 md:columns-2 gap-10 text-base leading-[1.8]" style={{ color: "#C9C7BE" }}>
                  <p>
                    Bburago, Minichamps, Tekno, Maisto, Herpa, AutoArt — six houses make almost
                    everything worth owning. Most stores carry all of them, all of the time, with
                    no opinion. We carry the pieces that rewarded the engineering.
                  </p>
                  <p className="mt-4">
                    Every piece is verified mint or sealed. Numbered editions arrive with their
                    certificate. Every shipment is wrapped in archival tissue and a note from the
                    house, hand-signed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial product spread */}
        <section className="relative" style={{ background: "#F8F6F1" }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 py-24 lg:py-40">
            <div className="flex items-end justify-between mb-16 pb-6" style={{ borderBottom: "1px solid #1E1E1E" }}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: "#9B3A2A" }}>
                  Folio II — The Selection
                </p>
                <h2 className="font-display tracking-[-0.02em]" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", fontWeight: 800 }}>
                  This season, twelve pieces.
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] pb-2"
                style={{ color: "#9B3A2A" }}
              >
                See all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-10">
              {featured.slice(0, 6).map((product, i) => {
                const wide = i === 0 || i === 3;
                const tall = i === 1;
                return (
                  <article
                    key={product.id}
                    className={[
                      "col-span-12",
                      wide ? "lg:col-span-7" : tall ? "lg:col-span-5" : "lg:col-span-4",
                      i === 2 ? "lg:col-start-6" : "",
                    ].join(" ")}
                  >
                    <Link href={`/products/${product.id}`} className="block group">
                      <div
                        className="relative overflow-hidden"
                        style={{
                          background: "#EDEAE3",
                          border: "1px solid #1E1E1E",
                          aspectRatio: tall ? "3/4" : wide ? "4/3" : "1/1",
                        }}
                      >
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-[auto,1fr,auto] items-baseline gap-x-4">
                        <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: "#6E5A4A" }}>
                          Plate {String(i + 2).padStart(2, "0")}
                        </span>
                        <h3 className="font-display tracking-tight truncate" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                          {product.name}
                        </h3>
                        <span style={{ color: "#9B3A2A", fontWeight: 500 }}>
                          OMR {product.price.toFixed(3)}
                        </span>
                      </div>
                      {product.brand && (
                        <p className="mt-1 text-xs italic" style={{ color: "#6E5A4A" }}>
                          {product.brand} — {product.scale}
                        </p>
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer / colophon */}
        <footer className="border-t" style={{ borderColor: "#1E1E1E", background: "#F8F6F1" }}>
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12 py-16 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <p className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                Diecast Muscat
              </p>
              <p className="text-xs mt-2 italic" style={{ color: "#6E5A4A" }}>
                A house for the discerning collector.
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "#9B3A2A" }}>House</p>
              <ul className="space-y-1.5 text-sm">
                <li>The Letter</li>
                <li>Provenance</li>
                <li>The Selection</li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "#9B3A2A" }}>Service</p>
              <ul className="space-y-1.5 text-sm">
                <li>Authentication</li>
                <li>Shipping</li>
                <li>Returns</li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right text-xs" style={{ color: "#6E5A4A" }}>
              <p>Set in Playfair Display & Inter.</p>
              <p className="mt-1">Sultanate of Oman, MMXXVI.</p>
              <Link href="/preview" className="mt-3 inline-flex items-center gap-1.5" style={{ color: "#9B3A2A" }}>
                <ArrowLeft className="h-3 w-3" /> Other studies
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
