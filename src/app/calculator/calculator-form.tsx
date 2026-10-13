"use client";

import { useMemo, useState } from "react";
import { calculateOwnershipCost, formatMoney } from "@/lib/pricing/ownership";
import { Button } from "@/components/ui/button";

export function CalculatorForm() {
  const [reg, setReg] = useState("9.98");
  const [ren, setRen] = useState("12.98");
  const [privacy, setPrivacy] = useState("");
  const [years, setYears] = useState<1 | 3 | 5>(3);

  const result = useMemo(() => {
    const registration = reg.trim() === "" ? null : Number(reg);
    const renewal = ren.trim() === "" ? null : Number(ren);
    const privacyAnnual = privacy.trim() === "" ? null : Number(privacy);
    return calculateOwnershipCost({
      registration: registration != null && !Number.isNaN(registration) ? registration : null,
      renewal: renewal != null && !Number.isNaN(renewal) ? renewal : null,
      privacyAnnual: privacyAnnual != null && !Number.isNaN(privacyAnnual) ? privacyAnnual : null,
      years,
    });
  }, [reg, ren, privacy, years]);

  return (
    <div className="mt-8 space-y-4 rounded-lg border p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Registration (year 1)
          <input className="mt-1 w-full rounded border px-3 py-2" value={reg} onChange={(e) => setReg(e.target.value)} />
        </label>
        <label className="block text-sm">
          Renewal (per year after)
          <input className="mt-1 w-full rounded border px-3 py-2" value={ren} onChange={(e) => setRen(e.target.value)} />
        </label>
        <label className="block text-sm">
          Privacy (optional, annual)
          <input className="mt-1 w-full rounded border px-3 py-2" value={privacy} onChange={(e) => setPrivacy(e.target.value)} placeholder="Leave empty if unknown" />
        </label>
        <label className="block text-sm">
          Years
          <select className="mt-1 w-full rounded border px-3 py-2" value={years} onChange={(e) => setYears(Number(e.target.value) as 1 | 3 | 5)}>
            <option value={1}>1 year</option>
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
          </select>
        </label>
      </div>
      <div className="rounded bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-600">Itemized</p>
        <ul className="mt-2 space-y-1 text-sm">
          {result.yearBreakdown.map((y) => (
            <li key={y.year} className="flex justify-between">
              <span>{y.label}</span>
              <span>{formatMoney(y.amount)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t pt-3 text-base font-bold">
          <span>Total ({result.years} years)</span>
          <span>{formatMoney(result.total)}</span>
        </p>
        {result.incomplete && (
          <p className="mt-2 text-xs text-amber-700">Some values are unavailable — total not computed.</p>
        )}
      </div>
      <Button type="button" variant="secondary" onClick={() => { setReg(""); setRen(""); setPrivacy(""); }}>
        Clear
      </Button>
    </div>
  );
}
