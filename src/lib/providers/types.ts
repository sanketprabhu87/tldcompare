import type { AvailabilityResult, PriceQuote, ProviderMetadata } from "@/types";

export interface DomainProvider {
  metadata: ProviderMetadata;
  checkAvailability(domain: string): Promise<AvailabilityResult>;
  getRegistrationPrice(domainOrExtension: string): Promise<PriceQuote>;
  getRenewalPrice(domainOrExtension: string): Promise<PriceQuote>;
  getTransferPrice(domainOrExtension: string): Promise<PriceQuote>;
  getSupportedExtensions(): Promise<string[]>;
  getAffiliateUrl?(destination: string, params?: Record<string, string>): string | null;
}

export function unsupportedQuote(
  meta: ProviderMetadata,
  extension: string,
  priceType: PriceQuote["priceType"],
  reason: string
): PriceQuote {
  return {
    registrarSlug: meta.slug,
    registrarName: meta.name,
    extension,
    priceType,
    money: { amount: null, currency: "USD", unavailableReason: reason },
    premiumStatus: "unknown",
    sourceType: "demo",
    fetchedAt: new Date().toISOString(),
    status: "unavailable",
  };
}
