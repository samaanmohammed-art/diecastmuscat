# Diecast Muscat — Project Plan

## Current Status (as of May 2026)

**Branch:** `claude/ecommerce-mobile-redesign` (merged to `main`)
**Live URL:** https://diecast-muscat.vercel.app/
**Verdict:** B+/A− — luxury aesthetic is strong, mobile chrome is production-grade, architecture is sound. Not yet world-class for high-value GCC commerce.

### What's shipped
- Full mobile-first redesign: BottomNav (5 tabs), StickyCartBar, StickyPDPBar, MobileSearchSheet
- ProductCard with QuickView modal (Radix Dialog bottom-sheet on mobile)
- Wishlist + recently-viewed via Zustand persist stores
- Suspense streaming on /products with skeleton fallback
- PDP: full-bleed gallery, low-stock pulse, reassurance tiles, related shelf
- AIChat concierge (desktop-only, hidden on mobile)
- Supabase SSR auth with `proxy.ts` pattern
- PDF invoice generation via `pdf-lib`

---

## $250K Roadmap — 4 Phases

### Phase 1 — Trust Foundation (~$60K, weeks 1–4)
The single highest-leverage investment. Without these, no one buys a 245 OMR Bugatti from a stranger.

| # | Task | Files |
|---|------|-------|
| 1.1 | Real product photography pipeline — 360° spinner (36 frames/SKU), 5+ angles, scale-reference photo | `src/components/products/Product360.tsx` (new), `ProductGallery.tsx` update; Supabase: add `images_360: string[]` column |
| 1.2 | Reviews system — email post-delivery request (Resend), photo upload, verified-purchase badge, star histogram | `src/components/products/Reviews.tsx` (new), `src/app/api/reviews/route.ts` (new); wire existing `reviews` table |
| 1.3 | Certificate of authenticity PDF — generated on order delivery, downloadable from `/account/orders/[id]`, QR code linking to SKU | `src/lib/certificate.ts` (new), `pdf-lib` already in deps |
| 1.4 | Founder/atelier `/about` page — founder story, inspection process, provenance | `src/app/(customer)/about/page.tsx` (new) |
| 1.5 | Trust strip in checkout — Stripe/Tap badges, SSL, return policy summary | `src/app/(customer)/checkout/page.tsx` update |

### Phase 2 — Localization + Payments (~$60K, weeks 4–8)
Without Arabic + COD, the GCC TAM is closed.

| # | Task | Files |
|---|------|-------|
| 2.1 | Arabic + English with RTL — `next-intl` integration, `messages/en.json` + `messages/ar.json`, logical Tailwind properties | `src/middleware.ts` (locale detection), `next.config.ts`, all page components |
| 2.2 | Tap Payments + Apple Pay + Google Pay + COD — Tap is the GCC checkout, accepts KNET/mada/OmanNet | `src/lib/payments/tap.ts` (new), `/checkout` refactor; `orders.payment_method` already in schema |
| 2.3 | Phone OTP login — Supabase Phone Auth, Twilio backend | Auth pages update; Supabase Phone Auth enable |
| 2.4 | Currency switcher — OMR/AED/SAR/KWD with daily FX snapshot | `src/lib/currency.ts` (new) |

### Phase 3 — Discovery + Conversion (~$60K, weeks 8–12)

| # | Task | Files |
|---|------|-------|
| 3.1 | Live search with typo tolerance — MeiliSearch or Algolia, autocomplete with thumbnails | `src/lib/search/meilisearch.ts` (new), `MobileSearchSheet.tsx` refactor |
| 3.2 | Recommendations engine — cosine similarity on embeddings (OpenAI text-embedding-3-small) | `src/lib/recommendations.ts` (new), new home shelf |
| 3.3 | /compare?ids=a,b — side-by-side spec table, photo overlay | `src/app/(customer)/compare/page.tsx` (new) |
| 3.4 | Real-time stock + "X viewing" — Supabase Realtime per product | `StickyPDPBar.tsx` update |
| 3.5 | Conversion polish — cart abandonment email (Resend), save-for-later, free-shipping progress bar | Cart + checkout updates |

### Phase 4 — Operations + Content (~$70K, weeks 12–14)

| # | Task | Files |
|---|------|-------|
| 4.1 | Aramex/DHL carrier integration — live tracking on `/account/orders/[id]`, push notifications | `src/lib/carriers/aramex.ts` (new) |
| 4.2 | Admin → CMS — drag-reorder home shelves, schedule by date range | `src/app/(admin)/admin/cms/*` (new) |
| 4.3 | /journal — MDX articles, SEO structured data, sitemap | `src/app/journal/*` (new) |
| 4.4 | PWA + push — manifest, service worker, install prompt | `public/manifest.json`, `public/sw.js` |
| 4.5 | Lighthouse 95+ + WCAG AA — keyboard nav, contrast, ARIA, blur placeholders at build | Across all pages |
| 4.6 | Loyalty: "The Concourse Circle" — Initiate / Curator / Patron tiers | `src/lib/loyalty.ts` (new) |

### Out of scope at $250K
- Native iOS/Android apps (PWA covers 90% of need)
- Live chat agents (AIChat concierge covers this)
- Auction/bidding mechanic
- Crypto checkout
