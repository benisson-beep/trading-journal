import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#analytics-preview", label: "Analytics" },
  { href: "/auth/register", label: "Journal" },
];

// About/Contact/Privacy/Terms pages don't exist yet. These are intentional
// placeholders ("#") rather than fake functional links — wire them up once
// those pages are built.
const COMPANY_LINKS = [
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-base font-bold tracking-tight">
              Trading Journal
            </span>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              A focused trading journal for traders who want to understand
              their own performance.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Product
            </h3>
            <ul className="mt-3 space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Company
            </h3>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Trading Journal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}