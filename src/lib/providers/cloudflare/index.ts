/**
 * Cloudflare Registrar adapter skeleton.
 * Docs: https://developers.cloudflare.com/registrar/registrar-api/
 * Activate only when CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN are set and verified.
 */
import type { DomainProvider } from "../types";
import { unsupportedQuote } from "../types";
import type { AvailabilityResult, PriceQuote } from "@/types";

function configured(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN);
}

export const cloudflareProvider: DomainProvider = {
  metadata: {
    id: "cloudflare",
    name: "Cloudflare Registrar",
    slug: "cloudflare",
    officialUrl: "https://www.cloudflare.com/products/registrar/",
    operations: ["availability", "registration_price", "renewal_price"],
  },

  async checkAvailability(domain: string): Promise<AvailabilityResult> {
    if (!configured()) {
      return {
        domain,
        registrarSlug: "cloudflare",
        status: "unknown",
        sourceType: "demo",
        reason: "Cloudflare API credentials not configured",
        checkedAt: new Date().toISOString(),
      };
    }
    // Live implementation: call Cloudflare Registrar API with timeout + error mapping
    return {
      domain,
      registrarSlug: "cloudflare",
      status: "unknown",
      sourceType: "live_api",
      reason: "Live Cloudflare integration requires verified account permissions — wire official endpoints here",
      checkedAt: new Date().toISOString(),
    };
  },

  async getRegistrationPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    if (!configured()) {
      return unsupportedQuote(this.metadata, ext, "registration", "Cloudflare API not configured");
    }
    return unsupportedQuote(this.metadata, ext, "registration", "Wire Cloudflare pricing endpoint after access approval");
  },

  async getRenewalPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(this.metadata, ext, "renewal", configured() ? "Not yet wired" : "Not configured");
  },

  async getTransferPrice(input: string): Promise<PriceQuote> {
    const ext = input.split(".").pop() || input;
    return unsupportedQuote(this.metadata, ext, "transfer", "Transfer pricing not exposed for this adapter yet");
  },

  async getSupportedExtensions(): Promise<string[]> {
    return [];
  },
};
