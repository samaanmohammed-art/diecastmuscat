# Morning report — mobile-first e-commerce redesign

**Branch:** `claude/ecommerce-mobile-redesign`
**Commits:** 5 (newest → oldest)
**Build:** ✓ green (`npm run build`, exit 0)
**Lint:** ✓ all my code passes; 3 pre-existing errors on `main` untouched
**Status:** pushed to origin, Vercel will auto-deploy a preview URL on PR open

```
e47b4f1  fix(hydration): useSyncExternalStore-based useMounted hook
2faebba  feat(plp): mobile-first product listing with sticky pill bar
cad988c  feat(pdp): mobile-first PDP with sticky add-to-cart bar
b543e71  feat(home): mobile-first homepage rewrite with horizontal shelves
047582d  feat(chrome): mobile-first global chrome — bottom nav, sticky cart bar, search sheet, wishlist store
```

---

## What's new (in order of impact)

### 1. Global mobile chrome (`047582d`)

| File | What it does |
|---|---|
| `src/components/layout/BottomNav.tsx` | Fixed 5-tab bottom nav (Home / Browse / Search / Cart / Account). Safe-area-inset, gold active underline, cart + wishlist count badges, hides on `/admin` and `/preview`. |
| `src/components/layout/StickyCartBar.tsx` | When cart has items, a gold pill above the bottom nav shows "Your collection · OMR X · Checkout →". Spring entrance via Framer Motion. Hides on cart/checkout/PDP/admin/preview. |
| `src/components/layout/MobileSearchSheet.tsx` | Full-screen search overlay with autofocus, body-scroll lock, ESC to close. Quick-filter pills (1:18 Porsche, Limited, Under 50 OMR, etc.) + 4 category tiles. |
| `src/components/layout/Navbar.tsx` | Mobile no longer has hamburger; logo + persistent search input + cart only. Desktop nav unchanged in concept, links updated. |
| `src/stores/wishlist.ts` + `recentlyViewed.ts` | Persisted Zustand stores backed by localStorage. |
| `src/hooks/useMounted.ts` | `useSyncExternalStore`-based hydration helper to avoid the lint-flagged `useEffect(setMounted)` pattern. |
| `src/app/layout.tsx` | Wires BottomNav + StickyCartBar; adds viewport theme-color and `viewport-fit: cover` for notch-safe rendering. |
| `src/app/globals.css` | New utilities: `.pb-safe-nav` (4rem + safe-area on mobile), `.shelf-scroll` (hides scrollbar on horizontal shelves), `.skeleton` (shimmer loading block). |

### 2. Homepage — mobile-first (`b543e71`)

Replaced `Hero + Categories + FeaturedStrip + LimitedSpotlight + AIRecommendations + BrandStory + Newsletter` with a tighter, shelf-driven layout:

- **`MobileHero`** — image-first on mobile (featured product card on top), headline below, single primary CTA. Stacks horizontally on desktop with image right.
- **`CategoryPills`** — horizontal pill row (All / Cars / Aviation / Trucks / Bikes / Limited / 1:18 / 1:43 / 1:64 / Under 50 OMR).
- **`CategoryShelf`** (reusable) — eyebrow, headline with italic gold accent, horizontal-snap shelf with edge-fade gradients and a "See all" tile at the end. Used three times: Numbered editions, Curator's selection, Top rated.
- **`BrandStrip`** — 9 maison circle tiles (AutoArt, Minichamps, Bburago, Herpa Wings, Hobby Master, Tekno, Eligor, Italeri, Maisto), each linking to a brand-filtered listing.
- **`RecentlyViewedShelf`** — appears only when localStorage has entries; client component reading the recentlyViewed store.
- **`ReassuranceStrip`** — 4-tile trust band (Authenticated / Insured shipping / Curated / 14-day exchange).

### 3. PDP — mobile-first (`cad988c`)

- **`StickyPDPBar`** — fixed bottom bar above BottomNav. Wishlist heart + qty stepper + gold price-CTA showing line total. Tap-feedback shows green "Added" confirmation. Replaces `StickyCartBar` while on PDP.
- Page rewritten: full-bleed gallery on mobile, breadcrumbs compact, low-stock pulse-dot warning when stock ≤ 5, 4-tile reassurance grid, definition-list specs with hairline rows, related products use the new `CategoryShelf` (was a 4-col grid).
- **`RecentlyViewedTracker`** — invisible client component pushes the current product to the store on mount.

### 4. Product listing — mobile-first (`2faebba`)

- Compact header, sticky pill bar under navbar (categories + scales + Limited).
- **Active filter chips strip** — each chip removes itself on tap; "Clear all" link.
- Sort dropdown using native `<details>/<summary>` — zero JS, gold-active row.
- Mobile grid: 2-col (was 1), 3-col tablet+. First 4 cards full-size, rest compact for visual rhythm.
- Empty state: rounded card with `SearchX` icon and View-all CTA.
- Heading adapts: search query, limited filter, category title, or default "The Collection".

### 5. ProductCard upgrade

- WishlistButton heart in top-right (always visible on mobile, no hover required).
- Gradient overlay on bottom half for legibility against any image.
- Scale chip moved to bottom-left so it doesn't fight the heart.
- Quick-add `Plus` button on desktop hover.
- Added `compact` prop for tighter density.
- Exported `ProductCardSkeleton` for future Suspense streaming.

---

## Visual verification (Playwright at /, /products, /products/[id])

Captured in repo root (gitignored where appropriate):

| File | Viewport | Result |
|---|---|---|
| `home-mobile-390.png` | 390 × 844 (iPhone 14) | Hero, pills, 3 shelves, brand strip, recently viewed, reassurance, footer — clean stacking, gold accents readable. |
| `products-mobile-390.png` | 390 × 844 | Sticky pills, 2-col grid with hearts visible, brand/name/price legible in compact cards. |
| `pdp-mobile-390.png` | 390 × 844 | Full-bleed image, sticky gold ADD-TO-BAG bar with qty + heart visible at bottom. |
| `home-desktop-1440.png` | 1440 × 900 | Side-by-side hero (text left, product right), full shelf grid, recently viewed band, footer. |
| `products-desktop-1440.png` | 1440 × 900 | Sidebar filters + 3-col grid, sort dropdown visible. |
| `pdp-desktop-1440.png` | 1440 × 900 | Gallery left, details right (440 px column), spec/highlights/shipping stacked, related shelf at bottom. |

I navigated each page through Playwright while a local dev server ran. All pages return HTTP 200 with real Supabase product data (Lamborghini Aventador SVJ, Porsche 911 GT3 RS, etc.) so the deployed Vercel preview will look the same.

---

## Important things I deliberately did NOT do

| Skipped | Why |
|---|---|
| **Google OAuth** | Needs your client ID + secret. Adding placeholder keys would break the auth flow that's currently working with Supabase email auth. Tomorrow's task with your guidance. |
| **Supabase real-time stock** | Architectural change — needs a `RealtimeChannel` subscription per product. Not justified by current traffic; premature. |
| **Pinch-to-zoom on PDP gallery** | Touch-gesture handling is finicky; risk of breaking pan/scroll on long pages. Browser default double-tap zoom still works. |
| **Trending / Recently-popular section** | Needs analytics data — view-count tracking, time-window aggregation. Skipped to avoid placeholder content. Recently-viewed (per-user, localStorage) shipped instead. |
| **Pull-to-refresh** | Browsers do this natively on mobile. Custom impls (overflow-y, touch listeners) are buggy and tend to fight Next's router. |
| **Skeleton loaders during SSR streaming** | Would need to split each page into two server components with `<Suspense>` boundaries — heavy refactor. The new `ProductCardSkeleton` and `.skeleton` utility are ready to wire when you decide to. |
| **Touching `main`** | Everything lives on `claude/ecommerce-mobile-redesign`. Not merged. Not auto-pushed to production. |
| **Touching the database / migrations** | Zero schema changes. Wishlist + recently-viewed are localStorage-only. |

---

## Known minor issues to look at when you're back

1. **AIChat floating button overlaps the sticky cart/PDP bar** on mobile (the "Concourse" pill in the bottom-right of all the screenshots). Two options: hide AIChat on mobile, or shift it up by `4.5rem` so it sits above the BottomNav.
2. **Mobile grid uses `compact` for cards 5+** which yields a slightly inconsistent visual rhythm. Up to you whether you want all-uniform or current variation.
3. **`ProductFilters` mobile drawer trigger** still uses outline button; could be promoted to a sticky bottom-right floating button on `/products` for one-thumb access.
4. **`useMounted` hook is duplicated logic** with the `mounted` flag pattern — works fine, but if you do this often consider lifting to Zustand `persist`'s `onRehydrateStorage`.
5. **5 ESLint warnings** unchanged from main: 4 are pre-existing in `src/components/admin/*` and `AIChat.tsx`. Don't block the build.

---

## How to review

1. Open the Vercel preview that auto-deploys when you push or open a PR for `claude/ecommerce-mobile-redesign`. On your phone, walk: `/` → swipe a category shelf → tap a product → use the sticky bottom CTA → tap the heart → tap Search in BottomNav → use a quick-filter pill → land on `/products` → tap a chip to filter → remove a chip.
2. If you want to A/B against main, the original `https://diecast-muscat.vercel.app/` is untouched.
3. To merge: open a PR for `claude/ecommerce-mobile-redesign → main` (I didn't open one — tomorrow your call).

---

## What would amaze me to do next (if you say go)

- Wire wishlist to Supabase so it survives device switches (table already exists per `database.ts:177-182`).
- Add product variants (color, scale option) — the Product type doesn't have them yet; would need a small schema add.
- "Compare two pieces" view at `/compare?ids=a,b` — collectors love side-by-side spec tables.
- Real Google OAuth + Apple Sign In — once you give me the keys.
- Honest performance pass — image lazy-load is on, but I haven't measured CLS / LCP. Worth Lighthouse-ing.
