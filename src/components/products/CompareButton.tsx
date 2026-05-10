"use client";

import { GitCompareArrows } from "lucide-react";
import { useCompareStore } from "@/stores/compare";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  productId: string;
  className?: string;
}

export function CompareButton({ productId, className }: CompareButtonProps) {
  const toggle = useCompareStore((s) => s.toggle);
  const ids = useCompareStore((s) => s.ids);
  const mounted = useMounted();

  const active = mounted && ids.includes(productId);
  const full = mounted && ids.length >= 4 && !active;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!full) toggle(productId);
      }}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      aria-pressed={active}
      disabled={full}
      className={cn(
        "inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors",
        "border border-border-strong/60 bg-bg/70 backdrop-blur",
        "hover:border-gold/60 hover:bg-bg/90",
        active && "border-gold/70 bg-gold/15",
        full && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      <GitCompareArrows
        className={cn(
          "h-3.5 w-3.5 transition-colors",
          active ? "text-gold" : "text-text-muted"
        )}
        strokeWidth={1.6}
      />
    </button>
  );
}
