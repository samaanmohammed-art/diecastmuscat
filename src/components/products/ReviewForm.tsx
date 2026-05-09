"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(10, "Please write at least 10 characters").max(1000),
});

type FormData = z.infer<typeof schema>;

export function ReviewForm({ productId }: { productId: string }) {
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, title: "", comment: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...data }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error((json as { error?: string }).error ?? "Could not submit review. Please try again.");
      return;
    }

    setSubmitted(true);
    toast.success("Your review has been submitted.");
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-gold">
        Thank you — your review has been submitted.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-border bg-surface/30 p-4 sm:p-5 space-y-4"
    >
      <h3 className="font-display text-base text-text">Share your experience</h3>

      {/* Star picker */}
      <div>
        <Label className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2 block">
          Your rating
        </Label>
        <div
          className="flex gap-1"
          onMouseLeave={() => setHovered(0)}
          role="group"
          aria-label="Select star rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  star <= (hovered || rating) ? "fill-gold text-gold" : "text-border-strong"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-xs text-error">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <Label
          htmlFor="review-title"
          className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2 block"
        >
          Headline <span className="normal-case">(optional)</span>
        </Label>
        <Input
          id="review-title"
          placeholder="Summarise your experience"
          {...register("title")}
          className="bg-bg border-border-strong"
        />
      </div>

      {/* Comment */}
      <div>
        <Label
          htmlFor="review-comment"
          className="text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2 block"
        >
          Your review
        </Label>
        <Textarea
          id="review-comment"
          rows={4}
          placeholder="What do you love about this piece? Scale, finish, packaging?"
          {...register("comment")}
          className="bg-bg border-border-strong resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-error">{errors.comment.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gold text-bg hover:bg-gold-bright uppercase tracking-[0.2em] text-xs"
      >
        {isSubmitting ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
