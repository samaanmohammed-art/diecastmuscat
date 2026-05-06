import type { Metadata } from "next";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import {
  fetchRevenueSeries,
  fetchTopProducts,
  fetchCategoryBreakdown,
  fetchCustomerGrowth,
} from "@/lib/admin-db";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AdminAnalyticsPage() {
  const [revenue, topProducts, categories, customerGrowth] = await Promise.all([
    fetchRevenueSeries(90),
    fetchTopProducts(6),
    fetchCategoryBreakdown(),
    fetchCustomerGrowth(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Insight</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Revenue, mix and audience health, last 90 days.
        </p>
      </header>

      <AnalyticsCharts
        revenue={revenue}
        topProducts={topProducts}
        categories={categories}
        customerGrowth={customerGrowth}
      />
    </div>
  );
}
