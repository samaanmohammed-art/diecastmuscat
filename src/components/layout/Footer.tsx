import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        {/* Brand line */}
        <div className="mb-12 pb-12 border-b border-border">
          <h3 className="font-display text-3xl text-gradient-gold inline-block">Diecast Muscat</h3>
          <p className="mt-3 max-w-md text-sm text-text-muted leading-relaxed">
            Curated die-cast collectibles for discerning enthusiasts. Authenticated, mint-condition, delivered across the Sultanate of Oman and the GCC.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <FooterColumn
            title="Shop"
            links={[
              { href: "/products?category=cars", label: "Cars" },
              { href: "/products?category=planes", label: "Planes" },
              { href: "/products?category=trucks", label: "Trucks" },
              { href: "/products?category=bikes", label: "Bikes" },
              { href: "/products", label: "All Models" },
            ]}
          />
          <FooterColumn
            title="Collection"
            links={[
              { href: "/products?limited=1", label: "Limited Editions" },
              { href: "/products?scale=1:18", label: "1:18 Scale" },
              { href: "/products?scale=1:43", label: "1:43 Scale" },
              { href: "/products?scale=1:64", label: "1:64 Scale" },
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              { href: "/login", label: "Sign In" },
              { href: "/signup", label: "Create Account" },
              { href: "/account", label: "My Profile" },
              { href: "/account#orders", label: "My Orders" },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { href: "/about", label: "About Us" },
              { href: "/shipping", label: "Shipping & Returns" },
              { href: "/authenticity", label: "Authenticity" },
              { href: "/contact", label: "Contact" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-text-dim">
          <p>© {new Date().getFullYear()} Diecast Muscat. Crafted in the Sultanate of Oman.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <span className="text-text-dim">VAT: 5%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
