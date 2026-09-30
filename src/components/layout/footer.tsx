import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tlds" className="hover:text-foreground">All TLDs</Link></li>
              <li><Link href="/search" className="hover:text-foreground">Domain Search</Link></li>
              <li><Link href="/registrars" className="hover:text-foreground">Registrars</Link></li>
              <li><Link href="/cheapest-domain-extensions" className="hover:text-foreground">Cheapest TLDs</Link></li>
              <li><Link href="/compare" className="hover:text-foreground">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/promo-codes" className="hover:text-foreground">Promo Codes</Link></li>
              <li><Link href="/tld-launches" className="hover:text-foreground">TLD Launches</Link></li>
              <li><Link href="/idn-domains" className="hover:text-foreground">IDN Domains</Link></li>
              <li><Link href="/methodology" className="hover:text-foreground">Methodology</Link></li>
              <li><Link href="/data-sources" className="hover:text-foreground">Data Sources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-foreground">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Developers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/api/v1/tlds" className="hover:text-foreground">API</Link></li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Prices are indicative and may change. Confirm final price at the registrar. Demo data is clearly labelled.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TLDCompare. Not affiliated with ICANN or any registry. Affiliate relationships disclosed where applicable.
        </div>
      </div>
    </footer>
  );
}
