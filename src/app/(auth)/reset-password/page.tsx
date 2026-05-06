"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/api/auth/callback?next=/account`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo,
      });

      if (error) {
        toast.error(error.message || "Unable to send reset email");
        return;
      }

      toast.success("Reset link sent. Check your inbox.");
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-text leading-tight">Reset password</h1>
        <p className="text-sm text-text-muted">
          Enter your email and we will send a secure link to set a new password.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-error focus-visible:border-error focus-visible:ring-error/30")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
        </div>

        <Button type="submit" size="lg" disabled={submitting} className="mt-2">
          {submitting ? "Sending..." : sent ? "Resend link" : "Send reset link"}
        </Button>
      </form>

      <p className="text-sm text-text-muted text-center">
        Remembered it?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
