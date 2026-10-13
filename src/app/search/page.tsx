import Link from "next/link";
import { SearchBox } from "@/components/search/search-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseDomainOrKeyword } from "@/lib/domain/parse";
import { getActiveProviders } from "@/lib/providers/registry";
import { formatMoney, calculateOwnershipCost } from "@/lib/pricing/ownership";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Domain Search",
  path: "/search",
});

const DEFAULT_EXTS = ["com", "net", "org", "io", "ai", "dev", "app", "co", "in", "xyz"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const input = (q || "").trim();
  const parsed = parseDomainOrKeyword(input);
  const providers = getActiveProviders();
  const primary = providers[0];

  type Row = {
    domain: string;
    extension: string;
    availability: string;
    reg: number | null;
    ren: number | null;
    threeYear: number | null;
    source: string;
    reason?: string;
  };

  const rows: Row[] = [];

  if (parsed.keyword && primary) {
    const exts = parsed.extension ? [parsed.extension] : DEFAULT_EXTS;
    for (const ext of exts) {
      const domain = `${parsed.keyword}.${ext}`;
      const [avail, regQ, renQ] = await Promise.all([
        primary.checkAvailability(domain),
        primary.getRegistrationPrice(domain),
        primary.getRenewalPrice(domain),
      ]);
      const reg = regQ.money.amount;
      const ren = renQ.money.amount;
      const cost = calculateOwnershipCost({ registration: reg, renewal: ren, years: 3 });
      rows.push({
        domain,
        extension: ext,
        availability: avail.status,
        reg,
        ren,
        threeYear: cost.total,
        source: avail.sourceType,
        reason: avail.reason,
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Domain search</h1>
      <p className="mt-2 text-slate-600">
        Availability and prices come from configured providers. Demo results are labelled and are not live checks.
      </p>
      <div className="mt-6 max-w-xl">
        <SearchBox />
      </div>

      {input && (
        <>
          <p className="mt-8 text-sm">
            Results for <span className="font-mono font-semibold">{parsed.keyword}</span>
            {parsed.extension ? ` (.${parsed.extension})` : " across common extensions"}
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="p-3">Domain</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Renewal</th>
                  <th className="p-3">3-year</th>
                  <th className="p-3">Source</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.domain} className="border-b">
                    <td className="p-3 font-mono font-medium">{r.domain}</td>
                    <td className="p-3">
                      <Badge tone={r.availability === "available" ? "success" : "default"}>
                        {r.availability}
                      </Badge>
                    </td>
                    <td className="p-3">{formatMoney(r.reg)}</td>
                    <td className="p-3">{formatMoney(r.ren)}</td>
                    <td className="p-3">{formatMoney(r.threeYear)}</td>
                    <td className="p-3">
                      {r.source === "demo" ? <Badge tone="demo">Demo</Badge> : <Badge tone="live">Live</Badge>}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">
                        <Link href={`/tlds/${r.extension}`}>TLD info</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows[0]?.reason && (
            <p className="mt-3 text-xs text-slate-500">{rows[0].reason}</p>
          )}
        </>
      )}
    </div>
  );
}
