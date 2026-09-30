import { buildMetadata } from "@/lib/seo";
import { SearchBox } from "@/components/domain-search/search-box";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Compare TLDs & Registrars",
  description: "Compare domain extensions and registrars side by side.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Compare</h1>
      <p className="text-muted-foreground mb-6">
        Search a domain to compare TLD prices, or browse individual TLD and registrar pages.
      </p>
      <div className="max-w-xl mb-8">
        <SearchBox />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
        <Link href="/tlds" className="rounded-lg border p-4 hover:border-primary/50">Browse all TLDs →</Link>
        <Link href="/registrars" className="rounded-lg border p-4 hover:border-primary/50">Browse registrars →</Link>
      </div>
    </div>
  );
}
