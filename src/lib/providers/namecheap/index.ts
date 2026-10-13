/**
 * Namecheap API adapter skeleton.
 * Docs: https://www.namecheap.com/support/api/intro/
 * Requires API user, key, username, and client IP whitelist.
 */
import type { DomainProvider } from "../types";
import { unsupportedQuote } from "../types";
import type { AvailabilityResult, PriceQuote } from "@/types";

function configured(): boolean {
  return Boolean(
    process.env.NAMECHEAP_API_USER &&
      process.env.NAMECHEAP_API_KEY &&
      process.env.NAMECHEAP_USERNAME &&
      process.env.NAMECHEAP_CLIENT_IP
  );
}

export const namecheapProvider: DomainProvider = {
  metadata: {
    id: "namecheap",
    name: "Namecheap",
    slug: "namecheap",
    officialUrl: "https://www.namecheap.com",
    operations: ["availability", "registration_price", "renewal_price", "transfer_price"],
  },

  async checkAvailability(domain: string): Promise<AvailabilityResult> {
    if (!configured()) {
      return {
        domain,
        registrarSlug: "namecheap",
        status: "unknown",
        sourceType: "demo",
        reason: "Namecheap API credentials / IP whitelist not configured",
        checkedAt: new Date().toISOString(),
      };
    }
    return {
      domain,
      registrarSlug: "namecheap",
      status: "unknown",
      sourceType: "live_api",
      reason: "Wire namecheap.domains.check after API access is enabled",
      checkedAt: new Date().toISOString(),
    };
  },

  async getRegistrationPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(
      this.metadata,
      ext,
      "registration",
      configured() ? "Wire Namecheap pricing after access approval" : "Namecheap API not configured"
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
