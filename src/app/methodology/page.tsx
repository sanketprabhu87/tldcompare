import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "methodology", path: "/methodology" });

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold capitalize mb-4">methodology</h1>
      <p className="text-slate-600">
        TLD Compare is an independent comparison and referral site. We do not register domains or collect payment for third-party services.
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Demo data is labelled. Live prices and availability require configured provider APIs. Affiliate programs are only enabled when approved.
        Methodology: year-1 uses registration; later years use renewal; missing prices show as unavailable.
      </p>
    </div>
  );
}
