import Link from "next/link";
import { notFound } from "next/navigation";
import { getTld } from "@/lib/data/catalog";
import { getActiveProviders } from "@/lib/providers/registry";
import { formatMoney, calculateOwnershipCost } from "@/lib/pricing/ownership";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ extension: string }> }) {
  const { extension } = await params;
  return buildMetadata({
    title: `.${extension.toUpperCase()} domain extension`,
    path: `/tlds/${extension}`,
  });
}

export default async function TldDetailPage({ params }: { params: Promise<{ extension: string }> }) {
  const { extension: raw } = await params;
  const extension = raw.toLowerCase();
  const tld = await getTld(extension);
  if (!tld) notFound();

  const providers = getActiveProviders();
  const quotes = await Promise.all(
    providers.map(async (p) => {
      const [reg, ren, trf] = await Promise.all([
        p.getRegistrationPrice(extension),
        p.getRenewalPrice(extension),
        p.getTransferPrice(extension),
      ]);
      const cost3 = calculateOwnershipCost({
        registration: reg.money.amount,
        renewal: ren.money.amount,
        years: 3,
      });
      const cost5 = calculateOwnershipCost({
        registration: reg.money.amount,
        renewal: ren.money.amount,
        years: 5,
      });
      return { provider: p.metadata, reg, ren, trf, cost3, cost5 };
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/tlds">TLDs</Link> / <span className="text-slate-900">.{extension}</span>
      </nav>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-3xl font-bold">.{extension}</h1>
        {tld.is_demo && <Badge tone="demo">Demo metadata</Badge>}
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">{tld.description}</p>
      {tld.intended_use && (
        <p className="mt-2 text-sm text-slate-500">Intended use: {tld.intended_use}</p>
      )}
      {tld.restrictions && (
        <p className="mt-1 text-sm text-amber-700">Restrictions: {tld.restrictions}</p>
      )}

      <h2 className="mt-10 text-xl font-bold">Registrar price comparison</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-3">Registrar</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">Transfer</th>
              <th className="p-3">3-year</th>
              <th className="p-3">5-year</th>
              <th className="p-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.provider.slug} className="border-b">
                <td className="p-3 font-medium">{q.provider.name}</td>
                <td className="p-3">{formatMoney(q.reg.money.amount)}</td>
                <td className="p-3">{formatMoney(q.ren.money.amount)}</td>
                <td className="p-3">{formatMoney(q.trf.money.amount)}</td>
                <td className="p-3">{formatMoney(q.cost3.total)}</td>
                <td className="p-3">{formatMoney(q.cost5.total)}</td>
                <td className="p-3">
                  {q.reg.sourceType === "demo" ? (
                    <Badge tone="demo">Demo</Badge>
                  ) : (
                    <Badge tone="live">{q.reg.sourceType}</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        3-year and 5-year totals = registration (year 1) + renewal for subsequent years. Promotional first-year prices do not automatically apply to renewals.
        Last checked timestamps reflect provider response times. Confirm at the registrar before purchase.
      </p>
      {tld.registry_url && (
        <p className="mt-2 text-sm">
          Registry reference:{" "}
          <a href={tld.registry_url} className="text-brand-600 underline" rel="noopener noreferrer">
            {tld.registry_url}
          </a>
        </p>
      )}
    </div>
  );
}
