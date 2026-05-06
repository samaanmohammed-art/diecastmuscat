import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "./CheckoutForm";
import type { Customer } from "@/types/database";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm your order with Diecast Muscat.",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  const { data: customerRaw } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const customer = customerRaw as Customer | null;

  const initialCustomer = {
    name: customer?.name ?? (user.user_metadata?.name as string | undefined) ?? "",
    email: customer?.email ?? user.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    city: customer?.city ?? "",
    country: customer?.country ?? "Oman",
    postal_code: customer?.postal_code ?? "",
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <header className="mb-10 lg:mb-14 flex flex-col gap-3">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
          Checkout
        </span>
        <h1 className="font-display text-4xl lg:text-5xl text-text">
          Confirm your order
        </h1>
        <p className="text-text-muted">
          A final review before we prepare your collection for dispatch.
        </p>
      </header>

      <CheckoutForm initialCustomer={initialCustomer} />
    </div>
  );
}
