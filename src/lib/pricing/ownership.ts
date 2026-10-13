import type { OwnershipCostInput, OwnershipCostResult } from "@/types";

/**
 * Total cost of ownership.
 * Year 1 = registration (not renewal).
 * Years 2..N = renewal each year.
 * Does not assume first-year promo continues.
 */
export function calculateOwnershipCost(
  input: OwnershipCostInput,
  currency = "USD"
): OwnershipCostResult {
  const assumptions: string[] = [
    "Year 1 uses registration price; subsequent years use renewal price.",
    "First-year promotional pricing does not automatically apply to renewals.",
  ];
  const years = input.years;
  const yearBreakdown: OwnershipCostResult["yearBreakdown"] = [];
  let incomplete = false;
  let total = 0;

  for (let y = 1; y <= years; y++) {
    if (y === 1) {
      if (input.registration == null) {
        incomplete = true;
        yearBreakdown.push({ year: y, label: "Registration (year 1)", amount: null });
      } else {
        let amount = input.registration;
        if (input.privacyAnnual != null) amount += input.privacyAnnual;
        yearBreakdown.push({ year: y, label: "Registration (year 1)", amount });
        total += amount;
      }
    } else {
      if (input.renewal == null) {
        incomplete = true;
        yearBreakdown.push({ year: y, label: `Renewal (year ${y})`, amount: null });
      } else {
        let amount = input.renewal;
        if (input.privacyAnnual != null) amount += input.privacyAnnual;
        yearBreakdown.push({ year: y, label: `Renewal (year ${y})`, amount });
        total += amount;
      }
    }
  }

  if (input.transfer != null && input.transfer > 0) {
    assumptions.push("Transfer cost is shown only when explicitly included by the caller.");
  }

  return {
    years,
    yearBreakdown,
    total: incomplete ? null : total,
    currency,
    assumptions,
    incomplete,
  };
}

export function formatMoney(amount: number | null | undefined, currency = "USD"): string {
  if (amount == null || Number.isNaN(amount)) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
