/**
 * DEMO / MOCK provider — local development and tests only.
 * Never mixed with live production results without explicit DEMO labeling.
 */
import type { DomainProvider } from "../types";
import type { AvailabilityResult, PriceQuote } from "@/types";
import { unsupportedQuote } from "../types";

const DEMO_PRICES: Record<string, { reg: number; ren: number; trf: number }> = {
  com: { reg: 9.98, ren: 12.98, trf: 9.98 },
  net: { reg: 11.98, ren: 14.98, trf: 11.98 },
  org: { reg: 10.98, ren: 13.98, trf: 10.98 },
  io: { reg: 32.98, ren: 39.98, trf: 32.98 },
  ai: { reg: 69.98, ren: 79.98, trf: 69.98 },
  dev: { reg: 12.0, ren: 12.0, trf: 12.0 },
  app: { reg: 14.0, ren: 14.0, trf: 14.0 },
  co: { reg: 11.99, ren: 28.99, trf: 11.99 },
  in: { reg: 7.99, ren: 9.99, trf: 7.99 },
  xyz: { reg: 1.99, ren: 12.99, trf: 1.99 },
  me: { reg: 6.99, ren: 19.99, trf: 6.99 },
  tech: { reg: 5.99, ren: 39.99, trf: 5.99 },
  online: { reg: 2.99, ren: 29.99, trf: 2.99 },
  store: { reg: 2.99, ren: 49.99, trf: 2.99 },
};

function parseExt(input: string): string {
  const parts = input.toLowerCase().replace(/^\./, "").split(".");
  return parts[parts.length - 1];
}

function quote(
  extension: string,
  priceType: PriceQuote["priceType"],
  amount: number | null
): PriceQuote {
  return {
    registrarSlug: "demo-registrar",
    registrarName: "Demo Registrar",
    extension,
    priceType,
    money:
      amount == null
        ? { amount: null, currency: "USD", unavailableReason: "No demo price for this extension" }
        : { amount, currency: "USD" },
    premiumStatus: "standard",
    sourceType: "demo",
    fetchedAt: new Date().toISOString(),
    status: amount == null ? "unavailable" : "ok",
  };
}

export const mockProvider: DomainProvider = {
  metadata: {
    id: "mock",
    name: "Demo Registrar",
    slug: "demo-registrar",
    officialUrl: undefined,
    operations: [
      "search",
      "availability",
      "registration_price",
      "renewal_price",
      "transfer_price",
    ],
  },

  async checkAvailability(domain: string): Promise<AvailabilityResult> {
    // Deterministic pseudo-availability for demos (not real)
    const taken = ["google.com", "facebook.com", "amazon.com", "example.com"];
    const status = taken.includes(domain.toLowerCase()) ? "taken" : "available";
    return {
      domain: domain.toLowerCase(),
      registrarSlug: "demo-registrar",
      status,
      sourceType: "demo",
      reason: "DEMO DATA — not a live availability check",
      checkedAt: new Date().toISOString(),
    };
  },

  async getRegistrationPrice(domainOrExtension: string): Promise<PriceQuote> {
    const ext = parseExt(domainOrExtension);
    const p = DEMO_PRICES[ext];
    return p ? quote(ext, "registration", p.reg) : unsupportedQuote(this.metadata, ext, "registration", "No demo price");
  },

  async getRenewalPrice(domainOrExtension: string): Promise<PriceQuote> {
    const ext = parseExt(domainOrExtension);
    const p = DEMO_PRICES[ext];
    return p ? quote(ext, "renewal", p.ren) : unsupportedQuote(this.metadata, ext, "renewal", "No demo price");
  },

  async getTransferPrice(domainOrExtension: string): Promise<PriceQuote> {
    const ext = parseExt(domainOrExtension);
    const p = DEMO_PRICES[ext];
    return p ? quote(ext, "transfer", p.trf) : unsupportedQuote(this.metadata, ext, "transfer", "No demo price");
  },

  async getSupportedExtensions(): Promise<string[]> {
    return Object.keys(DEMO_PRICES);
  },

  getAffiliateUrl() {
    return null; // no fabricated affiliate IDs
  },
};
