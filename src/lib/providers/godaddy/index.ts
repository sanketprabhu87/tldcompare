/**
 * GoDaddy Domains API adapter skeleton.
 * Docs: https://developer.godaddy.com/
 */
import type { DomainProvider } from "../types";
import { unsupportedQuote } from "../types";
import type { AvailabilityResult, PriceQuote } from "@/types";

function configured(): boolean {
  return Boolean(process.env.GODADDY_API_KEY && process.env.GODADDY_API_SECRET);
}

export const godaddyProvider: DomainProvider = {
  metadata: {
    id: "godaddy",
    name: "GoDaddy",
    slug: "godaddy",
    officialUrl: "https://www.godaddy.com",
    operations: ["availability", "registration_price", "renewal_price"],
  },

  async checkAvailability(domain: string): Promise<AvailabilityResult> {
    if (!configured()) {
      return {
        domain,
        registrarSlug: "godaddy",
        status: "unknown",
        sourceType: "demo",
        reason: "GoDaddy API credentials not configured",
        checkedAt: new Date().toISOString(),
      };
    }
    return {
      domain,
      registrarSlug: "godaddy",
      status: "unknown",
      sourceType: "live_api",
      reason: "Wire GoDaddy /v1/domains/available after production access is approved",
      checkedAt: new Date().toISOString(),
    };
  },

  async getRegistrationPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(
      this.metadata,
      ext,
      "registration",
      configured() ? "Wire GoDaddy pricing API after access approval" : "GoDaddy API not configured"
    );
  },

  async getRenewalPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(this.metadata, ext, "renewal", "Not configured or not yet wired");
  },

  async getTransferPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(this.metadata, ext, "transfer", "Not configured or not yet wired");
  },

  async getSupportedExtensions(): Promise<string[]> {
    return [];
  },
};
