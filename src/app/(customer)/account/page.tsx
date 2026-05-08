import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import { ProfileForm } from "./ProfileForm";
import { WishlistCard } from "@/components/account/WishlistCard";
import type { Customer, Order, OrderStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage your profile, orders, and addresses with Diecast Muscat.",
};

const STATUS_VARIANT: Record<OrderStatus, "warning" | "gold" | "success" | "error" | "default"> = {
  pending: "warning",
  processing: "warning",
  shipped: "gold",
  delivered: "success",
  cancelled: "error",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: customerRaw } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const customer = customerRaw as Customer | null;

  let recentOrders: Order[] = [];
  if (customer) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(3);
    recentOrders = (data ?? []) as Order[];
  }

  const profile = {
    name: customer?.name ?? (user.user_metadata?.name as string | undefined) ?? "",
    email: customer?.email ?? user.email ?? "",
    phone: customer?.phone ?? "",
  };

  const address = {
    address: customer?.address ?? "",
    city: customer?.city ?? "",
    country: customer?.country ?? "Oman",
    postal_code: customer?.postal_code ?? "",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12 lg:py-16">
      <header className="mb-6 sm:mb-10 lg:mb-14 flex flex-col gap-2 sm:gap-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-gold">
          Your account
        </span>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-text leading-tight">
          Welcome back{profile.name ? `, ${profile.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-xs sm:text-base text-text-muted">
          Curate your collection, track dispatches, and manage your details.
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <Card title="Profile" description="Keep your details current.">
            <ProfileForm initialValues={profile} />
          </Card>

          <Card
            title="Recent orders"
            description="Your last three orders."
            action={
              recentOrders.length > 0 ? (
                <Link
                  href="/account/orders"
                  className="text-xs uppercase tracking-[0.18em] text-gold hover:underline inline-flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null
            }
          >
            {recentOrders.length === 0 ? (
              <EmptyState
                icon={<Package className="h-6 w-6 text-text-dim" />}
                title="No orders yet"
                description="Your collection journey begins with your first piece."
                cta={
                  <Button asChild size="sm">
                    <Link href="/products">Browse models</Link>
                  </Button>
                }
              />
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-display text-sm text-text">
                        {order.invoice_number ?? `#${order.id.slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[order.status]}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                    <p className="font-display text-sm text-gold">
                      {formatCurrencyOMR(order.total_amount)}
                    </p>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-xs uppercase tracking-[0.18em] text-text-muted hover:text-gold transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        <aside className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <WishlistCard />

          <Card title="Address" description="Default delivery destination.">
            {address.address ? (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gold/70 mt-0.5 shrink-0" />
                <div className="text-text-muted leading-relaxed">
                  <p className="text-text">{address.address}</p>
                  <p>
                    {[address.city, address.postal_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{address.country}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                No address on file. Add one at checkout.
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-xl text-text">{title}</h2>
          {description && (
            <p className="text-sm text-text-muted mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-8">
      <div className="h-12 w-12 rounded-full border border-border bg-surface-elevated flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-display text-base text-text">{title}</p>
        <p className="text-sm text-text-muted mt-0.5 max-w-xs">
          {description}
        </p>
      </div>
      {cta}
    </div>
  );
}
