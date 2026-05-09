---
description: Scaffold a new feature branch and component stub following the Diecast Muscat design system.
argument-hint: feature-name (e.g. "product-comparison" or "review-widget")
---

Scaffold a new feature for Diecast Muscat. The feature name is: $ARGUMENTS

Follow these steps:

1. **Create a feature branch:**
   ```
   contextzip git checkout -b claude/$ARGUMENTS
   ```

2. **Identify the right location:**
   - New page → `src/app/(customer)/[route]/page.tsx`
   - New component used on multiple pages → `src/components/[domain]/[Name].tsx`
   - New component used on one page → co-locate in the page directory

3. **Scaffold the component with:**
   - Correct TypeScript types (no `any`)
   - `"use client"` only if hooks or event handlers are needed
   - Mobile-first responsive layout (start at 375px)
   - Loading state (`.skeleton` shimmer or Suspense fallback)
   - Empty state (message + CTA if data-dependent)
   - Error state (friendly message, not raw error)
   - `font-display` for headings, design token classes only (no hardcoded hex)
   - Accessible labels on interactive elements

4. **Wire it up:**
   - Add to the relevant page or layout
   - Add to navigation if it's a new route
   - Export from an index if it's a shared component

5. **Report what was created:**
   - Files created and their purpose
   - How to navigate to it locally (`npm run dev` → URL)
   - Any Supabase tables or API routes needed (don't create those yet — flag them)

Keep the scaffold clean and production-ready. No TODOs, no placeholder text, no lorem ipsum.
