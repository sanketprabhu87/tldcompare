import Link from "next/link";
import { listTlds } from "@/lib/data/catalog";
import { getActiveProviders } from "@/lib/providers/registry";
import { formatMoney } from "@/lib/pricing/ownership";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "TLD Directory",
  path: "/tlds",
});

export default async function TldsPage() {
  const tlds = await listTlds();
  const provider = getActiveProviders()[0];

  const rows = await Promise.all(
    tlds.map(async (t) => {
      const reg = provider ? await provider.getRegistrationPrice(t.extension) : null;
      const ren = provider ? await provider.getRenewalPrice(t.extension) : null;
      return {
        ...t,
        reg: reg?.money.amount ?? null,
        ren: ren?.money.amount ?? null,
        source: reg?.sourceType ?? "demo",
      };
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">TLD directory</h1>
      <p className="mt-2 text-slate-600">
        Browse supported extensions. Prices shown only when a provider returned them — never invented.
      </p>
      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-3">Extension</th>
              <th className="p-3">Intended use</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.extension} className="border-b hover:bg-slate-50">
                <td className="p-3 font-mono font-semibold">
                  <Link href={`/tlds/${r.extension}`} className="text-brand-600 hover:underline">
                    .{r.extension}
                  </Link>
                </td>
                <td className="p-3 text-slate-600">{r.intended_use || "—"}</td>
                <td className="p-3">{formatMoney(r.reg)}</td>
                <td className="p-3">{formatMoney(r.ren)}</td>
                <td className="p-3">
                  {r.is_demo || r.source === "demo" ? (
                    <Badge tone="demo">Demo</Badge>
                  ) : (
                    <Badge tone="live">Live</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
