import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseDomainInput, formatPrice, threeYearCost } from "@/lib/utils";
import { SearchBox } from "@/components/domain-search/search-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Domain Search — Availability & Price Comparison",
  description: "Search domain keywords and compare prices across TLDs and registrars.",
  path: "/search",
});

const DEFAULT_TLDS = ["com", "net", "org", "io", "ai", "dev", "app", "co", "xyz", "me", "tech", "online", "store", "shop"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const input = (q || "").trim();
  const parsed = parseDomainInput(input);

  let results: Array<{
    domain: string;
    extension: string;
    registration: number | null;
    renewal: number | null;
    transfer: number | null;
    threeYear: number | null;
    registrar: string | null;
    registrarSlug: string | null;
    affiliateUrl: string | null;
    isDemo: boolean;
    availability: string;
  }> = [];

  if (parsed.keyword) {
    const tldsToCheck = parsed.tld ? [parsed.tld] : DEFAULT_TLDS;
    const tldRecords = await prisma.tld.findMany({
      where: { extension: { in: tldsToCheck }, status: "ACTIVE" },
      include: {
        pricing: {
          orderBy: { registrationPrice: "asc" },
          take: 1,
          include: { registrar: true },
        },
      },
    });

    results = tldRecords.map((t) => {
      const p = t.pricing[0];
      const reg = p ? Number(p.registrationPrice) : null;
      const ren = p ? Number(p.renewalPrice) : null;
      return {
        domain: `${parsed.keyword}.${t.extension}`,
        extension: t.extension,
        registration: reg,
        renewal: ren,
        transfer: p?.transferPrice != null ? Number(p.transferPrice) : null,
        threeYear: reg != null && ren != null ? threeYearCost(reg, ren) : null,
        registrar: p?.registrar?.name ?? null,
        registrarSlug: p?.registrar?.slug ?? null,
        affiliateUrl: p?.registrar?.affiliateUrl ?? null,
        isDemo: t.isDemo || (p?.isDemo ?? true),
        // Demo: availability is simulated (not live)
        availability: "UNKNOWN",
      };
    });

    results.sort((a, b) => (a.registration ?? 999) - (b.registration ?? 999));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Domain Search</h1>
      <p className="text-muted-foreground mb-6">
        Enter a keyword or full domain. Availability shown as UNKNOWN unless a live provider is connected.
      </p>
      <div className="max-w-xl mb-8">
        <SearchBox />
      </div>

      {input && (
        <>
          <p className="mb-4 text-sm">
            Results for <strong className="font-mono">{parsed.keyword}</strong>
            {parsed.tld ? ` (.${parsed.tld})` : " across popular TLDs"}
          </p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3">Domain</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">Renewal</th>
                  <th className="p-3">3-Year</th>
                  <th className="p-3">Cheapest Registrar</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.domain} className="border-b hover:bg-muted/20">
                    <td className="p-3 font-mono font-medium">
                      <Link href={`/tlds/${r.extension}`} className="hover:text-primary">{r.domain}</Link>
                      {r.isDemo && <Badge variant="demo" className="ml-2">Demo</Badge>}
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{r.availability}</Badge>
                    </td>
                    <td className="p-3">{formatPrice(r.registration)}</td>
                    <td className="p-3">{formatPrice(r.renewal)}</td>
                    <td className="p-3">{formatPrice(r.threeYear)}</td>
                    <td className="p-3">{r.registrar ?? "—"}</td>
                    <td className="p-3">
                      {r.affiliateUrl ? (
                        <Button size="sm" asChild>
                          <a href={r.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">Register</a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tlds/${r.extension}`}>View TLD</Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.length === 0 && (
            <p className="text-muted-foreground mt-4">No matching TLDs in the database. Seed demo data or expand TLD coverage.</p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Availability is not live in demo mode. Connect a registrar/availability provider for real checks.
            Prices are indicative — confirm at the registrar.
          </p>
        </>
      )}

      {!input && (
        <p className="text-muted-foreground">Enter a domain or keyword above to see price comparisons.</p>
      )}
    </div>
  );
}
