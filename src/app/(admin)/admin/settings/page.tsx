import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
          Configuration
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Store preferences, integrations and admin team management.
        </p>
      </header>

      <div className="rounded-lg border border-border bg-surface p-10 text-center">
        <p className="text-text-muted">
          Settings module is coming soon.
        </p>
      </div>
    </div>
  );
}
