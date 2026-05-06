# CLAUDE.md — Diecast Muscat

Project instructions for AI assistants working in this repo.

## Project Vision

Premium die-cast model collectibles e-commerce platform targeting Oman / GCC. Luxury brand positioning. World-class design quality — must NOT feel like generic SaaS.

## Tech Stack (frozen)

- **Next.js 16** (App Router) + React 19 + TypeScript strict
- **Tailwind v4** — CSS-first config in `src/app/globals.css` via `@theme` blocks. NO `tailwind.config.ts`.
- **Supabase** — auth, database, storage. Use `@supabase/ssr` (createServerClient / createBrowserClient).
- **Anthropic Claude** for AI features (model: `claude-sonnet-4-5`)
- **Zustand** for cart, **TanStack Query** for server data, **react-hook-form + zod** for forms
- **Framer Motion** for animation, **Recharts** for charts, **pdf-lib** for invoices

## Critical Next.js 16 Conventions

> **READ THIS BEFORE WRITING CODE.** Next 16 has breaking changes from Next 14.

1. **`proxy.ts` not `middleware.ts`** — middleware is deprecated. Wired at `src/proxy.ts`.
2. **Async `params` and `searchParams`** in pages and route handlers:
   ```tsx
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
   }
   ```
3. **Async `cookies()`** from `next/headers` — `const c = await cookies()`.
4. **Route handlers** in `src/app/api/.../route.ts` — same async params pattern.

## Design System

Direction: **luxury / industrial**. Black obsidian + warm gold + Playfair Display headlines.

Tokens are in `src/app/globals.css`. Use utility classes like `bg-bg`, `bg-surface`, `text-gold`, `font-display`, `text-gradient-gold`. Custom atmospheric utilities: `bg-noise`, `bg-gold-glow`, `bg-grid-faint`, `card-luxury`, `hairline-gold`.

## Brand Voice

- Curatorial, refined, knowledgeable — NOT salesy
- "Your collection" not "your cart"
- "Curator's selection" not "best sellers"
- "First access" not "join our newsletter"
- No emojis in copy
- Minimal exclamation points

## Code Standards

- TypeScript strict — never use `any`
- All currency formatted via `formatCurrencyOMR` from `@/lib/utils` (3 decimals OMR)
- All async params awaited
- Forms use react-hook-form + zod
- Server components by default; `'use client'` only when needed
- Mobile-first responsive

## Quality Bar

This is a Tier-2 project. Every screen must:
- Match the luxury aesthetic (gold accents sparingly, generous whitespace, font-display for headings)
- Handle loading, error, and empty states
- Be responsive at 375px → 1440px
- Use proper semantic HTML and accessible labels

## Files NOT to refactor without reason

- `src/lib/supabase/*` — auth contract, careful changes only
- `src/proxy.ts` — auth gate, careful changes only
- `src/app/globals.css` — design tokens, change in concert with design intent
- `database/migrations/*` — write NEW migration files, don't edit old ones
