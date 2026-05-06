"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  adminEmail?: string | null;
}

function SidebarBody({
  pathname,
  onNavigate,
  adminEmail,
}: {
  pathname: string;
  onNavigate?: () => void;
  adminEmail?: string | null;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-border">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-md border border-gold-muted/40 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center group-hover:border-gold transition-colors">
            <span className="font-display text-gold text-xl font-bold leading-none">DM</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">Diecast</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted -mt-0.5">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-md pl-5 pr-4 py-2.5 text-sm transition-colors",
                active
                  ? "text-gold bg-gold/5"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-gold"
                />
              )}
              <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-text-muted")} />
              <span className="uppercase tracking-[0.12em] text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign out */}
      <div className="px-3 py-4 border-t border-border">
        {adminEmail && (
          <div className="px-3 pb-3 text-[11px] text-text-dim truncate" title={adminEmail}>
            {adminEmail}
          </div>
        )}
        <form action="/api/auth/sign-out" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm text-text-muted hover:text-gold hover:bg-surface-elevated transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="uppercase tracking-[0.12em] text-xs font-medium">Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname() ?? "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border bg-surface flex-col z-40">
        <SidebarBody pathname={pathname} adminEmail={adminEmail} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border bg-surface/85 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md border border-gold-muted/40 bg-gradient-to-br from-gold/15 to-transparent flex items-center justify-center">
            <span className="font-display text-gold text-sm font-bold leading-none">DM</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-surface">
          <SidebarBody
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            adminEmail={adminEmail}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
