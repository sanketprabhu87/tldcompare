import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Domain Promo Codes",
  description: "Current promotional codes for domain registration and renewal.",
  path: "/promo-codes",
});

export const revalidate = 1800;

export default async function PromoCodesPage() {
  let promos: Awaited<ReturnType<typeof prisma.promotion.findMany>> = [];
  try {
    promos = await prisma.promotion.findMany({
      where: { isActive: true },
      include: { registrar: true },
      orderBy: { createdAt: "desc" },
    });
  } catch { /* empty */ }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Promo Codes</h1>
      <p className="text-muted-foreground mb-8">
        Demo codes are labelled and not valid at registrars. Real promos appear when live sources are connected.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {promos.map((p) => (
          <div key={p.id} className="rounded-lg border p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{p.registrar.name}</span>
              {p.isDemo && <Badge variant="demo">Demo</Badge>}
            </div>
            <code className="text-lg font-mono bg-muted px-2 py-1 rounded">{p.code}</code>
            <p className="mt-2 text-sm">{p.discount}</p>
            {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              TLDs: {p.tldsCovered.join(", ")} · Applies to: {p.appliesTo.join(", ")}
            </p>
            {p.affiliateUrl && (
              <Button size="sm" className="mt-3" asChild>
                <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">Visit registrar</a>
              </Button>
            )}
          </div>
        ))}
      </div>
      {promos.length === 0 && <p className="text-muted-foreground">No active promotions in the database.</p>}
    </div>
  );
}
