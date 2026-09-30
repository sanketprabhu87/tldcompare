import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Domain Registrars — Comparison Directory",
  description: "Compare domain registrars, features and pricing.",
  path: "/registrars",
});

export const revalidate = 3600;

export default async function RegistrarsPage() {
  let registrars: Awaited<ReturnType<typeof prisma.registrar.findMany>> = [];
  try {
    registrars = await prisma.registrar.findMany({ orderBy: { name: "asc" } });
  } catch {
    /* db not ready */
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Registrars</h1>
      <p className="text-muted-foreground mb-8">Compare registrars by features and supported TLDs. Demo listings labelled.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {registrars.map((r) => (
          <div key={r.id} className="rounded-lg border p-5 hover:border-primary/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-lg">
                <Link href={`/registrars/${r.slug}`} className="hover:text-primary">{r.name}</Link>
              </h2>
              {r.isDemo && <Badge variant="demo">Demo</Badge>}
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>WHOIS privacy: {r.whoisPrivacy ? "Yes" : "No"}</li>
              <li>DNSSEC: {r.dnssec ? "Yes" : "No"}</li>
              <li>API: {r.apiAvailable ? "Available" : "—"}</li>
            </ul>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/registrars/${r.slug}`}>Details</Link>
              </Button>
              {r.website && (
                <Button size="sm" variant="ghost" asChild>
                  <a href={r.affiliateUrl || r.website} target="_blank" rel="noopener noreferrer">Visit</a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {registrars.length === 0 && <p className="text-muted-foreground">Seed the database to load demo registrars.</p>}
    </div>
  );
}
