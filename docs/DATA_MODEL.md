# Diecast Muscat — Data Model

Source of truth: `src/types/database.ts`. Run `supabase gen types typescript` to regenerate after schema changes.

---

## Enums

```typescript
type ProductCategory = "cars" | "planes" | "trucks" | "bikes"
type ProductScale    = "1:64" | "1:43" | "1:24" | "1:18" | "1:12"
type OrderStatus     = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
type PaymentStatus   = "pending" | "paid" | "failed" | "refunded"
```

---

## Tables

### `products`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| name | string | Display name |
| description | string \| null | Long-form copy |
| category | ProductCategory | cars / planes / trucks / bikes |
| scale | ProductScale \| null | 1:64 → 1:12 |
| brand | string \| null | e.g. AutoArt, Minichamps |
| price | number | OMR — use `formatCurrencyOMR()` to display |
| stock | number | 0 = sold out |
| sku | string | Unique identifier |
| images | string[] | Supabase Storage URLs; first element = hero |
| features | Record\<string, unknown\> | Key-value pairs rendered as highlights |
| is_limited_edition | boolean | Shows "Limited" badge + "Limited" pill filter |
| is_featured | boolean | Included in featured home shelf |
| condition | "mint" \| "new" \| "sealed" | Shown as badge on PDP |
| rating | number | Aggregated from `reviews` table |
| review_count | number | Aggregated from `reviews` table |
| created_at | string (ISO) | Auto-set |
| updated_at | string (ISO) | Auto-set |

Insert omits: `id`, `created_at`, `updated_at`. `rating` and `review_count` default to 0.

---

### `categories`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| name | string | Display name |
| slug | string | URL-safe identifier |
| icon | string \| null | SVG or emoji |
| display_order | number | Sort order in UI |
| created_at | string (ISO) | Auto-set |

---

### `customers`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| user_id | string \| null | FK → Supabase Auth `auth.users.id` |
| email | string | |
| name | string | Full name |
| phone | string \| null | |
| address | string \| null | Street address |
| city | string \| null | |
| country | string | Defaults to "OM" |
| postal_code | string \| null | |
| created_at | string (ISO) | Auto-set |
| updated_at | string (ISO) | Auto-set |

`user_id` is null for guest checkouts. Link created on account registration.

---

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| customer_id | string | FK → customers.id |
| total_amount | number | subtotal + shipping + tax (OMR) |
| subtotal | number | Items total before fees |
| shipping_cost | number | Free above threshold |
| tax_amount | number | VAT (5% in Oman) |
| status | OrderStatus | pending → processing → shipped → delivered |
| payment_status | PaymentStatus | pending → paid |
| payment_id | string \| null | Gateway transaction ID |
| payment_method | string \| null | "card", "cod", "apple_pay" |
| invoice_number | string \| null | `DM-YYYY-XXXXX` format |
| shipping_address | ShippingAddress \| null | JSON snapshot of address at order time |
| notes | string \| null | Customer notes |
| created_at | string (ISO) | Auto-set |
| updated_at | string (ISO) | Auto-set |
| shipped_at | string \| null | ISO timestamp |
| delivered_at | string \| null | ISO timestamp |

#### `ShippingAddress` (embedded JSON)
```typescript
{
  name: string
  phone: string
  address: string
  city: string
  country: string
  postal_code: string
}
```

---

### `order_items`

Denormalised snapshot of product details at time of purchase.

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| order_id | string | FK → orders.id |
| product_id | string | FK → products.id (soft ref — product may be deleted) |
| product_name | string | Snapshot |
| product_sku | string | Snapshot |
| quantity | number | |
| price | number | Unit price at time of order (OMR) |
| subtotal | number | price × quantity |
| created_at | string (ISO) | Auto-set |

---

### `reviews`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| product_id | string | FK → products.id |
| customer_id | string | FK → customers.id |
| rating | number | 1–5 |
| title | string \| null | Optional headline |
| comment | string \| null | Body text |
| is_verified_purchase | boolean | Set server-side after order confirmation |
| created_at | string (ISO) | Auto-set |

UI: not yet wired (Phase 1 roadmap item).

---

### `cart_items`

Server-side cart. Client-side cart runs in parallel via Zustand (`diecast-cart`).

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| customer_id | string | FK → customers.id |
| product_id | string | FK → products.id |
| quantity | number | |
| created_at | string (ISO) | Auto-set |
| updated_at | string (ISO) | Auto-set |

---

### `wishlists`

Server-side wishlist. Client-side wishlist runs in parallel via Zustand (`diecast-wishlist`).

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| customer_id | string | FK → customers.id |
| product_id | string | FK → products.id |
| created_at | string (ISO) | Auto-set |

---

### `admin_users`

| Column | Type | Notes |
|--------|------|-------|
| id | string (uuid) | PK |
| user_id | string \| null | FK → Supabase Auth `auth.users.id` |
| email | string | |
| role | "admin" \| "super_admin" | |
| created_at | string (ISO) | Auto-set |
| last_login | string \| null | Updated on each admin session |

---

## Migration convention

New migration files go in `database/migrations/` with sequential numbering:

```
001_initial_schema.sql
002_add_reviews.sql
003_...
```

Never edit existing migration files. Always create a new numbered file.
