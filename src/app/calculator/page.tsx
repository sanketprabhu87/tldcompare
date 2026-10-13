import { calculateOwnershipCost, formatMoney } from "@/lib/pricing/ownership";
import { buildMetadata } from "@/lib/seo";
import { CalculatorForm } from "./calculator-form";

export const metadata = buildMetadata({
  title: "Domain ownership cost calculator",
  path: "/calculator",
});

export default function CalculatorPage() {
  // Server-side example using demo numbers for documentation
  const example = calculateOwnershipCost({ registration: 9.98, renewal: 12.98, years: 5 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Ownership cost calculator</h1>
      <p className="mt-2 text-slate-600">
        Year 1 = registration price. Years 2+ = renewal. First-year promos are not assumed for later years.
        Missing values show as &quot;Price unavailable&quot;.
      </p>
      <CalculatorForm />
      <div className="mt-10 rounded-lg border bg-slate-50 p-4 text-sm">
        <p className="font-semibold">Example (demo numbers)</p>
        <p className="mt-1 text-slate-600">
          Registration {formatMoney(9.98)}, renewal {formatMoney(12.98)}, 5 years → total{" "}
          <strong>{formatMoney(example.total)}</strong>
        </p>
        <ul className="mt-2 list-disc pl-5 text-slate-600">
          {example.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
