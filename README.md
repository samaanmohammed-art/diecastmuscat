# Diecast Muscat

**Premium die-cast model collectibles, curated for the Sultanate of Oman.**

A production-ready Next.js 16 e-commerce platform — luxury aesthetic, AI concierge, full admin dashboard, invoice generation.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config) |
| Database | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Auth | `@supabase/ssr` |
| State | Zustand (cart) + TanStack Query (server state) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| AI | Anthropic Claude (`claude-sonnet-4-5`) |
| PDF | `pdf-lib` (invoice generation) |
| Charts | Recharts (admin analytics) |
| Email | Resend + React Email |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # login, signup, reset
│   ├── (customer)/          # products, cart, checkout, account
│   ├── (admin)/             # admin dashboard, products, orders, analytics
│   ├── api/                 # route handlers
│   ├── layout.tsx
│   ├── page.tsx             # luxury homepage
│   └── globals.css          # Tailwind v4 design tokens
├── components/
│   ├── ui/                  # design primitives (Button, Card, Sheet, etc.)
│   ├── layout/              # Navbar, Footer, Providers
│   ├── products/            # ProductCard, Gallery, Filters
│   ├── cart/                # CartDrawer, CartItem
│   ├── admin/               # admin-only components
│   ├── home/                # homepage sections
│   └── shared/              # AIChat, SearchBar
├── lib/
│   ├── supabase/            # createClient (server + browser)
│   ├── claude.ts            # Anthropic SDK config + system prompts
│   ├── invoice.ts           # PDF invoice generator
│   ├── utils.ts             # formatCurrencyOMR, dates, slugify
│   └── sample-products.ts   # seed data for development
├── stores/cart.ts           # Zustand cart store with persist
├── types/database.ts        # Supabase row types
└── proxy.ts                 # Next 16 middleware (formerly middleware.ts)

database/
├── migrations/              # 001-003: tables, indexes, RLS
└── seeds/

docs/
├── PROJECT_PLAN.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── API_SPEC.md
├── AGENT_RULES.md
├── AGENT_BRIEF.md
└── NEXT16_CHEATSHEET.md
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local
# Fill in Supabase URL + keys + ANTHROPIC_API_KEY

# 3. Set up Supabase (apply migrations)
# In Supabase SQL editor, run files from database/migrations/ in order:
#   001_create_tables.sql
#   002_create_indexes.sql
#   003_rls_policies.sql

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

---

## Design System

Direction: **Luxury / Industrial** — black obsidian base, warm gold metallic accents.

**Tokens** are defined in `src/app/globals.css` using Tailwind v4 `@theme` blocks:

| Token | Value | Usage |
|---|---|---|
| `bg-bg` | `#0A0A0A` | Page background |
| `bg-surface` | `#111111` | Cards, panels |
| `bg-surface-elevated` | `#161616` | Modal, dropdown |
| `text-gold` | `#D4AF37` | Primary accent |
| `text-text` | `#F5F5F0` | Body text |
| `text-text-muted` | `#888880` | Supporting text |
| `font-display` | Playfair Display | Hero headlines, product names |
| `font-sans` | Inter | Body, UI |

**Atmospheric utilities** (defined in globals.css):
- `bg-noise` — subtle SVG noise overlay
- `bg-gold-glow` — radial gold gradient
- `bg-grid-faint` — faint grid texture
- `text-gradient-gold` — gold metallic text gradient
- `card-luxury` — cards with hover lift + gold border

---

## Currency

All prices in **Omani Rial (OMR)**, formatted to 3 decimal places:
```ts
import { formatCurrencyOMR } from "@/lib/utils";
formatCurrencyOMR(45.5); // "OMR 45.500"
```

---

## Authentication

- `@supabase/ssr` (NOT the deprecated `auth-helpers-nextjs`)
- Session refresh via `proxy.ts` (Next 16 replacement for middleware.ts)
- Protected routes: `/account/*`, `/checkout`, `/admin/*`
- Admin gate: user must exist in `admin_users` table

---

## Deployment

Optimized for Vercel:

1. Push to GitHub (`samaanmohammed-art/diecastmuscat`)
2. Import project in Vercel
3. Set environment variables (same as `.env.local`)
4. Deploy — production URL will be `https://diecastmuscat.vercel.app` (or custom domain)

---

## License

Private. All rights reserved — Diecast Muscat.
