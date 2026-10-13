import type { Metadata } from "next";

const APP_NAME = "TLD Compare";
const DEFAULT_DESC =
  "Compare domain extensions and registrar prices. Check availability, ownership costs, and find the right TLD — with transparent demo vs live data labeling.";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const title = opts.title.includes(APP_NAME) ? opts.title : `${opts.title} | ${APP_NAME}`;
  const description = opts.description || DEFAULT_DESC;
  const url = `${siteUrl()}${opts.path || ""}`;
  return {
    title,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: APP_NAME, type: "website" },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
