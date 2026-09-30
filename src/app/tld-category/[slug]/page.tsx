import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({
    title: `TLD Category: ${slug}`,
    path: `/tld-category/${slug}`,
  });
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let category = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        tlds: {
          include: {
            tld: {
              include: {
                pricing: { orderBy: { registrationPrice: "asc" }, take: 1 },
              },
            },
          },
        },
      },
    });
  } catch {
    /* db unavailable */
  }
  if (!category) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="text-muted-foreground mb-6">{category.description}</p>}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {category.tlds.map(({ tld }) => {
          const p = tld.pricing[0];
          return (
            <li key={tld.id}>
              <Link href={`/tlds/${tld.extension}`} className="block rounded-lg border p-4 hover:border-primary/50">
                <span className="font-mono font-semibold">.{tld.extension}</span>
                {tld.isDemo && <Badge variant="demo" className="ml-2">Demo</Badge>}
                {p && <p className="text-sm text-muted-foreground mt-1">From {formatPrice(Number(p.registrationPrice))}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
      {category.tlds.length === 0 && <p className="text-muted-foreground">No TLDs in this category yet.</p>}
    </div>
  );
}
