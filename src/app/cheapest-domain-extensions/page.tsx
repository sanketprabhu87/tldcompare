import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, threeYearCost } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cheapest Domain Extensions",
  description: "Find the cheapest domain extensions by registration, renewal and 3-year cost.",
  path: "/cheapest-domain-extensions",
});

export const revalidate = 3600;

export default async function CheapestPage() {
  let byReg: Awaited<ReturnType<typeof prisma.pricing.findMany>> = [];
  try {
    byReg = await prisma.pricing.findMany({
      orderBy: { registrationPrice: "asc" },
      take: 20,
      include: { tld: true, registrar: true },
      distinct: ["tldId"],
    });
  } catch { /* empty */ }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Cheapest Domain Extensions</h1>
      <p className="text-muted-foreground mb-8">
        Lowest registration prices from demo/sample data. Always confirm at the registrar.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">TLD</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">3-Year</th>
              <th className="p-3">Registrar</th>
            </tr>
          </thead>
          <tbody>
            {byReg.map((p) => {
              const reg = Number(p.registrationPrice);
              const ren = Number(p.renewalPrice);
              return (
                <tr key={p.id} className="border-b">
                  <td className="p-3 font-mono">
                    <Link href={`/tlds/${p.tld.extension}`} className="hover:text-primary">.{p.tld.extension}</Link>
                    {p.isDemo && <Badge variant="demo" className="ml-2">Demo</Badge>}
                  </td>
                  <td className="p-3 font-semibold text-primary">{formatPrice(reg)}</td>
                  <td className="p-3">{formatPrice(ren)}</td>
                  <td className="p-3">{formatPrice(threeYearCost(reg, ren))}</td>
                  <td className="p-3">{p.registrar.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        3-year cost = registration + 2× renewal. Promotional first-year prices may differ from renewal.
      </p>
    </div>
  );
}
