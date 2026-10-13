import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Website setup guide", path: "/setup" });

const STEPS = [
  { n: 1, title: "Choose a domain name", body: "Search keywords and extensions. Confirm availability with a live provider when configured." },
  { n: 2, title: "Compare and select a registrar", body: "Compare registration, renewal, and multi-year cost." },
  { n: 3, title: "Choose how you will build the site", body: "WordPress, website builder, ecommerce platform, or custom development." },
  { n: 4, title: "Hosting", body: "Select hosting for your stack. Domains do not always include hosting." },
  { n: 5, title: "DNS configuration", body: "Point nameservers or records to your host." },
  { n: 6, title: "SSL / HTTPS", body: "Enable TLS. Some TLDs require HTTPS." },
  { n: 7, title: "Professional email", body: "Usually separate from domain registration." },
  { n: 8, title: "Security and backups", body: "Plan updates, backups, and access control." },
  { n: 9, title: "Analytics and SEO", body: "Add analytics with appropriate consent; submit a sitemap when ready." },
  { n: 10, title: "Launch checklist", body: "Review DNS, SSL, forms, legal pages, and mobile layout." },
];

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Website setup guide</h1>
      <p className="mt-2 text-slate-600">
        Checklist from domain choice to launch. We link to providers; we do not execute purchases.
      </p>
      <ol className="mt-8 space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-4 rounded-lg border p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{s.n}</span>
            <div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm">
        Start with <Link href="/search" className="text-brand-600 underline">domain search</Link> or the{" "}
        <Link href="/calculator" className="text-brand-600 underline">cost calculator</Link>.
      </p>
    </div>
  );
}
