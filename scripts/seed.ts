/**
 * Seed Supabase with TLD/registrar catalog metadata.
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Does NOT insert fabricated live prices — only catalog rows marked is_demo where applicable.
 *
 * Usage: npx tsx scripts/seed.ts
 * Apply migrations first via Supabase SQL Editor (supabase/migrations/001_initial_schema.sql).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const TLDS = [
  { extension: "com", name: ".COM", description: "Most widely used commercial TLD.", intended_use: "Business, general", status: "active", is_demo: true },
  { extension: "net", name: ".NET", description: "Originally for network providers.", intended_use: "General, tech", status: "active", is_demo: true },
  { extension: "org", name: ".ORG", description: "Organizations and nonprofits.", intended_use: "Nonprofits", status: "active", is_demo: true },
  { extension: "io", name: ".IO", description: "Popular with tech startups.", intended_use: "Tech, startups", status: "active", is_demo: true },
  { extension: "ai", name: ".AI", description: "AI and ML projects.", intended_use: "AI, technology", status: "active", is_demo: true },
  { extension: "dev", name: ".DEV", description: "Developers; HTTPS required.", intended_use: "Developers", status: "active", is_demo: true },
  { extension: "app", name: ".APP", description: "Applications; HTTPS required.", intended_use: "Apps", status: "active", is_demo: true },
  { extension: "co", name: ".CO", description: "Company alternative to .com.", intended_use: "Business", status: "active", is_demo: true },
  { extension: "in", name: ".IN", description: "India country-code TLD.", intended_use: "India", status: "active", is_demo: true },
  { extension: "xyz", name: ".XYZ", description: "Generic affordable extension.", intended_use: "General", status: "active", is_demo: true },
  { extension: "me", name: ".ME", description: "Personal branding.", intended_use: "Personal", status: "active", is_demo: true },
  { extension: "tech", name: ".TECH", description: "Technology brands.", intended_use: "Technology", status: "active", is_demo: true },
  { extension: "online", name: ".ONLINE", description: "General online presence.", intended_use: "General", status: "active", is_demo: true },
  { extension: "store", name: ".STORE", description: "Ecommerce.", intended_use: "Ecommerce", status: "active", is_demo: true },
];

const REGISTRARS = [
  { slug: "demo-registrar", name: "Demo Registrar", api_provider: "mock", status: "active", is_demo: true },
  { slug: "cloudflare", name: "Cloudflare Registrar", official_url: "https://www.cloudflare.com/products/registrar/", api_provider: "cloudflare", status: "active", is_demo: false },
  { slug: "godaddy", name: "GoDaddy", official_url: "https://www.godaddy.com", api_provider: "godaddy", status: "active", is_demo: false },
  { slug: "namecheap", name: "Namecheap", official_url: "https://www.namecheap.com", api_provider: "namecheap", status: "active", is_demo: false },
];

async function main() {
  console.log("Seeding TLDs...");
  for (const t of TLDS) {
    const { error } = await sb.from("tlds").upsert(t, { onConflict: "extension" });
    if (error) console.error(t.extension, error.message);
  }
  console.log("Seeding registrars...");
  for (const r of REGISTRARS) {
    const { error } = await sb.from("registrars").upsert(r, { onConflict: "slug" });
    if (error) console.error(r.slug, error.message);
  }
  console.log("Done. Catalog metadata only — no fabricated live prices inserted.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
