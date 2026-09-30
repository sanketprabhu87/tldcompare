import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string | null | undefined, currency = "USD"): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(n);
}

export function threeYearCost(reg: number, ren: number): number {
  return reg + ren + ren;
}

export function parseDomainInput(input: string): { keyword: string; tld: string | null; isFullDomain: boolean } {
  const cleaned = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!cleaned) return { keyword: "", tld: null, isFullDomain: false };
  const parts = cleaned.split(".");
  if (parts.length >= 2) {
    const tld = parts.pop()!;
    const keyword = parts.join(".");
    return { keyword, tld, isFullDomain: true };
  }
  return { keyword: cleaned, tld: null, isFullDomain: false };
}
