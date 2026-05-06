import Link from "next/link";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import type { Metadata } from "next";
import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import {
  MOCK_ORDERS,
  MOCK_REVENUE_DATA,
  getDashboardStats,
} from "@/lib/mock-admin";
import type { OrderStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "gold" | "success" | "warning" | "error"
> = {
  pending: "warning",
  processing: "gold",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
};

export default async function AdminDashboardPage() {
  const stats = getDashboardStats();
  const recentOrders = [...MOCK_ORDERS]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Overview</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Performance snapshot for the last 30 days.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          label="Revenue"
          value={formatCurrencyOMR(stats.revenue)}
          trend={stats.revenueTrend}
          icon={DollarSign}
        />
        <StatsCard
          label="Orders"
          value={stats.orders.toString()}
          trend={stats.ordersTrend}
          icon={ShoppingCart}
        />
        <StatsCard
          label="Active Customers"
          value={stats.customers.toString()}
          trend={stats.customersTrend}
          icon={Users}
        />
        <StatsCard
          label="Stock Units"
          value={stats.stock.toString()}
          trend={stats.stockTrend}
          icon={Package}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
                Revenue · 90 days
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                Sales trend
              </h2>
            </div>
            <Badge variant="gold">OMR</Badge>
          </div>
          <div className="mt-6">
            <SalesChart data={MOCK_REVENUE_DATA} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
                Latest activity
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                Recent orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-[0.16em] text-text-muted hover:text-gold transition-colors"
            >
              View all
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {recentOrders.map((order) => (
              <li key={order.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-text truncate">
                    {order.customer_name}
                  </div>
                  <div className="text-xs text-text-dim">
                    {order.invoice_number} · {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-display text-sm text-gold">
                    {formatCurrencyOMR(order.total_amount)}
                  </span>
                  <Badge variant={STATUS_VARIANT[order.status]}>
                    {order.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
