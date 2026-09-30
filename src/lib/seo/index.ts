import type { Metadata } from "next";

const SITE = {
  name: "TLDCompare",
  url: process.env.NEXTAUTH_URL || "https://tldcompare.com",
  description: "Compare domain extensions, registrars, prices and availability in one place.",
};

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const title = opts.title.includes("TLDCompare") ? opts.title : `${opts.title} | TLDCompare`;
  const description = opts.description || SITE.description;
  const url = opts.path ? `${SITE.url}${opts.path}` : SITE.url;
  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export { SITE };
