import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface RatingStarsProps {
  rating: number;
  size?: Size;
  count?: number;
  className?: string;
}

const SIZE_MAP: Record<Size, { star: string; text: string }> = {
  sm: { star: "h-3 w-3", text: "text-xs" },
  md: { star: "h-4 w-4", text: "text-sm" },
  lg: { star: "h-5 w-5", text: "text-base" },
};

export function RatingStars({ rating, size = "md", count, className }: RatingStarsProps) {
  const dims = SIZE_MAP[size];
  const rounded = Math.round(rating * 2) / 2; // half-star precision

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <span key={i} className="relative inline-flex">
              <Star
                className={cn(
                  dims.star,
                  filled ? "fill-gold text-gold" : "text-border-strong"
                )}
              />
              {half && (
                <Star
                  className={cn(
                    dims.star,
                    "absolute inset-0 fill-gold text-gold",
                    "[clip-path:inset(0_50%_0_0)]"
                  )}
                />
              )}
            </span>
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className={cn("text-text-muted", dims.text)}>
          {rating.toFixed(1)}
          <span className="text-text-dim"> · {count} {count === 1 ? "review" : "reviews"}</span>
        </span>
      )}
    </div>
  );
}
