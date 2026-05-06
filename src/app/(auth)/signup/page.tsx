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

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/auth/callback`
              : undefined,
        },
      });

      if (error) {
        toast.error(error.message || "Unable to create account");
        return;
      }

      if (data.user) {
        const customerRow = {
          user_id: data.user.id,
          email: values.email,
          name: values.name,
          country: "Oman",
          phone: null,
          address: null,
          city: null,
          postal_code: null,
        };
        const { error: customerError } = await supabase
          .from("customers")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(customerRow as never);

        if (customerError) {
          // Non-fatal: account was created. Surface but continue success state.
          console.error("Customer profile insert failed:", customerError.message);
        }
      }

      setSubmittedEmail(values.email);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl text-text leading-tight">Check your email</h1>
          <p className="text-sm text-text-muted">
            We sent a confirmation link to{" "}
            <span className="text-text">{submittedEmail}</span>. Click it to activate your
            account.
          </p>
        </div>
        <Link
          href="/login"
          className="text-sm text-gold hover:underline"
        >
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-text leading-tight">Create your collection</h1>
        <p className="text-sm text-text-muted">
          Join collectors curating premium diecast across Oman.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Mohammed Al Saidi"
            aria-invalid={!!errors.name}
            className={cn(errors.name && "border-error focus-visible:border-error focus-visible:ring-error/30")}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
        </div>

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

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            className={cn(errors.password && "border-error focus-visible:border-error focus-visible:ring-error/30")}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            aria-invalid={!!errors.confirmPassword}
            className={cn(errors.confirmPassword && "border-error focus-visible:border-error focus-visible:ring-error/30")}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={submitting} className="mt-2">
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-text-muted text-center">
        Already a collector?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
