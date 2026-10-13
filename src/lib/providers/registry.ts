import type { DomainProvider } from "./types";
import { mockProvider } from "./mock";
import { cloudflareProvider } from "./cloudflare";
import { godaddyProvider } from "./godaddy";
import { namecheapProvider } from "./namecheap";

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false";
}

/** Active providers for queries. Live adapters only included when credentials exist. */
export function getActiveProviders(): DomainProvider[] {
  const list: DomainProvider[] = [];
  if (isDemoMode()) {
    list.push(mockProvider);
  }
  if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID) {
    list.push(cloudflareProvider);
  }
  if (process.env.GODADDY_API_KEY && process.env.GODADDY_API_SECRET) {
    list.push(godaddyProvider);
  }
  if (
    process.env.NAMECHEAP_API_KEY &&
    process.env.NAMECHEAP_API_USER &&
    process.env.NAMECHEAP_USERNAME
  ) {
    list.push(namecheapProvider);
  }
  // Always ensure at least mock in development for empty credential setups
  if (list.length === 0) {
    list.push(mockProvider);
  }
  return list;
}

export function getProviderBySlug(slug: string): DomainProvider | undefined {
  return getActiveProviders().find((p) => p.metadata.slug === slug);
}
