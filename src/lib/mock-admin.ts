// Mock data for admin dashboard until Supabase is wired up.
// Provides orders, customers and 90-day revenue series.

import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Customer,
  ShippingAddress,
} from "@/types/database";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";

const today = new Date();
function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ---------- Customers ----------

export interface MockCustomer extends Customer {
  total_orders: number;
  total_spent: number;
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: "cust-0001",
    user_id: "u-0001",
    email: "ahmed.alhinai@example.om",
    name: "Ahmed Al-Hinai",
    phone: "+968 9123 4567",
    address: "Way 2105, Madinat Sultan Qaboos",
    city: "Muscat",
    country: "Oman",
    postal_code: "115",
    created_at: daysAgo(120),
    updated_at: daysAgo(2),
    total_orders: 6,
    total_spent: 842.5,
  },
  {
    id: "cust-0002",
    user_id: "u-0002",
    email: "sara.balushi@example.om",
    name: "Sara Al-Balushi",
    phone: "+968 9876 5432",
    address: "Al Khuwair 33",
    city: "Muscat",
    country: "Oman",
    postal_code: "133",
    created_at: daysAgo(95),
    updated_at: daysAgo(7),
    total_orders: 3,
    total_spent: 412.0,
  },
  {
    id: "cust-0003",
    user_id: "u-0003",
    email: "khalid.kindi@example.om",
    name: "Khalid Al-Kindi",
    phone: "+968 9555 1122",
    address: "Salalah Gardens",
    city: "Salalah",
    country: "Oman",
    postal_code: "211",
    created_at: daysAgo(78),
    updated_at: daysAgo(1),
    total_orders: 9,
    total_spent: 1284.75,
  },
  {
    id: "cust-0004",
    user_id: "u-0004",
    email: "noura.zadjali@example.om",
    name: "Noura Al-Zadjali",
    phone: "+968 9444 8821",
    address: "Qurum Heights",
    city: "Muscat",
    country: "Oman",
    postal_code: "112",
    created_at: daysAgo(60),
    updated_at: daysAgo(14),
    total_orders: 2,
    total_spent: 198.0,
  },
  {
    id: "cust-0005",
    user_id: "u-0005",
    email: "tariq.lawati@example.om",
    name: "Tariq Al-Lawati",
    phone: "+968 9333 2210",
    address: "Sohar Industrial",
    city: "Sohar",
    country: "Oman",
    postal_code: "311",
    created_at: daysAgo(48),
    updated_at: daysAgo(3),
    total_orders: 4,
    total_spent: 567.25,
  },
  {
    id: "cust-0006",
    user_id: "u-0006",
    email: "maya.harthy@example.om",
    name: "Maya Al-Harthy",
    phone: "+968 9222 1188",
    address: "Nizwa Old Town",
    city: "Nizwa",
    country: "Oman",
    postal_code: "611",
    created_at: daysAgo(40),
    updated_at: daysAgo(8),
    total_orders: 1,
    total_spent: 92.0,
  },
  {
    id: "cust-0007",
    user_id: "u-0007",
    email: "yousuf.farsi@example.om",
    name: "Yousuf Al-Farsi",
    phone: "+968 9911 7766",
    address: "Bawshar",
    city: "Muscat",
    country: "Oman",
    postal_code: "131",
    created_at: daysAgo(30),
    updated_at: daysAgo(5),
    total_orders: 5,
    total_spent: 723.0,
  },
  {
    id: "cust-0008",
    user_id: "u-0008",
    email: "lulwa.saidi@example.om",
    name: "Lulwa Al-Saidi",
    phone: "+968 9888 4433",
    address: "Sur Corniche",
    city: "Sur",
    country: "Oman",
    postal_code: "411",
    created_at: daysAgo(20),
    updated_at: daysAgo(2),
    total_orders: 2,
    total_spent: 245.5,
  },
];

// ---------- Orders ----------

export interface MockOrderItem extends OrderItem {
  image: string | null;
}

export interface MockOrder extends Order {
  customer_name: string;
  customer_email: string;
  items: MockOrderItem[];
}

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

function makeAddress(c: MockCustomer): ShippingAddress {
  return {
    name: c.name,
    phone: c.phone ?? "",
    address: c.address ?? "",
    city: c.city ?? "",
    country: c.country,
    postal_code: c.postal_code ?? "",
  };
}

function makeItems(seed: number): MockOrderItem[] {
  const count = (seed % 3) + 1;
  const items: MockOrderItem[] = [];
  for (let i = 0; i < count; i++) {
    const product = SAMPLE_PRODUCTS[(seed + i * 3) % SAMPLE_PRODUCTS.length];
    const quantity = ((seed + i) % 3) + 1;
    items.push({
      id: `oi-${seed}-${i}`,
      order_id: `ord-${seed}`,
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
      quantity,
      price: product.price,
      subtotal: +(product.price * quantity).toFixed(3),
      created_at: daysAgo(seed),
      image: product.images[0] ?? null,
    });
  }
  return items;
}

function buildOrder(index: number): MockOrder {
  const customer = MOCK_CUSTOMERS[index % MOCK_CUSTOMERS.length];
  const items = makeItems(index + 1);
  const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
  const shipping = subtotal >= 100 ? 0 : 5;
  const tax = +(subtotal * 0.05).toFixed(3);
  const total = +(subtotal + shipping + tax).toFixed(3);
  const status = STATUSES[index % STATUSES.length];
  const payment_status: PaymentStatus =
    status === "cancelled"
      ? "refunded"
      : status === "pending"
        ? "pending"
        : PAYMENT_STATUSES[(index + 1) % PAYMENT_STATUSES.length] === "failed"
          ? "paid"
          : "paid";
  const createdDays = (index * 3) % 90;
  return {
    id: `ord-${(index + 1).toString().padStart(4, "0")}`,
    customer_id: customer.id,
    customer_name: customer.name,
    customer_email: customer.email,
    total_amount: total,
    subtotal,
    shipping_cost: shipping,
    tax_amount: tax,
    status,
    payment_status,
    payment_id: `pay-${index + 1}`,
    payment_method: index % 2 === 0 ? "card" : "cod",
    invoice_number: `DM-2026-${(1000 + index).toString()}`,
    shipping_address: makeAddress(customer),
    notes: null,
    created_at: daysAgo(createdDays),
    updated_at: daysAgo(Math.max(0, createdDays - 1)),
    shipped_at: status === "shipped" || status === "delivered" ? daysAgo(Math.max(0, createdDays - 2)) : null,
    delivered_at: status === "delivered" ? daysAgo(Math.max(0, createdDays - 4)) : null,
    items,
  };
}

export const MOCK_ORDERS: MockOrder[] = Array.from({ length: 24 }, (_, i) => buildOrder(i));

// ---------- Revenue series (90 days) ----------

export interface RevenuePoint {
  date: string; // ISO short
  revenue: number;
  orders: number;
}

export const MOCK_REVENUE_DATA: RevenuePoint[] = (() => {
  const points: RevenuePoint[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Smooth-ish wave with noise
    const base = 180 + Math.sin(i / 7) * 60 + Math.cos(i / 3) * 25;
    const noise = ((i * 37) % 50) - 25;
    const revenue = Math.max(40, Math.round((base + noise) * 1000) / 1000);
    const orders = Math.max(1, Math.round(revenue / 95));
    points.push({
      date: d.toISOString().slice(0, 10),
      revenue,
      orders,
    });
  }
  return points;
})();

// ---------- Aggregates ----------

export function getDashboardStats() {
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const ordersThisMonth = MOCK_ORDERS.filter(
    (o) => new Date(o.created_at) >= monthAgo
  );
  const revenueThisMonth = ordersThisMonth.reduce((s, o) => s + o.total_amount, 0);
  const stockTotal = SAMPLE_PRODUCTS.reduce((s, p) => s + p.stock, 0);

  return {
    revenue: +revenueThisMonth.toFixed(3),
    revenueTrend: 12.4,
    orders: ordersThisMonth.length,
    ordersTrend: 8.1,
    customers: MOCK_CUSTOMERS.length,
    customersTrend: 4.6,
    stock: stockTotal,
    stockTrend: -2.3,
  };
}

export function getTopProducts(limit = 5) {
  // Synthesise sales count from order items
  const counts = new Map<string, { name: string; units: number; revenue: number }>();
  for (const order of MOCK_ORDERS) {
    for (const item of order.items) {
      const cur = counts.get(item.product_id) ?? {
        name: item.product_name,
        units: 0,
        revenue: 0,
      };
      cur.units += item.quantity;
      cur.revenue += item.subtotal;
      counts.set(item.product_id, cur);
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, limit);
}

export function getCategoryBreakdown() {
  const acc: Record<string, number> = { cars: 0, planes: 0, trucks: 0, bikes: 0 };
  for (const order of MOCK_ORDERS) {
    for (const item of order.items) {
      const product = SAMPLE_PRODUCTS.find((p) => p.id === item.product_id);
      if (!product) continue;
      acc[product.category] = (acc[product.category] ?? 0) + item.subtotal;
    }
  }
  return Object.entries(acc).map(([category, revenue]) => ({
    category,
    revenue: +revenue.toFixed(3),
  }));
}

export function getCustomerGrowth() {
  // 12 weeks
  const weeks: { week: string; customers: number }[] = [];
  let total = 0;
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    total += 2 + ((i * 13) % 5);
    weeks.push({
      week: d.toISOString().slice(5, 10),
      customers: total,
    });
  }
  return weeks;
}
