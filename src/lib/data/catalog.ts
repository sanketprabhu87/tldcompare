/**
 * Catalog data access: Supabase when configured, otherwise in-memory DEMO catalog.
 */
import { createAnonServerClient, supabaseConfigured } from "@/lib/supabase/server";
import type { TldRecord, RegistrarRecord } from "@/types";

const DEMO_TLDS: TldRecord[] = [
  { extension: "com", name: ".COM", description: "Most widely used commercial TLD.", intended_use: "Business, general", status: "active", is_demo: true },
  { extension: "net", name: ".NET", description: "Originally for network providers.", intended_use: "General, tech", status: "active", is_demo: true },
  { extension: "org", name: ".ORG", description: "Popular with organizations and nonprofits.", intended_use: "Nonprofits, communities", status: "active", is_demo: true },
  { extension: "io", name: ".IO", description: "Popular with technology startups.", intended_use: "Tech, startups", status: "active", is_demo: true },
  { extension: "ai", name: ".AI", description: "Associated with AI and ML projects.", intended_use: "AI, technology", status: "active", is_demo: true },
  { extension: "dev", name: ".DEV", description: "Developer-focused; HTTPS required by registry policy.", intended_use: "Developers", status: "active", is_demo: true },
  { extension: "app", name: ".APP", description: "Applications; HTTPS required.", intended_use: "Apps, products", status: "active", is_demo: true },
  { extension: "co", name: ".CO", description: "Often used as company alternative to .com.", intended_use: "Business", status: "active", is_demo: true },
  { extension: "in", name: ".IN", description: "India country-code TLD.", intended_use: "India, regional", status: "active", is_demo: true },
  { extension: "xyz", name: ".XYZ", description: "Generic affordable extension.", intended_use: "General", status: "active", is_demo: true },
  { extension: "me", name: ".ME", description: "Personal branding.", intended_use: "Personal", status: "active", is_demo: true },
  { extension: "tech", name: ".TECH", description: "Technology brands.", intended_use: "Technology", status: "active", is_demo: true },
  { extension: "online", name: ".ONLINE", description: "General online presence.", intended_use: "General", status: "active", is_demo: true },
  { extension: "store", name: ".STORE", description: "Ecommerce and retail.", intended_use: "Ecommerce", status: "active", is_demo: true },
];

const DEMO_REGISTRARS: RegistrarRecord[] = [
  { slug: "demo-registrar", name: "Demo Registrar", official_url: undefined, api_provider: "mock", status: "active", is_demo: true },
  { slug: "cloudflare", name: "Cloudflare Registrar", official_url: "https://www.cloudflare.com/products/registrar/", api_provider: "cloudflare", status: "active", is_demo: false },
  { slug: "godaddy", name: "GoDaddy", official_url: "https://www.godaddy.com", api_provider: "godaddy", status: "active", is_demo: false },
  { slug: "namecheap", name: "Namecheap", official_url: "https://www.namecheap.com", api_provider: "namecheap", status: "active", is_demo: false },
];

export async function listTlds(): Promise<TldRecord[]> {
  if (!supabaseConfigured()) return DEMO_TLDS;
  const sb = createAnonServerClient();
  if (!sb) return DEMO_TLDS;
  const { data, error } = await sb.from("tlds").select("*").eq("status", "active").order("extension");
  if (error || !data?.length) return DEMO_TLDS;
  return data as TldRecord[];
}

export async function getTld(extension: string): Promise<TldRecord | null> {
  const all = await listTlds();
  return all.find((t) => t.extension === extension.toLowerCase()) || null;
}

export async function listRegistrars(): Promise<RegistrarRecord[]> {
  if (!supabaseConfigured()) return DEMO_REGISTRARS;
  const sb = createAnonServerClient();
  if (!sb) return DEMO_REGISTRARS;
  const { data, error } = await sb.from("registrars").select("*").eq("status", "active").order("name");
  if (error || !data?.length) return DEMO_REGISTRARS;
  return data as RegistrarRecord[];
}

export async function getRegistrar(slug: string): Promise<RegistrarRecord | null> {
  const all = await listRegistrars();
  return all.find((r) => r.slug === slug) || null;
}

export { DEMO_TLDS, DEMO_REGISTRARS };
