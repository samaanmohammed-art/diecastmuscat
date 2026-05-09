# Diecast Muscat — Architecture

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | `proxy.ts` not `middleware.ts`; async `params`/`cookies` |
| UI | React 19 + TypeScript strict | No `any` types ever |
| Styling | Tailwind v4 (CSS-first) | `@theme` blocks in `globals.css`; no `tailwind.config.ts` |
| Database / Auth | Supabase (`@supabase/ssr`) | `createServerClient` server-side, `createBrowserClient` client-side |
| State | Zustand with persist middleware | 3 stores: cart, wishlist, recentlyViewed |
| Server data | TanStack Query v5 | Wrapped by `Providers` in `layout.tsx` |
| Animation | Framer Motion 12 | `motion.div` with `whileHover`, spring transitions |
| Forms | react-hook-form + zod | All user-facing forms |
| PDF | pdf-lib | Invoice and certificate generation |
| AI | Anthropic Claude (`claude-sonnet-4-5`) | Chat, search, recommendations |
| Charts | Recharts | Admin analytics |
| Toasts | Sonner | All user feedback |
| Icons | lucide-react | Consistent icon set |
| UI primitives | Radix UI (Dialog, Select, Dropdown) | Via `src/components/ui/` wrappers |

---

## Route Structure

```
src/app/
├── (customer)/               # Public storefront (layout: Navbar + BottomNav + StickyCartBar)
│   ├── page.tsx              # Home — shelves, hero, brand strip
│   ├── products/
│   │   ├── page.tsx          # PLP — filter pills + Suspense grid
│   │   ├── ProductsGrid.tsx  # Async server component (Suspense boundary)
│   │   ├── ProductsGridSkeleton.tsx
│   │   └── [id]/page.tsx     # PDP — gallery, specs, StickyPDPBar
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   └── account/page.tsx
├── (admin)/                  # Admin panel (separate layout)
│   └── admin/
│       ├── page.tsx          # Dashboard
│       ├── products/         # Product CRUD
│       └── orders/           # Order management
├── preview/                  # Dev previews (no auth gate)
│   └── showroom/page.tsx
├── api/
│   ├── auth/callback/        # OAuth callback
│   ├── auth/logout/
│   ├── ai/chat/              # Claude chat
│   ├── ai/search/            # AI-powered search
│   ├── ai/recommendations/
│   ├── orders/               # Order create + fetch
│   ├── products/             # Product list + detail
│   └── invoices/[orderId]/   # PDF invoice
└── layout.tsx                # Root: Providers + Navbar + BottomNav + StickyCartBar
```

---

## Auth Flow

```
Request
  └─▶ proxy.ts (matcher: all non-static paths)
        └─▶ updateSession() in src/lib/supabase/middleware.ts
              └─▶ createServerClient() with cookie read/write callbacks
                    ├─▶ supabase.auth.getUser() — refreshes session token
                    └─▶ Returns response with updated Set-Cookie headers
```

Protected routes check `user` via `createClient()` in server components / route handlers. Admin routes additionally check `admin_users` table for `role`.

---

## Component Layers

### Layout (always mounted)
- `Navbar` — logo + desktop nav + search icon + cart icon; mobile: logo + search + cart only
- `BottomNav` — 5 tabs: Home / Collection / Search (opens MobileSearchSheet) / Wishlist / Account; hides on `/admin` and `/preview`
- `StickyCartBar` — spring-entrance pill above BottomNav showing count + subtotal; hidden on `/cart`, `/checkout`, `/admin`, `/preview`, `/products/[id]`

### Page-level components
- `MobileHero` — 55vh hero, image-first, single CTA
- `CategoryShelf` — reusable horizontal snap shelf with eyebrow + italic gold headline + edge-fade + "See all" tile
- `ProductsGrid` — async server component; sort dropdown, pagination, empty state
- `StickyPDPBar` — fixed bottom bar on PDP: wishlist + qty stepper + gold price CTA; mutually exclusive with StickyCartBar

### Shared
- `ProductCard` — WishlistButton top-right, Eye chip → QuickView; `compact` prop for shelves
- `QuickView` — Radix Dialog bottom-sheet (mobile) / centered modal (desktop); hero image, price, specs, qty stepper, add-to-bag
- `AIChat` — floating concierge button (desktop-only); full-height panel with Claude streaming
- `WishlistButton` — heart toggle (sm/md/lg); uses `useMounted` to avoid SSR mismatch

---

## State Management

### `src/stores/cart.ts` — `diecast-cart` (localStorage)
```
CartLine[]  items           — product + quantity pairs
boolean     isOpen          — cart drawer open state
addItem(product, qty?)      — merges or appends; clamps to stock
removeItem(productId)
updateQuantity(productId, qty)
clearCart()
openCart / closeCart / toggleCart
cartSelectors.count(state)  — total item count
cartSelectors.subtotal(state) — OMR total
```

### `src/stores/wishlist.ts` — `diecast-wishlist` (localStorage)
```
string[]    ids             — product IDs
toggle(productId)           — add or remove
has(productId) → boolean
clear()
wishlistSelectors.count(state)
```

### `src/stores/recentlyViewed.ts` — `diecast-recently-viewed` (localStorage)
```
Product[]   items           — MAX_ENTRIES = 12, deduplicates on push
push(product)               — prepends, trims to 12
clear()
```

---

## Design System

All tokens live in `src/app/globals.css` inside `@theme {}`. Never hardcode hex values — use utility classes.

### Colour tokens
| Class | Value | Use |
|-------|-------|-----|
| `bg-bg` | `#0A0A0A` | Page background |
| `bg-surface` | `#111111` | Cards, panels |
| `bg-surface-elevated` | `#161616` | Dropdowns, overlays |
| `text-gold` / `bg-gold` / `border-gold` | `#D4AF37` | Accents — use sparingly |
| `text-gold-bright` | `#F5CD5B` | Hover states on gold |
| `text-text` | `#F5F5F0` | Primary text |
| `text-text-muted` | `#888880` | Secondary text |
| `text-text-dim` | `#5C5C58` | Labels, placeholders |
| `border-border` | `#1E1E1E` | Default borders |
| `border-border-strong` | `#2A2A2A` | Prominent borders |

### Typography
- `font-display` — Playfair Display (serif) — all headings, product names, prices
- `font-sans` — Inter — body text, UI labels

### Custom utilities (defined in `globals.css`)
`bg-noise`, `bg-gold-glow`, `bg-grid-faint`, `text-gradient-gold`, `shimmer-gold`, `hairline-gold`, `card-luxury`, `.skeleton`, `.shelf-scroll`, `.pb-safe-nav`

### Spacing conventions
- Generous whitespace — this is luxury, not density
- Mobile padding: `px-4`, desktop: `px-6 lg:px-8`
- Section gaps: `gap-6 lg:gap-12`

---

## Key Utilities (`src/lib/utils.ts`)

| Function | Signature | Notes |
|----------|-----------|-------|
| `cn` | `(...inputs: ClassValue[]) => string` | clsx + tailwind-merge |
| `formatCurrencyOMR` | `(amount: number) => string` | OMR 3 decimals, en-OM locale |
| `formatDate` | `(date: string \| Date) => string` | en-GB, "05 May 2026" |
| `formatDateTime` | `(date: string \| Date) => string` | en-GB with time |
| `generateInvoiceNumber` | `() => string` | `DM-2026-XXXXX` format |
| `slugify` | `(text: string) => string` | lowercase, hyphens |
| `truncate` | `(text: string, max: number) => string` | appends `…` |

---

## SSR / Hydration Pattern

Client components that read localStorage use `useMounted` from `src/hooks/useMounted.ts`:

```ts
// Uses useSyncExternalStore to avoid react-hooks/set-state-in-effect lint error
// Returns false on server (SSR), true after hydration
const mounted = useMounted();
if (!mounted) return null; // or skeleton
```

This prevents hydration mismatches from Zustand persist stores.
