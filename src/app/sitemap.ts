import type { MetadataRoute } from "next";
import { listTlds } from "@/lib/data/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const staticPaths = ["", "/tlds", "/search", "/compare", "/registrars", "/calculator", "/setup", "/methodology"];
  const tlds = await listTlds();
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() })),
    ...tlds.map((t) => ({ url: `${base}/tlds/${t.extension}`, lastModified: new Date() })),
  ];
}
