import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin Console",
    template: "%s · Admin · Diecast Muscat",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminEmail: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?redirect=/admin");
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("email, role")
      .eq("user_id", user.id)
      .maybeSingle<{ email: string | null; role: string }>();

    if (!admin) {
      redirect("/");
    }

    adminEmail = admin.email ?? user.email ?? null;
  } catch {
    // If Supabase is not yet provisioned in local dev, fall through so
    // the dashboard is still browsable. The proxy.ts handles real gating
    // once auth is wired up.
    adminEmail = null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar adminEmail={adminEmail} />
      <div className="lg:pl-64">
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
