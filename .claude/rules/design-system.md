---
description: Diecast Muscat design system — always-on token and aesthetic rules
---

# Design System Rules

## Colour tokens — use these, never hardcode hex

| Class | Use |
|-------|-----|
| `bg-bg` | Page background (#0A0A0A) |
| `bg-surface` | Cards, panels (#111111) |
| `bg-surface-elevated` | Dropdowns, overlays (#161616) |
| `text-gold` / `bg-gold` / `border-gold` | Accents — use sparingly (#D4AF37) |
| `text-gold-bright` | Hover on gold elements (#F5CD5B) |
| `text-gold-muted` / `border-gold-muted` | Subtle gold (#9A7D26) |
| `text-text` | Primary text (#F5F5F0) |
| `text-text-muted` | Secondary / body text (#888880) |
| `text-text-dim` | Labels, placeholders, captions (#5C5C58) |
| `border-border` | Default borders (#1E1E1E) |
| `border-border-strong` | Prominent borders (#2A2A2A) |

Opacity modifiers work: `bg-gold/10`, `text-gold/60`, `border-gold/40`.

## Typography rules

- **All headings** → `font-display` (Playfair Display, serif)
- **All body / UI text** → `font-sans` (Inter)
- **Tracking conventions:** eyebrows use `tracking-[0.28em]` or `tracking-[0.32em]`; buttons use `tracking-[0.18em]`; uppercase labels use `text-[10px]` or `text-xs`

## Spacing and layout

- Mobile padding: `px-4`; tablet: `sm:px-6`; desktop: `lg:px-8`
- Section vertical gaps: `gap-6 lg:gap-12`
- Card inner padding: `p-4 sm:p-5` (normal), `p-3` (compact)
- Generous whitespace — luxury aesthetic relies on breathing room

## Custom utilities (already defined in globals.css — use, don't recreate)

`bg-noise` · `bg-gold-glow` · `bg-grid-faint` · `text-gradient-gold` · `shimmer-gold` · `hairline-gold` · `card-luxury` · `.skeleton` · `.shelf-scroll` · `.pb-safe-nav`

## Gold usage discipline

Gold is the premium signal. Overusing it dilutes the brand. Per screen:
- 1–2 gold text elements (eyebrow labels, prices, active states)
- 1 gold border or glow at most
- Never fill large areas with solid gold — use `bg-gold/10` for backgrounds

## No emojis in copy

User-facing text must not contain emojis. Icons are lucide-react components only.
