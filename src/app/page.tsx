import Link from "next/link";
import { SearchBox } from "@/components/domain-search/search-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, threeYearCost } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "TLDCompare — Compare Domain Prices Across Registrars",
  description: "Search domain availability, compare registration and renewal prices, and find the right registrar for your domain.",
  path: "/",
});

export const revalidate = 3600;

async function getStats() {
  try {
    const [tldCount, registrarCount, pricingCount] = await Promise.all([
      prisma.tld.count(),
      prisma.registrar.count(),
      prisma.pricing.count(),
    ]);
    return { tldCount, registrarCount, pricingCount };
  } catch {
    return { tldCount: 100, registrarCount: 10, pricingCount: 1000 };
  }
}

async function getPopularTlds() {
  try {
    const tlds = await prisma.tld.findMany({
      where: { status: "ACTIVE" },
      orderBy: { popularityScore: "desc" },
      take: 8,
      include: {
        pricing: { orderBy: { registrationPrice: "asc" }, take: 1, include: { registrar: true } },
      },
    });
    return tlds;
  } catch {
    return [];
  }
}

async function getCheapest() {
  try {
    const rows = await prisma.pricing.findMany({
      orderBy: { registrationPrice: "asc" },
      take: 6,
      include: { tld: true, registrar: true },
    });
    return rows;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, popular, cheapest] = await Promise.all([getStats(), getPopularTlds(), getCheapest()]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Badge variant="demo" className="mb-4">Demo data labelled throughout</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Compare Domain Prices Across Registrars
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search domain availability, compare registration and renewal prices, and find the right registrar for your domain.
          </p>
          <SearchBox large />
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-10 text-sm">
            <div><span className="font-bold text-2xl block">{stats.tldCount.toLocaleString()}+</span> TLDs tracked</div>
            <div><span className="font-bold text-2xl block">{stats.registrarCount}+</span> Registrars</div>
            <div><span className="font-bold text-2xl block">{stats.pricingCount.toLocaleString()}+</span> Pricing records</div>
            <div><span className="font-bold text-2xl block">Daily</span> Data updates</div>
          </div>
        </div>
      </section>

      {/* Cheapest */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Cheapest Extensions</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cheapest-domain-extensions">View all</Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cheapest.map((p) => (
            <Link
              key={p.id}
              href={`/tlds/${p.tld.extension}`}
              className="rounded-lg border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-semibold text-lg">.{p.tld.extension}</span>
                {p.isDemo && <Badge variant="demo">Demo</Badge>}
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{formatPrice(Number(p.registrationPrice))}</p>
              <p className="text-sm text-muted-foreground">
                Renewal {formatPrice(Number(p.renewalPrice))} · {p.registrar.name}
              </p>
            </Link>
          ))}
          {cheapest.length === 0 && (
            <p className="text-muted-foreground col-span-full">Run database seed to load demo pricing.</p>
          )}
        </div>
      </section>

      {/* Popular */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Extensions</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tlds">Browse all TLDs</Link>
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium">TLD</th>
                  <th className="p-3 font-medium">Registration</th>
                  <th className="p-3 font-medium">Renewal</th>
                  <th className="p-3 font-medium">3-Year Cost</th>
                  <th className="p-3 font-medium">Cheapest Registrar</th>
                  <th className="p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {popular.map((t) => {
                  const p = t.pricing[0];
                  const reg = p ? Number(p.registrationPrice) : null;
                  const ren = p ? Number(p.renewalPrice) : null;
                  return (
                    <tr key={t.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-mono font-semibold">
                        <Link href={`/tlds/${t.extension}`} className="hover:text-primary">.{t.extension}</Link>
                        {t.isDemo && <Badge variant="demo" className="ml-2">Demo</Badge>}
                      </td>
                      <td className="p-3">{formatPrice(reg)}</td>
                      <td className="p-3">{formatPrice(ren)}</td>
                      <td className="p-3">{reg != null && ren != null ? formatPrice(threeYearCost(reg, ren)) : "—"}</td>
                      <td className="p-3">{p?.registrar?.name ?? "—"}</td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tlds/${t.extension}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Search", body: "Enter a keyword or full domain. We expand across supported TLDs and surface pricing." },
            { step: "2", title: "Compare", body: "See registration, renewal, transfer and 3-year ownership cost side by side. Promotional prices are clearly marked." },
            { step: "3", title: "Register", body: "Click through to your chosen registrar. Affiliate links are disclosed; prices are always confirmed at checkout." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">{s.step}</div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10 text-center max-w-2xl">
          <h2 className="text-xl font-bold mb-3">Transparent Pricing</h2>
          <p className="text-muted-foreground text-sm">
            Prices are indicative and may change at the registrar. Confirm the final price at checkout.
            Demo/sample data is labelled. See our <Link href="/methodology" className="text-primary underline">methodology</Link> and{" "}
            <Link href="/data-sources" className="text-primary underline">data sources</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
