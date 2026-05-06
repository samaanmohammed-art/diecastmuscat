import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import { SuccessAnimation } from "./SuccessAnimation";
import type { Order } from "@/types/database";

type OrderWithCustomer = Order & {
  customer: { user_id: string | null } | null;
};

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your order with Diecast Muscat has been confirmed.",
};

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/checkout/success/${id}`);

  const { data: orderRaw } = await supabase
    .from("orders")
    .select("*, customer:customers(user_id)")
    .eq("id", id)
    .maybeSingle();
  const order = orderRaw as OrderWithCustomer | null;

  if (!order) notFound();
  if (order.customer && order.customer.user_id !== user.id) notFound();

  const estimatedDeliveryStart = new Date();
  estimatedDeliveryStart.setDate(estimatedDeliveryStart.getDate() + 3);
  const estimatedDeliveryEnd = new Date();
  estimatedDeliveryEnd.setDate(estimatedDeliveryEnd.getDate() + 5);

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <SuccessAnimation>
        <div className="flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <CheckCircle2
                className="h-12 w-12 text-gold"
                strokeWidth={1.5}
              />
            </div>
            <div
              className="absolute inset-0 rounded-full bg-gold/20 blur-xl -z-10"
              aria-hidden
            />
          </div>

          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
              Order confirmed
            </span>
            <h1 className="font-display text-4xl lg:text-5xl text-text">
              Thank you for your order
            </h1>
            <p className="text-text-muted max-w-md mx-auto">
              We have received your order and will begin preparing your
              collection. A confirmation has been sent to your email.
            </p>
          </div>

          <div className="w-full max-w-xl rounded-xl border border-border bg-surface p-6 lg:p-8 mt-4 grid sm:grid-cols-3 gap-6 text-left">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                Order
              </p>
              <p className="font-display text-base text-text mt-1 break-all">
                {order.invoice_number ?? `#${order.id.slice(0, 8)}`}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                Total
              </p>
              <p className="font-display text-base text-gold mt-1">
                {formatCurrencyOMR(order.total_amount)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">
                Placed
              </p>
              <p className="font-display text-base text-text mt-1">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-text-muted bg-surface-elevated/60 border border-border rounded-full px-5 py-2.5">
            <Truck className="h-4 w-4 text-gold/80" />
            <span>
              Estimated delivery {formatDate(estimatedDeliveryStart)} —{" "}
              {formatDate(estimatedDeliveryEnd)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button asChild size="lg">
              <Link href={`/account/orders/${order.id}`}>
                View order
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </SuccessAnimation>
    </div>
  );
}
