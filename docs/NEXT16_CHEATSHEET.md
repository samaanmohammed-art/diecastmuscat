# Next.js 16 + Tailwind v4 Quick Reference

## 1. Async Params & SearchParams (Next 15+)

In page and layout components, `params` and `searchParams` are now **Promises**.

```tsx
// app/[id]/page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}) {
  const { id } = await params
  const { sort } = await searchParams
  return <div>{id}</div>
}
```

```js
// app/[id]/page.js
export default async function Page({ params, searchParams }) {
  const { id } = await params
  return <div>{id}</div>
}
```

**Key:** Always `await` both `params` and `searchParams` before using.

---

## 2. Async Cookies (Next 15+)

`cookies()` from `next/headers` is now async. Must use `await`.

```tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  
  return <div>{theme?.value}</div>
}
```

**Use in Server Functions:** Can also set/delete cookies.

```tsx
'use server'

import { cookies } from 'next/headers'

export async function setTheme(theme: string) {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme, { httpOnly: true })
}
```

---

## 3. Middleware → Proxy (Next 16)

**BREAKING:** `middleware` is **deprecated**. Use `proxy` instead.

Create `proxy.ts` at project root (same level as `app/` or `src/`).

```tsx
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Return NextResponse directly or redirect/rewrite
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
```

**Key Points:**
- Export named `proxy` function (or default export)
- Optionally export `config` object with `matcher` array
- Returns `NextRequest` → `NextResponse`
- Use `NextRequest.cookies`, `nextUrl`, `headers()`
- Cannot use shared modules; pass data via headers, cookies, or URL

---

## 4. Server vs Client Components

**Default:** Pages and layouts are Server Components (no `'use client'`).

**When to use Client Components** (`'use client'` directive):
- State management (`useState`, `useReducer`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`, `navigator`)
- Lifecycle hooks (`useEffect`, `useLayoutEffect`)
- Custom hooks using the above

```tsx
// app/ui/counter.tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Best Practice:** Mark only interactive components with `'use client'`, keep layouts/pages as Server Components.

---

## 5. API Route Handlers (Route Handlers)

Files at `app/api/[path]/route.ts` export HTTP method functions.

```tsx
// app/api/posts/route.ts
export async function GET(request: Request) {
  return Response.json({ posts: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ created: true }, { status: 201 })
}
```

**Accessing params** (dynamic routes):

```tsx
// app/api/posts/[id]/route.ts
export async function GET(_req: Request, ctx: RouteContext<'/posts/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

**Caching:** GET handlers are cached by default. Others are not. To disable:

```tsx
export const dynamic = 'force-dynamic'
```

**With `use cache`:** Can include uncached data in prerendered response.

```tsx
export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  // uncached fetch or database query
}
```

---

## 6. Image Component (No Breaking Changes)

`next/image` works the same. Requires `width` and `height` for remote images.

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="User"
      width={400}
      height={400}
    />
  )
}
```

**Static import:** Auto-detects dimensions.

```tsx
import ProfileImg from './profile.png'

export default function Page() {
  return <Image src={ProfileImg} alt="User" />
}
```

---

## 7. Tailwind v4: CSS-First Config with @theme

No `tailwind.config.ts` needed. Define theme in CSS using `@theme` block.

```css
/* globals.css */
@import "tailwindcss";

:root {
  --color-primary: #3b82f6;
  --color-accent: #f97316;
  --font-sans: "Inter", system-ui, sans-serif;
  --spacing-unit: 1rem;
}

@theme inline {
  /* Map CSS variables to Tailwind tokens */
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
  --font-sans: var(--font-sans);
}

/* Custom colors using @layer */
@layer utilities {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #60a5fa;
  }
}
```

**Custom spacing, colors, fonts:**

```css
@theme {
  --color-brand-primary: #0ea5e9;
  --color-brand-secondary: #64748b;
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
}
```

**Using @layer:**

```css
@layer base {
  h1 { @apply text-3xl font-bold; }
}

@layer components {
  .card { @apply p-6 bg-white rounded-lg shadow; }
}

@layer utilities {
  .aspect-video { @apply aspect-video; }
}
```

---

## 8. next/font/google

Import fonts directly from Google Fonts. Returns `className` and CSS variable.

```tsx
// app/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Use in CSS:**

```css
:root {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

h1 { font-family: var(--font-display); }
body { font-family: var(--font-body); }
```

Or in Tailwind `@theme`:

```css
@theme {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

---

## 9. Deprecations & Breaking Changes

- **`middleware` → `proxy`:** Rename middleware.ts to proxy.ts
- **`cookies()`, `params`, `searchParams` are async:** Always await
- **Font loader returns CSS variables:** Use `variable` option for CSS custom properties
- **Image component:** No breaking changes, but `remotePatterns` config still required
- **API routes:** No signature changes; `ctx.params` now async

---

## Quick Checklist

- [ ] Await all `params` and `searchParams` in pages/layouts
- [ ] Await `cookies()` before calling methods
- [ ] Rename `middleware.ts` → `proxy.ts` if upgrading
- [ ] Define Tailwind theme in `@theme` block in globals.css
- [ ] Use `@layer base/components/utilities` for custom styles
- [ ] Mark interactive components with `'use client'`
- [ ] Use `use cache` in async functions to cache uncached data
- [ ] Test dark mode with `@media (prefers-color-scheme: dark)`
