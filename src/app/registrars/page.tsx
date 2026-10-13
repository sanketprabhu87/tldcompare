import Link from "next/link";
import { listRegistrars } from "@/lib/data/catalog";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Registrars", path: "/registrars" });

export default async function RegistrarsPage() {
  const registrars = await listRegistrars();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Registrars</h1>
      <p className="mt-2 text-slate-600">
        Provider directory. Live API integrations activate when credentials are configured. Ratings and customer counts are not fabricated.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {registrars.map((r) => (
          <Link key={r.slug} href={`/registrars/${r.slug}`} className="rounded-lg border p-5 hover:border-brand-500">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{r.name}</h2>
              {r.is_demo && <Badge tone="demo">Demo</Badge>}
            </div>
            <p className="mt-2 text-sm text-slate-500">API: {r.api_provider || "none"}</p>
            {r.official_url && <p className="mt-1 truncate text-xs text-slate-400">{r.official_url}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
