"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrencyOMR } from "@/lib/utils";

interface SalesChartProps {
  data: { date: string; revenue: number }[];
  height?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string; revenue: number } }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border-strong bg-surface-elevated px-3 py-2 shadow-card">
      <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-base text-gold">
        {formatCurrencyOMR(point.revenue)}
      </div>
    </div>
  );
}

export function SalesChart({ data, height = 320 }: SalesChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="transparent" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#5C5C58", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#1E1E1E" }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: "#5C5C58", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${Math.round(v)}`}
            width={48}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#D4AF37", strokeOpacity: 0.3, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#D4AF37"
            strokeWidth={2}
            fill="url(#salesGold)"
            activeDot={{ r: 4, stroke: "#0A0A0A", strokeWidth: 2, fill: "#D4AF37" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
