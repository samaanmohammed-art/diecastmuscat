import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";
import { fetchAdminCustomers } from "@/lib/admin-db";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  const all = await fetchAdminCustomers();
  const customers = [...all].sort((a, b) => b.total_spent - a.total_spent);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Audience</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Customers
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {customers.length} active customers, ranked by lifetime value.
        </p>
      </header>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-elevated text-left text-[10px] uppercase tracking-[0.18em] text-text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Orders</th>
                <th className="px-4 py-3 font-medium text-right">Lifetime value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-surface-elevated/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border border-gold-muted/40 flex items-center justify-center">
                        <span className="font-display text-sm text-gold">
                          {c.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-text truncate">{c.name}</div>
                        <div className="text-xs text-text-dim">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-text-muted text-xs">
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-text-muted text-xs mt-0.5">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {c.city ?? "—"}, {c.country}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right text-text">
                    {c.total_orders}
                  </td>
                  <td className="px-4 py-3 text-right font-display text-gold">
                    {formatCurrencyOMR(c.total_spent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
