"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Banknote,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import { formatCurrencyOMR, cn } from "@/lib/utils";

const checkoutSchema = z.object({
  // Customer info
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  // Shipping
  address: z.string().min(5, "Please enter a delivery address"),
  city: z.string().min(2, "Please enter your city"),
  country: z.string().min(2, "Please enter the country"),
  postal_code: z.string().min(3, "Please enter a postal code"),
  // Payment
  payment_method: z.enum(["cod", "bank_transfer", "card"]),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface InitialCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
}

const PAYMENT_OPTIONS: Array<{
  value: CheckoutFormValues["payment_method"];
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}> = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives at your door.",
    icon: Banknote,
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description:
      "Receive bank details by email. Order ships once payment clears.",
    icon: Landmark,
  },
  {
    value: "card",
    label: "Card payment",
    description: "Secure card processing — coming soon.",
    icon: CreditCard,
    disabled: true,
  },
];

export function CheckoutForm({
  initialCustomer,
}: {
  initialCustomer: InitialCustomer;
}) {
  const router = useRouter();
  const cart = useCart();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      ...initialCustomer,
      payment_method: "cod",
      notes: "",
    },
  });

  const selectedPayment = watch("payment_method");

  // Redirect to /cart if cart becomes empty (client-only since cart is in localStorage)
  useEffect(() => {
    if (cart.isEmpty) {
      router.replace("/cart");
    }
  }, [cart.isEmpty, router]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cart.isEmpty) {
      toast.error("Your collection is empty.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
        shipping_address: {
          name: values.name,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          postal_code: values.postal_code,
        },
        payment_method: values.payment_method,
        notes: values.notes ?? "",
        items: cart.items.map((line) => ({
          product_id: line.product.id,
          quantity: line.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Unable to place your order");
      }

      const data = (await res.json()) as { order: { id: string } };
      cart.clearCart();
      toast.success("Order confirmed");
      router.push(`/checkout/success/${data.order.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to place your order";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row gap-10 lg:gap-14"
    >
      <div className="flex-1 flex flex-col gap-10">
        <Section
          step="01"
          title="Customer information"
          description="So we can keep you informed about your order."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message}>
              <Input {...register("name")} autoComplete="name" />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field
              label="Phone number"
              error={errors.phone?.message}
              className="sm:col-span-2"
            >
              <Input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+968 ..."
              />
            </Field>
          </div>
        </Section>

        <Section
          step="02"
          title="Shipping address"
          description="Where should we deliver your collection?"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Address"
              error={errors.address?.message}
              className="sm:col-span-2"
            >
              <Input
                {...register("address")}
                autoComplete="street-address"
                placeholder="Building, street, area"
              />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <Input {...register("city")} autoComplete="address-level2" />
            </Field>
            <Field label="Postal code" error={errors.postal_code?.message}>
              <Input
                {...register("postal_code")}
                autoComplete="postal-code"
              />
            </Field>
            <Field
              label="Country"
              error={errors.country?.message}
              className="sm:col-span-2"
            >
              <Input
                {...register("country")}
                autoComplete="country-name"
              />
            </Field>
          </div>
        </Section>

        <Section
          step="03"
          title="Payment method"
          description="Choose how you would like to settle your order."
        >
          <div className="grid gap-3">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedPayment === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  disabled={option.disabled}
                  onClick={() =>
                    !option.disabled &&
                    setValue("payment_method", option.value, {
                      shouldDirty: true,
                    })
                  }
                  className={cn(
                    "text-left rounded-lg border p-5 flex items-start gap-4 transition-all",
                    isSelected
                      ? "border-gold bg-gold/5 shadow-[0_0_0_1px_rgba(212,175,55,0.4)]"
                      : "border-border bg-surface hover:border-border-strong",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-md flex items-center justify-center border",
                      isSelected
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : "border-border bg-surface-elevated text-text-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display text-base text-text">
                        {option.label}
                      </p>
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-2 transition-colors",
                          isSelected
                            ? "border-gold bg-gold"
                            : "border-border-strong"
                        )}
                      />
                    </div>
                    <p className="text-sm text-text-muted mt-1">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("payment_method")} />
          {errors.payment_method?.message && (
            <p className="mt-2 text-xs text-error">
              {errors.payment_method.message}
            </p>
          )}
        </Section>

        <Section
          step="04"
          title="Review your order"
          description="A final look before we begin preparing your dispatch."
        >
          <div className="rounded-lg border border-border bg-surface divide-y divide-border">
            {cart.items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4"
              >
                <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-surface-elevated border border-border">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {product.brand && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                      {product.brand}
                    </p>
                  )}
                  <p className="font-display text-sm leading-snug truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Qty {quantity}
                  </p>
                </div>
                <p className="text-sm text-gold whitespace-nowrap">
                  {formatCurrencyOMR(product.price * quantity)}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <aside className="lg:w-96 lg:shrink-0">
        <div className="lg:sticky lg:top-24 flex flex-col gap-4">
          <CartSummary
            totals={{
              subtotal: cart.subtotal,
              shipping: cart.shipping,
              vat: cart.vat,
              total: cart.total,
              itemCount: cart.itemCount,
            }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing order
                </>
              ) : (
                <>Place order</>
              )}
            </Button>
            <p className="flex items-center gap-2 text-[11px] text-text-dim">
              <ShieldCheck className="h-3.5 w-3.5 text-gold/70" />
              Encrypted checkout. No card data stored on our servers.
            </p>
          </CartSummary>
          <Link
            href="/cart"
            className="text-center text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold transition-colors"
          >
            Edit your collection
          </Link>
        </div>
      </aside>
    </form>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 lg:p-8">
      <div className="flex items-start gap-4 mb-6">
        <span className="font-display text-2xl text-gold/70 leading-none">
          {step}
        </span>
        <div>
          <h2 className="font-display text-xl text-text">{title}</h2>
          <p className="text-sm text-text-muted mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
