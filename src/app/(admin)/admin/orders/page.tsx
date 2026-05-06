import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { fetchAdminOrders } from "@/lib/admin-db";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await fetchAdminOrders();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Fulfilment</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {orders.length === 0
            ? "No orders yet. They'll appear here as customers check out."
            : `${orders.length} orders across all statuses. Click a row to view detail.`}
        </p>
      </header>
      <OrdersTable orders={orders} />
    </div>
  );
}
