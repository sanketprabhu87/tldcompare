import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistrar } from "@/lib/data/catalog";
import { getProviderBySlug } from "@/lib/providers/registry";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({ title: `Registrar: ${slug}`, path: `/registrars/${slug}` });
}

export default async function RegistrarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const registrar = await getRegistrar(slug);
  if (!registrar) notFound();
  const provider = getProviderBySlug(slug);
  const exts = provider ? await provider.getSupportedExtensions() : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/registrars">Registrars</Link> / {registrar.name}
      </nav>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{registrar.name}</h1>
        {registrar.is_demo && <Badge tone="demo">Demo listing</Badge>}
      </div>
      {registrar.official_url && (
        <p className="mt-2">
          <a href={registrar.official_url} className="text-brand-600 underline" rel="noopener noreferrer">
            Official website
          </a>
        </p>
      )}
      <div className="mt-6 rounded-lg border p-4 text-sm">
        <p>API provider key: <code>{registrar.api_provider || "none"}</code></p>
        <p className="mt-2">
          Operations:{" "}
          {provider?.metadata.operations.join(", ") || "Not connected"}
        </p>
        <p className="mt-2">
          Supported extensions (adapter): {exts.length ? exts.map((e) => `.${e}`).join(", ") : "—"}
        </p>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Affiliate programs are only used when approved and configured. No fabricated commission rankings.
      </p>
    </div>
  );
}
