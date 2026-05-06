import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-noise opacity-60 pointer-events-none" aria-hidden />

      {/* Brand badge */}
      <Link
        href="/"
        className="absolute top-6 left-6 lg:top-10 lg:left-10 z-10 flex items-center gap-3 group"
      >
        <div className="h-10 w-10 rounded-md border border-gold-muted/40 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center group-hover:border-gold transition-colors">
          <span className="font-display text-gold text-xl font-bold leading-none">DM</span>
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-display text-base font-semibold tracking-tight text-text">
            Diecast
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted -mt-0.5">
            Muscat
          </span>
        </div>
      </Link>

      {/* Centered card */}
      <main className="relative z-[1] flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface/80 backdrop-blur-md shadow-card p-8 sm:p-10">
            {children}
          </div>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-text-dim">
            Curated Diecast, Delivered to Oman
          </p>
        </div>
      </main>
    </div>
  );
}
