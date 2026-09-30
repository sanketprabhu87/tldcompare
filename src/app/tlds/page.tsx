import Link from "next/link";
import { getTldTableData } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "All TLDs — Domain Extension Price Comparison",
  description: "Browse and compare registration, renewal and transfer prices for domain extensions.",
  path: "/tlds",
});

export const revalidate = 3600;

export default async function TldsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; q?: string; max?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const { rows, total, pageSize } = await getTldTableData({
    page,
    type: sp.type,
    search: sp.q,
    maxReg: sp.max ? parseFloat(sp.max) : undefined,
  });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">All TLDs</h1>
      <p className="text-muted-foreground mb-6">
        Compare registration, renewal and transfer prices. Demo data is labelled.
      </p>

      <form className="flex flex-wrap gap-2 mb-6">
        <input name="q" defaultValue={sp.q} placeholder="Search TLD..." className="h-10 rounded-md border px-3 text-sm bg-background" />
        <select name="type" defaultValue={sp.type || ""} className="h-10 rounded-md border px-3 text-sm bg-background">
          <option value="">All types</option>
          <option value="GTLD">gTLD</option>
          <option value="CCTLD">ccTLD</option>
          <option value="NEW_GTLD">New gTLD</option>
          <option value="SPONSORED">Sponsored</option>
        </select>
        <input name="max" defaultValue={sp.max} placeholder="Max reg. $" className="h-10 w-28 rounded-md border px-3 text-sm bg-background" />
        <Button type="submit" size="sm">Filter</Button>
      </form>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3 font-medium sticky left-0 bg-muted/50">TLD</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Registration</th>
              <th className="p-3 font-medium">Renewal</th>
              <th className="p-3 font-medium">Transfer</th>
              <th className="p-3 font-medium">3-Year</th>
              <th className="p-3 font-medium">Cheapest</th>
              <th className="p-3 font-medium">Features</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b hover:bg-muted/20">
                <td className="p-3 font-mono font-semibold sticky left-0 bg-background">
                  <Link href={`/tlds/${r.extension}`} className="hover:text-primary">.{r.extension}</Link>
                  {r.isDemo && <Badge variant="demo" className="ml-1">Demo</Badge>}
                </td>
                <td className="p-3 text-muted-foreground">{r.type}</td>
                <td className="p-3">{formatPrice(r.registration)}{r.promoPrice != null && <span className="block text-xs text-emerald-600">Promo {formatPrice(r.promoPrice)}</span>}</td>
                <td className="p-3">{formatPrice(r.renewal)}</td>
                <td className="p-3">{formatPrice(r.transfer)}</td>
                <td className="p-3 font-medium">{formatPrice(r.threeYear)}</td>
                <td className="p-3">{r.cheapestRegistrar ?? "—"}</td>
                <td className="p-3 text-xs">
                  {r.whoisPrivacy && <span className="mr-1">Privacy</span>}
                  {r.dnssec && <span>DNSSEC</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{total} TLDs</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tlds?page=${page - 1}${sp.q ? `&q=${sp.q}` : ""}${sp.type ? `&type=${sp.type}` : ""}`}>Previous</Link>
            </Button>
          )}
          <span className="px-2 py-1">Page {page} / {totalPages || 1}</span>
          {page < totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tlds?page=${page + 1}${sp.q ? `&q=${sp.q}` : ""}${sp.type ? `&type=${sp.type}` : ""}`}>Next</Link>
            </Button>
          )}
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Prices are indicative and may change at the registrar. Confirm the final price at checkout.
      </p>
    </div>
  );
}
