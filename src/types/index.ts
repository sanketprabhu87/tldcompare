export type AvailabilityStatus =
  | "available"
  | "taken"
  | "premium"
  | "restricted"
  | "unsupported"
  | "unknown"
  | "error";

export type PriceType = "registration" | "renewal" | "transfer" | "privacy" | "premium";
export type SourceType = "live_api" | "cached" | "demo" | "manual";
export type CurrencyCode = string; // ISO 4217

export interface Money {
  amount: number | null;
  currency: CurrencyCode;
  /** When amount is null */
  unavailableReason?: string;
}

export interface PriceQuote {
  registrarSlug: string;
  registrarName: string;
  extension: string;
  domainName?: string;
  priceType: PriceType;
  money: Money;
  premiumStatus: "standard" | "premium" | "unknown";
  sourceType: SourceType;
  fetchedAt: string;
  expiresAt?: string;
  status: "ok" | "stale" | "unavailable" | "error";
}

export interface AvailabilityResult {
  domain: string;
  registrarSlug: string;
  status: AvailabilityStatus;
  sourceType: SourceType;
  reason?: string;
  checkedAt: string;
}

export interface ProviderMetadata {
  id: string;
  name: string;
  slug: string;
  officialUrl?: string;
  /** Operations this adapter implements */
  operations: string[];
}

export interface TldRecord {
  extension: string;
  name: string;
  description?: string | null;
  intended_use?: string | null;
  restrictions?: string | null;
  registry_url?: string | null;
  status: string;
  is_demo: boolean;
}

export interface RegistrarRecord {
  slug: string;
  name: string;
  official_url?: string | null;
  api_provider?: string | null;
  status: string;
  is_demo: boolean;
}

export interface OwnershipCostInput {
  registration: number | null;
  renewal: number | null;
  transfer?: number | null;
  privacyAnnual?: number | null;
  years: 1 | 3 | 5;
}

export interface OwnershipCostResult {
  years: number;
  yearBreakdown: { year: number; label: string; amount: number | null }[];
  total: number | null;
  currency: string;
  assumptions: string[];
  incomplete: boolean;
}
