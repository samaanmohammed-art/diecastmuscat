import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { MOCK_ORDERS } from "@/lib/mock-admin";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = [...MOCK_ORDERS].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Fulfilment</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {orders.length} orders across all statuses. Click a row to view detail.
        </p>
      </header>
      <OrdersTable orders={orders} />
    </div>
  );
}
