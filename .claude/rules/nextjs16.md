---
description: Next.js 16 App Router conventions — async params, proxy.ts, cookies
---

# Next.js 16 Conventions

## Async params and searchParams

All page and route handler params are Promises in Next.js 16. Always await them.

```tsx
// Page component
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { id } = await params
  const { q } = await searchParams
}

// generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}

// Route handler
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
}
```

## proxy.ts not middleware.ts

This project uses `src/proxy.ts` as the auth middleware entry point. Never create or reference `middleware.ts`.

```ts
// src/proxy.ts — do not rename or duplicate
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}
export const config = { matcher: [...] }
```

## Async cookies()

```ts
import { cookies } from "next/headers"
const cookieStore = await cookies()  // must be awaited
```

## Server vs Client components

- Default to Server Components — no `"use client"` directive
- Add `"use client"` only when you need: `useState`, `useEffect`, event handlers, browser APIs, Zustand stores, Framer Motion
- Keep client components as leaf nodes — push data fetching up to server components

## Supabase in server components

```ts
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

## Supabase in client components

```ts
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()  // not async on client
```
