import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Idn Domains",
  path: "/idn-domains",
});

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4 capitalize">idn domains</h1>
      <p className="text-muted-foreground mb-4">
        This page is part of the TLDCompare platform. Complete legal and methodology content with your organization details before production.
      </p>
      <p className="text-sm text-muted-foreground">
        All seed pricing is DEMO / SAMPLE DATA. Live registrar APIs can be connected via provider adapters without redesigning the app.
        3-year cost = registration + renewal year 2 + renewal year 3. Affiliate relationships are disclosed where used.
      </p>
    </div>
  );
}
