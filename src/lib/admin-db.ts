// Admin-side data helpers — pull from Supabase + match the shapes the admin
// pages already render. When the database is empty (no orders / customers yet),
// these return sensible empties so dashboards still render without crashing.

import { createClient } from "@/lib/supabase/server";
import { SAMPLE_PRODUCTS } from "@/lib/sample-products";
import type {
  Order,
  OrderItem,
  Customer,
  Product,
  ProductCategory,
} from "@/types/database";

// ---------- Shared shapes (compatible with old MockOrder/MockCustomer) ----------

export interface AdminOrderItem extends OrderItem {
  image: string | null;
}

export interface AdminOrder extends Order {
  customer_name: string;
  customer_email: string;
  items: AdminOrderItem[];
}

export interface AdminCustomer extends Customer {
  total_orders: number;
  total_spent: number;
}

export interface RevenuePoint {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}

// ---------- Orders ----------

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  try {
    const supabase = await createClient();

    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (ordersErr) throw ordersErr;
    const orders = (ordersData ?? []) as unknown as Order[];
    if (orders.length === 0) return [];

    const customerIds = [...new Set(orders.map((o) => o.customer_id))];
    const { data: customersData, error: custErr } = await supabase
      .from("customers")
      .select("*")
      .in("id", customerIds);
    if (custErr) throw custErr;
    const customers = (customersData ?? []) as unknown as Customer[];

    const orderIds = orders.map((o) => o.id);
    const { data: itemsData, error: itemsErr } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);
    if (itemsErr) throw itemsErr;
    const items = (itemsData ?? []) as unknown as OrderItem[];

    const customerMap = new Map(customers.map((c) => [c.id, c]));
    const itemsByOrder = new Map<string, AdminOrderItem[]>();
    for (const item of items) {
      const sample = SAMPLE_PRODUCTS.find(
        (p) => p.sku === item.product_sku || p.id === item.product_id
      );
      const enriched: AdminOrderItem = {
        ...item,
        image: sample?.images[0] ?? null,
      };
      const arr = itemsByOrder.get(item.order_id) ?? [];
      arr.push(enriched);
      itemsByOrder.set(item.order_id, arr);
    }

    return orders.map<AdminOrder>((o) => {
      const customer = customerMap.get(o.customer_id);
      return {
        ...o,
        customer_name: customer?.name ?? "—",
        customer_email: customer?.email ?? "—",
        items: itemsByOrder.get(o.id) ?? [],
      };
    });
  } catch (err) {
    console.error("[admin-db.fetchAdminOrders]", err);
    return [];
  }
}

export async function fetchAdminOrderById(
  idOrInvoice: string
): Promise<AdminOrder | null> {
  try {
    const supabase = await createClient();
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${idOrInvoice},invoice_number.eq.${idOrInvoice}`)
      .maybeSingle();
    if (error) throw error;
    if (!orderData) return null;
    const order = orderData as unknown as Order;

    const [{ data: customerData }, { data: itemsData }] = await Promise.all([
      supabase
        .from("customers")
        .select("*")
        .eq("id", order.customer_id)
        .maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", order.id),
    ]);
    const customer = customerData as unknown as Customer | null;
    const items = ((itemsData ?? []) as unknown) as OrderItem[];

    const enrichedItems: AdminOrderItem[] = items.map((it) => {
      const sample = SAMPLE_PRODUCTS.find(
        (p) => p.sku === it.product_sku || p.id === it.product_id
      );
      return { ...it, image: sample?.images[0] ?? null };
    });

    return {
      ...order,
      customer_name: customer?.name ?? "—",
      customer_email: customer?.email ?? "—",
      items: enrichedItems,
    };
  } catch (err) {
    console.error("[admin-db.fetchAdminOrderById]", err);
    return null;
  }
}

// ---------- Customers ----------

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  try {
    const supabase = await createClient();

    const { data: customersData, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const customers = (customersData ?? []) as unknown as Customer[];
    if (customers.length === 0) return [];

    const { data: ordersData } = await supabase
      .from("orders")
      .select("customer_id,total_amount,status")
      .neq("status", "cancelled");
    const orders = (ordersData ?? []) as unknown as Pick<
      Order,
      "customer_id" | "total_amount" | "status"
    >[];

    const totals = new Map<string, { count: number; spent: number }>();
    for (const o of orders) {
      const cur = totals.get(o.customer_id) ?? { count: 0, spent: 0 };
      cur.count += 1;
      cur.spent += Number(o.total_amount ?? 0);
      totals.set(o.customer_id, cur);
    }

    return customers.map<AdminCustomer>((c) => {
      const t = totals.get(c.id) ?? { count: 0, spent: 0 };
      return {
        ...c,
        total_orders: t.count,
        total_spent: +t.spent.toFixed(3),
      };
    });
  } catch (err) {
    console.error("[admin-db.fetchAdminCustomers]", err);
    return [];
  }
}

// ---------- Dashboard stats ----------

export async function fetchAdminDashboardStats() {
  try {
    const supabase = await createClient();
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoIso = monthAgo.toISOString();

    const [
      { data: ordersData },
      { count: customerCount },
      { data: stockData },
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("total_amount,created_at")
        .gte("created_at", monthAgoIso)
        .neq("status", "cancelled"),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("products").select("stock"),
    ]);

    const ordersThisMonth = (ordersData ?? []) as unknown as {
      total_amount: number;
      created_at: string;
    }[];
    const stockRows = (stockData ?? []) as unknown as { stock: number }[];

    const revenue = ordersThisMonth.reduce(
      (s, o) => s + Number(o.total_amount ?? 0),
      0
    );
    const stockTotal = stockRows.reduce(
      (s, r) => s + Number(r.stock ?? 0),
      0
    );

    return {
      revenue: +revenue.toFixed(3),
      revenueTrend: 0,
      orders: ordersThisMonth.length,
      ordersTrend: 0,
      customers: customerCount ?? 0,
      customersTrend: 0,
      stock: stockTotal,
      stockTrend: 0,
    };
  } catch (err) {
    console.error("[admin-db.fetchAdminDashboardStats]", err);
    return {
      revenue: 0,
      revenueTrend: 0,
      orders: 0,
      ordersTrend: 0,
      customers: 0,
      customersTrend: 0,
      stock: 0,
      stockTrend: 0,
    };
  }
}

// ---------- Revenue series (90 days) ----------

export async function fetchRevenueSeries(days = 90): Promise<RevenuePoint[]> {
  try {
    const supabase = await createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const { data: ordersData } = await supabase
      .from("orders")
      .select("created_at,total_amount,status")
      .gte("created_at", sinceIso)
      .neq("status", "cancelled");
    const orders = (ordersData ?? []) as unknown as {
      created_at: string;
      total_amount: number;
    }[];

    const buckets = new Map<string, { revenue: number; orders: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      buckets.set(d.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
    }
    for (const o of orders) {
      const day = new Date(o.created_at).toISOString().slice(0, 10);
      const cur = buckets.get(day);
      if (cur) {
        cur.revenue += Number(o.total_amount ?? 0);
        cur.orders += 1;
      }
    }

    return [...buckets.entries()].map(([date, v]) => ({
      date,
      revenue: +v.revenue.toFixed(3),
      orders: v.orders,
    }));
  } catch (err) {
    console.error("[admin-db.fetchRevenueSeries]", err);
    return [];
  }
}

// ---------- Top products / category breakdown / customer growth ----------

export async function fetchTopProducts(limit = 5) {
  try {
    const supabase = await createClient();
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("product_id,product_name,quantity,subtotal");
    const items = (itemsData ?? []) as unknown as Pick<
      OrderItem,
      "product_id" | "product_name" | "quantity" | "subtotal"
    >[];

    const counts = new Map<
      string,
      { name: string; units: number; revenue: number }
    >();
    for (const it of items) {
      const cur = counts.get(it.product_id) ?? {
        name: it.product_name,
        units: 0,
        revenue: 0,
      };
      cur.units += it.quantity;
      cur.revenue += Number(it.subtotal ?? 0);
      counts.set(it.product_id, cur);
    }
    return [...counts.values()]
      .sort((a, b) => b.units - a.units)
      .slice(0, limit)
      .map((p) => ({ ...p, revenue: +p.revenue.toFixed(3) }));
  } catch (err) {
    console.error("[admin-db.fetchTopProducts]", err);
    return [];
  }
}

export async function fetchCategoryBreakdown() {
  try {
    const supabase = await createClient();

    const { data: productsData } = await supabase
      .from("products")
      .select("id,category");
    const products = (productsData ?? []) as unknown as Pick<
      Product,
      "id" | "category"
    >[];
    const catMap = new Map<string, ProductCategory>();
    for (const p of products) {
      catMap.set(p.id, p.category);
    }

    const { data: itemsData } = await supabase
      .from("order_items")
      .select("product_id,subtotal");
    const items = (itemsData ?? []) as unknown as Pick<
      OrderItem,
      "product_id" | "subtotal"
    >[];

    const totals: Record<ProductCategory, number> = {
      cars: 0,
      planes: 0,
      trucks: 0,
      bikes: 0,
    };
    for (const it of items) {
      const cat = catMap.get(it.product_id);
      if (cat) totals[cat] += Number(it.subtotal ?? 0);
    }

    return Object.entries(totals).map(([category, revenue]) => ({
      category,
      revenue: +revenue.toFixed(3),
    }));
  } catch (err) {
    console.error("[admin-db.fetchCategoryBreakdown]", err);
    return [
      { category: "cars", revenue: 0 },
      { category: "planes", revenue: 0 },
      { category: "trucks", revenue: 0 },
      { category: "bikes", revenue: 0 },
    ];
  }
}

export async function fetchCustomerGrowth(): Promise<
  Array<{ week: string; customers: number }>
> {
  try {
    const supabase = await createClient();

    const { data: customersData } = await supabase
      .from("customers")
      .select("created_at")
      .order("created_at", { ascending: true });
    const customers = (customersData ?? []) as unknown as { created_at: string }[];

    // 12 weeks of cumulative growth
    const weeks: Array<{ week: string; customers: number }> = [];
    let running = 0;
    for (let i = 11; i >= 0; i--) {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      running += customers.filter((c) => {
        const created = new Date(c.created_at);
        return created >= start && created < end;
      }).length;
      weeks.push({
        week: end.toISOString().slice(5, 10),
        customers: running,
      });
    }
    return weeks;
  } catch (err) {
    console.error("[admin-db.fetchCustomerGrowth]", err);
    return [];
  }
}
