import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { StickyCartBar } from "@/components/layout/StickyCartBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AIChat } from "@/components/shared/AIChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Diecast Muscat — Premium Die-Cast Models",
    template: "%s · Diecast Muscat",
  },
  description:
    "Curated die-cast model cars, planes, trucks and bikes. Mint condition, limited editions, delivered across Oman.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Diecast Muscat",
    description: "Premium die-cast collectibles, sourced for Oman.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen bg-bg text-text antialiased font-sans pb-safe-nav">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
          <CartDrawer />
          <StickyCartBar />
          <BottomNav />
          <AIChat />
        </Providers>
      </body>
    </html>
  );
}
