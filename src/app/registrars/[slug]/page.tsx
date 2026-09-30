import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({
    title: `${slug} Domain Registrar`,
    description: `Pricing and features for ${slug}.`,
    path: `/registrars/${slug}`,
  });
}

export default async function RegistrarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const registrar = await prisma.registrar.findUnique({
    where: { slug },
    include: {
      pricing: {
        include: { tld: true },
        orderBy: { registrationPrice: "asc" },
        take: 30,
      },
      promotions: { where: { isActive: true } },
    },
  });
  if (!registrar) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/registrars" className="hover:text-foreground">Registrars</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{registrar.name}</span>
      </nav>
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {registrar.name}
            {registrar.isDemo && <Badge variant="demo">Demo</Badge>}
          </h1>
          {registrar.description && <p className="text-muted-foreground mt-1">{registrar.description}</p>}
        </div>
        {(registrar.affiliateUrl || registrar.website) && (
          <Button asChild>
            <a href={registrar.affiliateUrl || registrar.website!} target="_blank" rel="noopener noreferrer sponsored">
              Visit {registrar.name}
            </a>
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-sm">
        <div className="rounded-lg border p-3">WHOIS privacy: <strong>{registrar.whoisPrivacy ? "Yes" : "No"}</strong></div>
        <div className="rounded-lg border p-3">DNSSEC: <strong>{registrar.dnssec ? "Yes" : "No"}</strong></div>
        <div className="rounded-lg border p-3">API: <strong>{registrar.apiAvailable ? "Available" : "—"}</strong></div>
        <div className="rounded-lg border p-3">Email forwarding: <strong>{registrar.emailForwarding ? "Yes" : "—"}</strong></div>
      </div>

      {registrar.promotions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Active promotions</h2>
          <ul className="space-y-2">
            {registrar.promotions.map((p) => (
              <li key={p.id} className="rounded-lg border p-3 text-sm">
                <code className="font-mono bg-muted px-1 rounded">{p.code}</code> — {p.discount}
                {p.isDemo && <Badge variant="demo" className="ml-2">Demo</Badge>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold mb-3">Sample pricing</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3">TLD</th>
              <th className="p-3">Registration</th>
              <th className="p-3">Renewal</th>
              <th className="p-3">Transfer</th>
            </tr>
          </thead>
          <tbody>
            {registrar.pricing.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3 font-mono">
                  <Link href={`/tlds/${p.tld.extension}`} className="hover:text-primary">.{p.tld.extension}</Link>
                </td>
                <td className="p-3">{formatPrice(Number(p.registrationPrice))}</td>
                <td className="p-3">{formatPrice(Number(p.renewalPrice))}</td>
                <td className="p-3">{formatPrice(p.transferPrice != null ? Number(p.transferPrice) : null)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Prices are indicative. Confirm at the registrar. Demo data labelled.</p>
    </div>
  );
}
