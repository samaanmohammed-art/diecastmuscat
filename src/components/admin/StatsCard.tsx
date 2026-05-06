import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
}

export function StatsCard({
  label,
  value,
  trend,
  trendLabel = "vs last month",
  icon: Icon,
}: StatsCardProps) {
  const positive = typeof trend === "number" && trend >= 0;
  const negative = typeof trend === "number" && trend < 0;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
          {label}
        </span>
        {Icon && (
          <div className="h-9 w-9 rounded-md border border-border bg-surface-elevated flex items-center justify-center">
            <Icon className="h-4 w-4 text-gold" />
          </div>
        )}
      </div>
      <div className="mt-5 font-display text-4xl font-semibold tracking-tight text-text">
        {value}
      </div>
      {typeof trend === "number" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
              positive && "bg-success/10 text-success",
              negative && "bg-error/10 text-error"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
          <span className="text-text-muted">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
