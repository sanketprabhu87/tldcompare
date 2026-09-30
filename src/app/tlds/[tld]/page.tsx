import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, threeYearCost } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ tld: string }> }) {
  const { tld } = await params;
  const ext = tld.toLowerCase();
  return buildMetadata({
    title: `.${ext.toUpperCase()} Domain Price Comparison`,
    description: `Compare registration, renewal and transfer prices for .${ext} across registrars.`,
    path: `/tlds/${ext}`,
  });
}

export default async function TldDetailPage({ params }: { params: Promise<{ tld: string }> }) {
  const { tld: raw } = await params;
  const extension = raw.toLowerCase();
  const tld = await prisma.tld.findUnique({
    where: { extension },
    include: {
      pricing: { include: { registrar: true }, orderBy: { registrationPrice: "asc" } },
      categories: { include: { category: true } },
    },
  });
  if (!tld) notFound();

  const cheapest = tld.pricing[0];
  const reg = cheapest ? Number(cheapest.registrationPrice) : null;
  const ren = cheapest ? Number(cheapest.renewalPrice) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/tlds" className="hover:text-foreground">TLDs</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">.{tld.extension}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono flex items-center gap-3">
            .{tld.extension}
            {tld.isDemo && <Badge variant="demo">Demo data</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1">{tld.name} · {tld.type}{tld.registry ? ` · ${tld.registry}` : ""}</p>
        </div>
        {cheapest?.registrar?.affiliateUrl && (
          <Button asChild>
            <a href={cheapest.registrar.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">
              Register at {cheapest.registrar.name}
            </a>
          </Button>
        )}
      </div>

      {tld.description && <p className="mb-6 max-w-2xl">{tld.description}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Cheapest registration</p>
          <p className="text-2xl font-bold">{formatPrice(reg)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Renewal</p>
          <p className="text-2xl font-bold">{formatPrice(ren)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">3-year cost</p>
          <p className="text-2xl font-bold">{reg != null && ren != null ? formatPrice(threeYearCost(reg, ren)) : "—"}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Cheapest registrar</p>
          <p className="text-xl font-semibold">{cheapest?.registrar?.name ?? "—"}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Registrar comparison</h2>
      <div className="overflow-x-auto rounded-lg border mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">Registrar</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">Transfer</th>
              <th className="p-3">3-Year</th>
              <th className="p-3">Promo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {tld.pricing.map((p) => {
              const r = Number(p.registrationPrice);
              const n = Number(p.renewalPrice);
              return (
                <tr key={p.id} className="border-b hover:bg-muted/20">
                  <td className="p-3 font-medium">
                    <Link href={`/registrars/${p.registrar.slug}`} className="hover:text-primary">{p.registrar.name}</Link>
                  </td>
                  <td className="p-3">{formatPrice(r)}</td>
                  <td className="p-3">{formatPrice(n)}</td>
                  <td className="p-3">{formatPrice(p.transferPrice != null ? Number(p.transferPrice) : null)}</td>
                  <td className="p-3">{formatPrice(threeYearCost(r, n))}</td>
                  <td className="p-3">
                    {p.promoPrice != null ? (
                      <span className="text-emerald-600">{formatPrice(Number(p.promoPrice))}{p.promoCode ? ` (${p.promoCode})` : ""}</span>
                    ) : "—"}
                  </td>
                  <td className="p-3">
                    {p.registrar.affiliateUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={p.registrar.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">Register</a>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Features</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>WHOIS privacy: {tld.whoisPrivacy ? "Yes" : "No / varies"}</li>
            <li>DNSSEC: {tld.dnssec ? "Supported" : "Not indicated"}</li>
            <li>Trustee required: {tld.trusteeRequired ? "Yes" : "No"}</li>
            {tld.country && <li>Country: {tld.country}</li>}
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {tld.categories.map((c) => (
              <Link key={c.categoryId} href={`/tld-category/${c.category.slug}`}>
                <Badge variant="secondary">{c.category.name}</Badge>
              </Link>
            ))}
            {tld.categories.length === 0 && <span className="text-sm text-muted-foreground">—</span>}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Prices are indicative and may change at the registrar. Last checked from demo seed or configured sources. Confirm final price at checkout.
        3-year cost = registration + renewal year 2 + renewal year 3.
      </p>
    </div>
  );
}
