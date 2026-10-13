import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold">TLD Compare</p>
          <p className="mt-2 text-sm text-slate-600">
            Independent domain extension and registrar comparison. We do not register domains or process payments for third parties.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-2">Explore</p>
          <ul className="space-y-1 text-sm text-slate-600">
            <li><Link href="/tlds">TLD directory</Link></li>
            <li><Link href="/registrars">Registrars</Link></li>
            <li><Link href="/calculator">Ownership calculator</Link></li>
            <li><Link href="/setup">Website setup guide</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">Trust</p>
          <ul className="space-y-1 text-sm text-slate-600">
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/affiliate-disclosure">Affiliate disclosure</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-slate-500">
        Prices and availability can change. Confirm at the registrar. Demo data is always labelled.
      </div>
    </footer>
  );
}
