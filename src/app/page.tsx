import Link from "next/link";
import { SearchBox } from "@/components/search/search-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listTlds } from "@/lib/data/catalog";
import { getActiveProviders, isDemoMode } from "@/lib/providers/registry";
import { formatMoney } from "@/lib/pricing/ownership";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "TLD Compare — Domain Extensions & Registrar Prices",
  path: "/",
});

const FEATURED = ["com", "in", "org", "net", "io", "ai", "dev", "app"];

export default async function HomePage() {
  const tlds = await listTlds();
  const providers = getActiveProviders();
  const demo = isDemoMode();
  const featured = tlds.filter((t) => FEATURED.includes(t.extension));

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
          {demo && (
            <Badge tone="demo" className="mb-4">
              Demo mode — sample data labelled throughout
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Compare domain extensions &amp; registrar prices
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Search availability, compare registration and renewal costs, estimate multi-year ownership, and continue to registrars via disclosed affiliate links.
          </p>
          <div className="mt-8">
            <SearchBox large />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            We do not register domains or process third-party payments. Confirm final price at the registrar.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Popular extensions</h2>
          <Button variant="outline" size="sm">
            <Link href="/tlds">All TLDs</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <Link
              key={t.extension}
              href={`/tlds/${t.extension}`}
              className="rounded-lg border border-slate-200 p-4 transition hover:border-brand-500 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-semibold">.{t.extension}</span>
                {t.is_demo && <Badge tone="demo">Demo</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold">Active data providers</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((p) => (
              <div key={p.metadata.slug} className="rounded-lg border bg-white p-4">
                <p className="font-semibold">{p.metadata.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {p.metadata.operations.slice(0, 3).join(" · ")}
                </p>
                {p.metadata.slug === "demo-registrar" && <Badge tone="demo" className="mt-2">Demo</Badge>}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Live Cloudflare, GoDaddy, and Namecheap adapters activate when API credentials are configured. Until then, only demo data is shown.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold">Get started</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { href: "/search", title: "Search a domain", body: "Keyword or full domain — see extension options and prices." },
            { href: "/calculator", title: "Ownership cost", body: "Estimate 1, 3, and 5-year costs from registration and renewal." },
            { href: "/setup", title: "Website setup", body: "Guided checklist from domain choice to launch." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="rounded-lg border p-5 hover:border-brand-500">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-slate-600">
          <p>
            Sample prices like {formatMoney(9.98)} are <strong>demo data</strong> unless a live provider returned them.
            Read our <Link href="/methodology" className="text-brand-600 underline">methodology</Link> and{" "}
            <Link href="/affiliate-disclosure" className="text-brand-600 underline">affiliate disclosure</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
