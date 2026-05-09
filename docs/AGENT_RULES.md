# Diecast Muscat — Agent Rules

Strict rules for every AI agent working in this repository. These apply in all sessions, regardless of other instructions.

---

## TypeScript

- Never use `any` — use `unknown`, proper generics, or type assertions with guards
- Strict null checks — never assume a value is non-null without a check
- All async `params`, `searchParams`, and `cookies()` must be awaited (Next.js 16)

## Currency

- All prices displayed via `formatCurrencyOMR(amount)` from `@/lib/utils`
- Currency is OMR (Omani Rial) with 3 decimal places
- Never display raw numbers for prices

## Design System

- Only use design token utility classes — never hardcode hex values
- All headings and product names use `font-display` (Playfair Display)
- Gold accents (`text-gold`, `bg-gold`) must be used sparingly — they lose impact if overused
- Mobile-first: start at 375px, add `sm:` / `lg:` modifiers for larger screens
- No emojis in any user-facing copy

## Next.js 16 Conventions

- Use `proxy.ts` — never create or reference `middleware.ts`
- `cookies()` from `next/headers` is async: `const c = await cookies()`
- Page and route handler params:
  ```ts
  // Page
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  }
  // Route handler
  export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  }
  ```
- Server components by default — `"use client"` only when hooks/events are needed

## Supabase

- Server-side: `import { createClient } from "@/lib/supabase/server"`
- Client-side: `import { createClient } from "@/lib/supabase/client"`
- Never import directly from `@supabase/ssr` in components
- RLS must be enabled for all user-facing tables

## Files Never to Edit

| File | Reason |
|------|--------|
| `src/app/globals.css` | Design token contract — change only with explicit design intent |
| `src/proxy.ts` | Auth gate — careful changes only |
| `src/lib/supabase/*` | Auth contract — careful changes only |
| `database/migrations/*` | Never edit existing files — write new numbered ones |
| `src/components/ui/*` | Radix UI wrappers — stable API surface |

## Bash / CLI

- Prefix all bash commands with `contextzip` for token-efficient output
- Example: `contextzip git status`, `contextzip npm run build`

## Git / PR Workflow

- Never run `gh pr create` — not even with `--draft`
- Push the branch and stop: `contextzip git push -u origin <branch>`
- Report branch name + summary and let the user open the PR

## Quality Bar

Every screen must:
- Handle loading, error, and empty states
- Be responsive at 375px → 1440px
- Use proper semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, etc.)
- Have accessible labels on interactive elements (`aria-label`, `<label>`)
- Have proper `<Metadata>` export for SEO

## Brand Voice

- Curatorial and refined — NOT salesy or pushy
- "Your collection" not "your cart"
- "Curator's selection" not "best sellers"
- "First access" not "join our newsletter"
- Minimal exclamation points
