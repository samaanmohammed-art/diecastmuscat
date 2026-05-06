"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrencyOMR } from "@/lib/utils";

interface RevenuePoint {
  date: string;
  revenue: number;
}
interface TopProduct {
  name: string;
  units: number;
  revenue: number;
}
interface CategoryRow {
  category: string;
  revenue: number;
}
interface CustomerWeek {
  week: string;
  customers: number;
}

interface AnalyticsChartsProps {
  revenue: RevenuePoint[];
  topProducts: TopProduct[];
  categories: CategoryRow[];
  customerGrowth: CustomerWeek[];
}

const GOLD_VARIANTS = ["#F5CD5B", "#D4AF37", "#9A7D26", "#5C4814"];

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ value: number; name: string; payload: Record<string, unknown> }>;
  label?: string;
}

function GoldTooltip({ active, payload, label, formatter }: TooltipPayload & { formatter?: (n: number) => string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-elevated px-3 py-2 shadow-card text-xs">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {label}
        </div>
      )}
      {payload.map((p) => (
        <div key={p.name} className="mt-1 flex items-center gap-2">
          <span className="text-text-muted">{p.name}</span>
          <span className="font-display text-gold">
            {formatter ? formatter(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCharts({
  revenue,
  topProducts,
  categories,
  customerGrowth,
}: AnalyticsChartsProps) {
  function exportCsv() {
    const rows = [
      ["date", "revenue"],
      ...revenue.map((r) => [r.date, r.revenue.toString()]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Revenue trend */}
      <ChartCard
        eyebrow="Revenue · 90 days"
        title="Revenue trend"
        description="Daily revenue across the catalogue."
      >
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={revenue} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#5C5C58", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#1E1E1E" }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                minTickGap={28}
              />
              <YAxis
                tick={{ fill: "#5C5C58", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                content={<GoldTooltip formatter={(n) => formatCurrencyOMR(n)} />}
                cursor={{ stroke: "#D4AF37", strokeOpacity: 0.3 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#D4AF37", stroke: "#0A0A0A", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <ChartCard
          eyebrow="Catalogue"
          title="Top products"
          description="Units shipped, last 90 days."
        >
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#5C5C58", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#888880", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tickFormatter={(v) => (v.length > 18 ? v.slice(0, 17) + "…" : v)}
                />
                <Tooltip content={<GoldTooltip />} cursor={{ fill: "rgba(212,175,55,0.08)" }} />
                <Bar dataKey="units" fill="#D4AF37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Category breakdown */}
        <ChartCard
          eyebrow="Mix"
          title="Category breakdown"
          description="Share of revenue by category."
        >
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="revenue"
                  nameKey="category"
                  innerRadius={56}
                  outerRadius={96}
                  stroke="#0A0A0A"
                  paddingAngle={2}
                >
                  {categories.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={GOLD_VARIANTS[idx % GOLD_VARIANTS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<GoldTooltip formatter={(n) => formatCurrencyOMR(n)} />}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#888880", textTransform: "capitalize" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Customer growth */}
      <ChartCard
        eyebrow="Audience"
        title="Customer growth"
        description="Cumulative customers, last 12 weeks."
      >
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={customerGrowth} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: "#5C5C58", fontSize: 11 }}
                axisLine={{ stroke: "#1E1E1E" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#5C5C58", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<GoldTooltip />} cursor={{ fill: "rgba(212,175,55,0.08)" }} />
              <Bar dataKey="customers" fill="#9A7D26" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-text-muted">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
