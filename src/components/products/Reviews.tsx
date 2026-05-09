import { Star, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchReviews, fetchReviewStats } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { ReviewForm } from "./ReviewForm";
import { Badge } from "@/components/ui/badge";

interface ReviewsProps {
  productId: string;
  productRating: number;
  reviewCount: number;
}

export async function Reviews({ productId, productRating, reviewCount }: ReviewsProps) {
  const [{ reviews, total }, stats, supabase] = await Promise.all([
    fetchReviews(productId),
    fetchReviewStats(productId),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasReviewed = false;
  if (user) {
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (customer) {
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId)
        .eq("customer_id", (customer as { id: string }).id)
        .maybeSingle();
      hasReviewed = !!existing;
    }
  }

  const maxCount = Math.max(...Object.values(stats.histogram), 1);

  return (
    <section className="mt-12 lg:mt-16">
      <h2 className="text-[10px] uppercase tracking-[0.32em] text-gold mb-6">
        Collector Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        {/* Summary panel */}
        <div className="flex flex-col gap-5">
          {reviewCount > 0 ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl text-text leading-none">
                  {productRating.toFixed(1)}
                </span>
                <div className="flex flex-col gap-1">
                  <RatingStars rating={productRating} size="md" />
                  <span className="text-xs text-text-dim">
                    {total} {total === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.histogram[star] ?? 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-text-dim w-3 text-right">{star}</span>
                      <Star className="h-3 w-3 fill-gold text-gold shrink-0" />
                      <div className="flex-1 h-1.5 rounded-full bg-border-strong overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold transition-all duration-500"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-text-dim w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <p className="font-display text-2xl text-text mb-2">No reviews yet</p>
              <p className="text-sm text-text-muted">
                Be the first collector to review this piece.
              </p>
            </div>
          )}
        </div>

        {/* Reviews list + form */}
        <div className="flex flex-col gap-6">
          {reviews.length > 0 && (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-lg border border-border bg-surface/30 p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-surface-elevated border border-border-strong flex items-center justify-center text-xs font-mono text-text-muted shrink-0">
                        {review.customer_name?.[0]?.toUpperCase() ?? "C"}
                      </div>
                      <div>
                        <p className="text-sm text-text font-medium leading-none mb-1">
                          {review.customer_name ?? "Collector"}
                        </p>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {review.is_verified_purchase && (
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 text-success border-success/30"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      <span className="text-[11px] text-text-dim">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>

                  {review.title && (
                    <p className="mt-3 font-display text-base text-text">
                      {review.title}
                    </p>
                  )}
                  {review.comment && (
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {user && !hasReviewed && <ReviewForm productId={productId} />}

          {!user && (
            <p className="text-sm text-text-muted">
              <a href="/login" className="text-gold hover:underline">
                Sign in
              </a>{" "}
              to leave a review.
            </p>
          )}

          {user && hasReviewed && reviews.length === 0 && (
            <p className="text-sm text-text-muted italic">
              You have reviewed this piece.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
