import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Domain Price Calculator",
  description: "Estimate multi-year domain ownership cost across registrars.",
  path: "/tools/domain-price-calculator",
});

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Domain Price Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Use TLD detail pages to compare registration, renewal, and 3-year ownership cost.
        Interactive multi-year calculator can be extended here once live pricing is connected.
      </p>
      <p>
        <Link href="/tlds" className="text-primary underline">Browse all TLDs →</Link>
      </p>
    </div>
  );
}
