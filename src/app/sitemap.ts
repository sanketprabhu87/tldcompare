import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "https://tldcompare.com";
  const staticRoutes = ["", "/tlds", "/search", "/registrars", "/cheapest-domain-extensions", "/promo-codes", "/compare", "/methodology", "/data-sources"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));
  try {
    const tlds = await prisma.tld.findMany({ select: { extension: true, updatedAt: true }, take: 500 });
    const tldRoutes = tlds.map((t) => ({
      url: `${base}/tlds/${t.extension}`,
      lastModified: t.updatedAt,
    }));
    return [...staticRoutes, ...tldRoutes];
  } catch {
    return staticRoutes;
  }
}
