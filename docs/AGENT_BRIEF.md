# Diecast Muscat — Agent Brief

Shared context for all parallel feature agents.

## Project Root
`D:\Projects\DiecastMuscat`

## Tech Stack
- **Next.js 16** (App Router) — `params` and `searchParams` are async Promises (`await params`)
- **React 19**
- **Tailwind v4** — CSS-first config in `src/app/globals.css` via `@theme` blocks (NO tailwind.config.ts)
- **TypeScript** strict
- **`@supabase/ssr`** — `createServerClient` (server.ts), `createBrowserClient` (client.ts)
- **Zustand** with persist (cart store at `src/stores/cart.ts`)
- **TanStack Query** v5 (Providers wraps the app)
- **Framer Motion** for animation
- **lucide-react** for icons
- **Radix UI** primitives for dialog, select, dropdown, etc.
- **sonner** for toasts
- **pdf-lib** for invoice PDFs
- **Recharts** for charts

## CRITICAL Next.js 16 conventions
- Use `proxy.ts` (NOT `middleware.ts`)
- `cookies()` from `next/headers` is async — `const c = await cookies()`
- `params` and `searchParams` in pages are Promises:
  ```tsx
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```
- Route handlers in `app/api/.../route.ts`:
  ```ts
  export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```

## Design System (Tailwind v4 utility tokens)
Use these utility classes — they map to CSS variables in globals.css:
- `bg-bg`, `bg-surface`, `bg-surface-elevated`
- `text-text`, `text-text-muted`, `text-text-dim`
- `text-gold`, `bg-gold`, `border-gold`
- `bg-gold/10`, `text-gold/60` — opacity modifiers work
- `border-border`, `border-border-strong`, `border-input`
- `font-display` — Playfair Display (use for headings/product names)
- `font-sans` — Inter (default body)
- Custom utility classes (defined in globals.css): `bg-noise`, `bg-gold-glow`, `bg-grid-faint`, `text-gradient-gold`, `shimmer-gold`, `hairline-gold`, `card-luxury`

## Key Imports
- UI primitives: `@/components/ui/{button,card,input,label,badge,sheet,skeleton,separator,textarea}`
- Cart store: `import { useCartStore, cartSelectors } from "@/stores/cart"`
- Supabase server: `import { createClient } from "@/lib/supabase/server"`
- Supabase client: `import { createClient } from "@/lib/supabase/client"`
- Types: `import type { Product, Order, Customer } from "@/types/database"`
- Utilities: `import { cn, formatCurrencyOMR, formatDate } from "@/lib/utils"`
- Claude: `import { claude, CLAUDE_MODEL, CHAT_SYSTEM_PROMPT } from "@/lib/claude"`

## Currency
Omani Rial (OMR), 3 decimal places. Use `formatCurrencyOMR(amount)` helper.

## Brand Voice
- Refined, knowledgeable, curatorial — NOT salesy
- Headings in `font-display` (Playfair) for sense of luxury
- Gold accents used sparingly to feel premium

## Files NOT to touch (already written by foundation)
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/lib/supabase/*`
- `src/lib/utils.ts`
- `src/lib/claude.ts`
- `src/stores/cart.ts`
- `src/types/database.ts`
- `src/proxy.ts`
- `src/components/layout/Providers.tsx`
- `src/components/ui/*`
- `database/migrations/*`

## Quality bar
- Production-grade — no `any` types, no TODOs, no placeholder text
- Every page has proper metadata
- Loading and error states handled
- Mobile responsive (test at 375px mentally)
- No emojis in copy unless explicitly stated
