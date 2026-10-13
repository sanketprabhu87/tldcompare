import Link from "next/link";
import { listTlds } from "@/lib/data/catalog";
import { getActiveProviders } from "@/lib/providers/registry";
import { formatMoney, calculateOwnershipCost } from "@/lib/pricing/ownership";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Compare TLDs", path: "/compare" });

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ exts?: string }>;
}) {
  const sp = await searchParams;
  const selected = (sp.exts || "com,io,ai").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).slice(0, 5);
  const all = await listTlds();
  const tlds = all.filter((t) => selected.includes(t.extension));
  const provider = getActiveProviders()[0];

  const rows = await Promise.all(
    tlds.map(async (t) => {
      const reg = provider ? await provider.getRegistrationPrice(t.extension) : null;
      const ren = provider ? await provider.getRenewalPrice(t.extension) : null;
      const cost = calculateOwnershipCost({
        registration: reg?.money.amount ?? null,
        renewal: ren?.money.amount ?? null,
        years: 3,
      });
      return { t, reg, ren, cost };
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Compare extensions</h1>
      <p className="mt-2 text-slate-600">
        Side-by-side comparison. Pass <code className="text-xs bg-slate-100 px-1 rounded">?exts=com,io,ai</code> in the URL.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {["com,net,org", "io,ai,dev", "com,co,in", "app,dev,tech"].map((set) => (
          <Link key={set} href={`/compare?exts=${set}`} className="rounded-full border px-3 py-1 hover:border-brand-500">
            {set}
          </Link>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-3">Extension</th>
              <th className="p-3">Use</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">3-year total</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ t, reg, ren, cost }) => (
              <tr key={t.extension} className="border-b">
                <td className="p-3 font-mono font-semibold">
                  <Link href={`/tlds/${t.extension}`} className="text-brand-600">.{t.extension}</Link>
                </td>
                <td className="p-3">{t.intended_use || "—"}</td>
                <td className="p-3">{formatMoney(reg?.money.amount)}</td>
                <td className="p-3">{formatMoney(ren?.money.amount)}</td>
                <td className="p-3 font-medium">{formatMoney(cost.total)}</td>
                <td className="p-3">
                  {reg?.sourceType === "demo" ? <Badge tone="demo">Demo</Badge> : <Badge tone="live">Live</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
