# Diecast Muscat — API Specification

Base URL: `/api` (relative). All handlers in `src/app/api/`.

Cache headers on product routes: `public, max-age=60, s-maxage=60, stale-while-revalidate=120`

---

## Auth

### `GET /api/auth/callback`
OAuth callback handler (Supabase PKCE flow).

**Query params:** `code` (string), `next` (string, default `/`)
**Returns:** Redirect to `next` on success, `/login?error=auth_failed` on failure
**Auth:** None required (public)

---

### `POST /api/auth/logout`
Signs out the current user.

**Body:** None
**Returns:** Redirect 303 to `/`
**Auth:** None required (clears session)

---

## AI

### `POST /api/ai/chat`
Claude-powered concierge chat. Uses `claude-sonnet-4-5` via `@anthropic-ai/sdk`.

**Body:**
```typescript
{
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
}
```
**Returns:** `{ reply: string }` — Claude's text response
**Limits:** Last 12 messages kept in context (`MAX_HISTORY = 12`); keyword canned replies short-circuit for common queries
**Auth:** None required

---

### `POST /api/ai/search`
AI-powered natural language product search. Parses query intent into structured filters.

**Body:**
```typescript
{ query: string }
```
**Returns:** `Product[]` — filtered products matching parsed intent
**Parsing:** Claude extracts category, scale, brand, price range, keywords, limited-edition flag. Falls back to `parseSearchQueryFallback()` if AI unavailable.
**Auth:** None required

---

### `GET /api/ai/recommendations`
Rule-based product recommendations (category affinity + featured weighting).

**Query params:** `customerId?` (string), `productId?` (string)
**Returns:** `Product[]` — 4 items
**Logic:** If `productId` given, prefers same-category products excluding the seed. Featured products weighted first.
**Auth:** None required

---

## Products

### `GET /api/products`
Paginated, filtered product listing.

**Query params:**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| category | string | — | cars / planes / trucks / bikes |
| scale | string | — | Comma-separated, e.g. `1:18,1:43` |
| brand | string | — | Comma-separated |
| q | string | — | Full-text search |
| limited | string | — | `"1"` for limited editions only |
| minPrice | number | — | OMR |
| maxPrice | number | — | OMR |
| sort | string | `newest` | newest / price_asc / price_desc / rating |
| page | number | `1` | |
| limit | number | `12` | |

**Returns:**
```typescript
{
  products: Product[]
  total: number
  page: number
  totalPages: number
}
```
**Auth:** None required

---

### `GET /api/products/[id]`
Single product by ID.

**Path params:** `id` (string, uuid)
**Returns:** `{ product: Product }` or `404 { error: "Product not found" }`
**Auth:** None required

---

## Orders

### `POST /api/orders`
Creates a new order. Validates stock, calculates totals, inserts order + order_items.

**Body (validated with zod):**
```typescript
{
  customer: {
    name: string        // min 2 chars
    email: string       // valid email
    phone?: string
    address: string
    city: string
    country: string
    postal_code?: string
  }
  items: Array<{
    product_id: string
    quantity: number    // 1–50
  }>
  payment_method: string
  notes?: string
}
```
**Returns:** `{ orderId: string }` or error
**Pricing:** Free shipping above `SHIPPING_FREE_THRESHOLD_OMR`; flat `SHIPPING_FLAT_OMR` otherwise; VAT via `VAT_RATE` (constants from `src/hooks/useCart.ts`)
**Auth:** Required (Supabase session)

---

### `GET /api/orders/[id]`
Fetches a single order with customer details.

**Path params:** `id` (string, uuid)
**Returns:**
```typescript
Order & {
  customer: {
    id: string
    user_id: string | null
    name: string
    email: string
    phone: string | null
    address: string | null
    city: string | null
    country: string
    postal_code: string | null
  }
}
```
**Auth:** Required. Returns 401 if no session.

---

## Invoices

### `GET /api/invoices/[orderId]`
Generates and streams a PDF invoice using `pdf-lib`.

**Path params:** `orderId` (string, uuid)
**Returns:** `application/pdf` binary stream
**Auth:** Required (admin or order owner check via `fetchAdminOrderById`)
**Dependencies:** `src/lib/invoice.ts`, `src/lib/admin-db.ts`

---

## Error format

All error responses follow:
```typescript
{ error: string }
```
With appropriate HTTP status (400 validation, 401 auth, 404 not found, 500 server error).
