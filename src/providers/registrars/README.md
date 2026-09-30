# Registrar providers

Each registrar integration should be a separate adapter implementing a common interface, e.g.:

```ts
export interface PricingProvider {
  listPrices(tld?: string): Promise<PriceRecord[]>;
  getAvailability?(domain: string): Promise<AvailabilityStatus>;
}
```

Add adapters here (namecheap, porkbun, cloudflare, …) and register them in a provider registry.
Wire credentials via environment variables. Failures must not wipe existing valid pricing.
