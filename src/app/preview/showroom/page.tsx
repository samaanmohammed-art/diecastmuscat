import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { fetchProducts, fetchLimitedProducts } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/lib/preview-mock";
import { DrawerStack, type Drawer } from "./DrawerStack";

export const metadata: Metadata = {
  title: "II — Concourse Cupboard · Diecast Muscat",
  robots: { index: false, follow: false },
};

const HIDE_CHROME_CSS = `
  body > div > header.sticky,
  body > div > footer,
  body > div [aria-label="Open chat"] { display: none !important; }
  body > div > main { min-height: auto !important; }
`;

export default async function ShowroomPreview() {
  const [carsRes, planesRes, trucksRes, bikesRes, limitedLive] =
    await Promise.all([
      fetchProducts({ category: "cars", limit: 12 }),
      fetchProducts({ category: "planes", limit: 12 }),
      fetchProducts({ category: "trucks", limit: 12 }),
      fetchProducts({ category: "bikes", limit: 12 }),
      fetchLimitedProducts(12),
    ]);

  const drawers: Drawer[] = [
    {
      id: "limited",
      label: "Numbered editions",
      sublabel: "Allocated only",
      products: limitedLive.length ? limitedLive : MOCK_PRODUCTS.limited,
    },
    {
      id: "cars",
      label: "Cars",
      sublabel: "Hypercars & GTs",
      products: carsRes.products.length ? carsRes.products : MOCK_PRODUCTS.cars,
    },
    {
      id: "planes",
      label: "Aviation",
      sublabel: "Civil & military",
      products: planesRes.products.length ? planesRes.products : MOCK_PRODUCTS.planes,
    },
    {
      id: "trucks",
      label: "Heavy haul",
      sublabel: "European cabs",
      products: trucksRes.products.length ? trucksRes.products : MOCK_PRODUCTS.trucks,
    },
    {
      id: "bikes",
      label: "Two wheels",
      sublabel: "Track & cruise",
      products: bikesRes.products.length ? bikesRes.products : MOCK_PRODUCTS.bikes,
    },
  ];

  const featurePiece =
    (limitedLive.length ? limitedLive : MOCK_PRODUCTS.limited)[0] ??
    MOCK_PRODUCTS.featured[0];

  const totalCount = drawers.reduce((sum, d) => sum + d.products.length, 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_CHROME_CSS }} />

      <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg text-text font-sans">
        <div className="absolute inset-0 bg-grid-faint pointer-events-none" />
        <div
          className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 500px at 70% 20%, rgba(212,175,55,0.10), transparent 70%)",
          }}
        />

        <header className="sticky top-0 z-30 backdrop-blur-xl bg-bg/70 border-b border-border">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Studies
            </Link>
            <div className="font-display text-sm tracking-[0.32em] uppercase">
              Diecast Muscat
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              {String(totalCount).padStart(2, "0")} on shelf
            </div>
          </div>
        </header>

        <section className="relative">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 lg:pt-20 pb-12 lg:pb-16">
            <div className="grid grid-cols-12 gap-6 lg:gap-12 items-end">
              <div className="col-span-12 lg:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold mb-5 flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-gold/60" />
                  Concours edition · Vol. III
                </p>
                <h1
                  className="font-display tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(2.5rem, 7.5vw, 6rem)",
                    lineHeight: "0.95",
                    fontWeight: 600,
                  }}
                >
                  Built to be
                  <br />
                  <em className="not-italic text-gradient-gold font-display italic">
                    remembered.
                  </em>
                </h1>
                <p className="mt-5 lg:mt-7 max-w-md text-sm lg:text-base leading-relaxed text-text-muted">
                  A cabinet of authenticated die-cast objects, sourced direct from
                  six maisons. Open a drawer to browse.
                </p>

                <div className="mt-7 lg:mt-10 flex items-center gap-3 flex-wrap">
                  <a
                    href="#cupboard"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-sm bg-gold text-bg font-mono text-[11px] uppercase tracking-[0.28em] hover:bg-gold-bright transition-colors"
                  >
                    Open the cupboard
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
                    {drawers.length} drawers · {totalCount} pieces
                  </span>
                </div>
              </div>

              {featurePiece && (
                <aside className="col-span-12 lg:col-span-5 hidden lg:block">
                  <figure className="relative card-luxury overflow-hidden">
                    <div className="relative aspect-[5/4] bg-surface-elevated">
                      {featurePiece.images?.[0] && (
                        <Image
                          src={featurePiece.images[0]}
                          alt={featurePiece.name}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.32em] text-gold">
                        Lot 001 · Front of house
                      </span>
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
                          {featurePiece.brand} · {featurePiece.scale}
                        </p>
                        <h3 className="mt-1 font-display text-2xl leading-tight">
                          {featurePiece.name}
                        </h3>
                      </div>
                    </div>
                  </figure>
                </aside>
              )}
            </div>
          </div>
        </section>

        <section
          id="cupboard"
          className="relative scroll-mt-16"
        >
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-12 pb-24">
            <div className="flex items-baseline justify-between mb-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-muted">
                The cupboard
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
                Tap to open
              </p>
            </div>
            <div className="hairline-gold mb-2" />
            <DrawerStack drawers={drawers} defaultOpenId="limited" />
          </div>
        </section>

        <footer className="relative border-t border-border">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
            <p className="font-display text-sm tracking-[0.28em] uppercase">
              Diecast Muscat
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              Sultanate of Oman · 2026
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
