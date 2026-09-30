/**
 * TLDCompare Seed — ALL DATA IS DEMO / SAMPLE DATA
 */
import { PrismaClient, TldType, TldStatus, DataConfidence } from "@prisma/client";

const prisma = new PrismaClient();

const REGISTRARS = [
  { slug: "namecheap", name: "Namecheap", website: "https://www.namecheap.com", affiliateUrl: "https://www.namecheap.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "porkbun", name: "Porkbun", website: "https://porkbun.com", affiliateUrl: "https://porkbun.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "cloudflare", name: "Cloudflare Registrar", website: "https://www.cloudflare.com/products/registrar", affiliateUrl: null as string | null, whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "godaddy", name: "GoDaddy", website: "https://www.godaddy.com", affiliateUrl: "https://www.godaddy.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "dynadot", name: "Dynadot", website: "https://www.dynadot.com", affiliateUrl: "https://www.dynadot.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "name.com", name: "Name.com", website: "https://www.name.com", affiliateUrl: "https://www.name.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "gandi", name: "Gandi", website: "https://www.gandi.net", affiliateUrl: null, whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "spaceship", name: "Spaceship", website: "https://www.spaceship.com", affiliateUrl: "https://www.spaceship.com/?aff=DEMO", whoisPrivacy: true, dnssec: true, apiAvailable: true },
  { slug: "hover", name: "Hover", website: "https://www.hover.com", affiliateUrl: null, whoisPrivacy: true, dnssec: true, apiAvailable: false },
  { slug: "hostinger", name: "Hostinger", website: "https://www.hostinger.com", affiliateUrl: "https://www.hostinger.com/?aff=DEMO", whoisPrivacy: true, dnssec: false, apiAvailable: false },
];

const TLDS = [
  { extension: "com", name: ".COM", type: "GTLD" as TldType, registry: "Verisign", popularityScore: 100, description: "Most popular commercial TLD." },
  { extension: "net", name: ".NET", type: "GTLD" as TldType, registry: "Verisign", popularityScore: 85, description: "Network and general use." },
  { extension: "org", name: ".ORG", type: "GTLD" as TldType, registry: "Public Interest Registry", popularityScore: 80, description: "Organizations and non-profits." },
  { extension: "io", name: ".IO", type: "CCTLD" as TldType, registry: "Identity Digital", country: "British Indian Ocean Territory", countryCode: "IO", popularityScore: 75, description: "Popular with tech startups." },
  { extension: "ai", name: ".AI", type: "CCTLD" as TldType, registry: "Identity Digital", country: "Anguilla", countryCode: "AI", popularityScore: 90, description: "Preferred for AI projects." },
  { extension: "dev", name: ".DEV", type: "NEW_GTLD" as TldType, registry: "Google Registry", popularityScore: 70, description: "For developers; HTTPS required." },
  { extension: "app", name: ".APP", type: "NEW_GTLD" as TldType, registry: "Google Registry", popularityScore: 65, description: "Applications; HTTPS required." },
  { extension: "co", name: ".CO", type: "CCTLD" as TldType, registry: ".CO Internet", country: "Colombia", countryCode: "CO", popularityScore: 72, description: "Company alternative to .com." },
  { extension: "xyz", name: ".XYZ", type: "NEW_GTLD" as TldType, registry: "XYZ.COM LLC", popularityScore: 55, description: "Generic affordable extension." },
  { extension: "me", name: ".ME", type: "CCTLD" as TldType, registry: "doMEn", country: "Montenegro", countryCode: "ME", popularityScore: 60, description: "Personal branding." },
  { extension: "info", name: ".INFO", type: "GTLD" as TldType, registry: "Identity Digital", popularityScore: 50, description: "Informational sites." },
  { extension: "online", name: ".ONLINE", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 48, description: "General online presence." },
  { extension: "store", name: ".STORE", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 52, description: "Ecommerce." },
  { extension: "tech", name: ".TECH", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 58, description: "Technology." },
  { extension: "cloud", name: ".CLOUD", type: "NEW_GTLD" as TldType, registry: "Aruba PEC", popularityScore: 45, description: "Cloud services." },
  { extension: "shop", name: ".SHOP", type: "NEW_GTLD" as TldType, registry: "GMO Registry", popularityScore: 50, description: "Online retail." },
  { extension: "site", name: ".SITE", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 42, description: "Websites." },
  { extension: "uk", name: ".UK", type: "CCTLD" as TldType, registry: "Nominet", country: "United Kingdom", countryCode: "GB", popularityScore: 78, description: "UK country-code." },
  { extension: "de", name: ".DE", type: "CCTLD" as TldType, registry: "DENIC", country: "Germany", countryCode: "DE", popularityScore: 82, description: "Germany country-code." },
  { extension: "ca", name: ".CA", type: "CCTLD" as TldType, registry: "CIRA", country: "Canada", countryCode: "CA", popularityScore: 68, description: "Canada; presence required." },
  { extension: "au", name: ".AU", type: "CCTLD" as TldType, registry: "auDA", country: "Australia", countryCode: "AU", popularityScore: 66, description: "Australia country-code." },
  { extension: "in", name: ".IN", type: "CCTLD" as TldType, registry: "NIXI", country: "India", countryCode: "IN", popularityScore: 62, description: "India country-code." },
  { extension: "us", name: ".US", type: "CCTLD" as TldType, registry: "GoDaddy Registry", country: "United States", countryCode: "US", popularityScore: 55, description: "US country-code." },
  { extension: "eu", name: ".EU", type: "CCTLD" as TldType, registry: "EURid", country: "European Union", countryCode: "EU", popularityScore: 60, description: "EU TLD." },
  { extension: "tv", name: ".TV", type: "CCTLD" as TldType, registry: "GoDaddy Registry", country: "Tuvalu", countryCode: "TV", popularityScore: 48, description: "Video and media." },
  { extension: "gg", name: ".GG", type: "CCTLD" as TldType, registry: "Island Networks", country: "Guernsey", countryCode: "GG", popularityScore: 40, description: "Gaming communities." },
  { extension: "academy", name: ".ACADEMY", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 22, description: "Education." },
  { extension: "agency", name: ".AGENCY", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 28, description: "Agencies." },
  { extension: "digital", name: ".DIGITAL", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 35, description: "Digital products." },
  { extension: "design", name: ".DESIGN", type: "NEW_GTLD" as TldType, registry: "Top Level Design", popularityScore: 30, description: "Designers." },
  { extension: "finance", name: ".FINANCE", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 33, description: "Financial services." },
  { extension: "health", name: ".HEALTH", type: "NEW_GTLD" as TldType, registry: "DotHealth", popularityScore: 27, description: "Healthcare." },
  { extension: "travel", name: ".TRAVEL", type: "SPONSORED" as TldType, registry: "Dog Beach", popularityScore: 29, description: "Travel industry." },
  { extension: "food", name: ".FOOD", type: "NEW_GTLD" as TldType, registry: "Lifestyle Domain Holdings", popularityScore: 24, description: "Food brands." },
  { extension: "game", name: ".GAME", type: "NEW_GTLD" as TldType, registry: "Uniregistry", popularityScore: 31, description: "Gaming." },
  { extension: "software", name: ".SOFTWARE", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 26, description: "Software." },
  { extension: "company", name: ".COMPANY", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 32, description: "Companies." },
  { extension: "global", name: ".GLOBAL", type: "NEW_GTLD" as TldType, registry: "Dot Global", popularityScore: 34, description: "International brands." },
  { extension: "space", name: ".SPACE", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 27, description: "Space and creative." },
  { extension: "live", name: ".LIVE", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 30, description: "Live streaming." },
  { extension: "news", name: ".NEWS", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 33, description: "News media." },
  { extension: "studio", name: ".STUDIO", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 26, description: "Creative studios." },
  { extension: "art", name: ".ART", type: "NEW_GTLD" as TldType, registry: "UK Creative Ideas", popularityScore: 24, description: "Artists." },
  { extension: "blog", name: ".BLOG", type: "NEW_GTLD" as TldType, registry: "Knock Knock WHOIS There", popularityScore: 38, description: "Blogs." },
  { extension: "biz", name: ".BIZ", type: "GTLD" as TldType, registry: "Identity Digital", popularityScore: 40, description: "Business." },
  { extension: "jp", name: ".JP", type: "CCTLD" as TldType, registry: "JPRS", country: "Japan", countryCode: "JP", popularityScore: 65, description: "Japan." },
  { extension: "cn", name: ".CN", type: "CCTLD" as TldType, registry: "CNNIC", country: "China", countryCode: "CN", popularityScore: 70, description: "China." },
  { extension: "fr", name: ".FR", type: "CCTLD" as TldType, registry: "AFNIC", country: "France", countryCode: "FR", popularityScore: 58, description: "France." },
  { extension: "es", name: ".ES", type: "CCTLD" as TldType, registry: "Red.es", country: "Spain", countryCode: "ES", popularityScore: 52, description: "Spain." },
  { extension: "it", name: ".IT", type: "CCTLD" as TldType, registry: "IIT-CNR", country: "Italy", countryCode: "IT", popularityScore: 50, description: "Italy." },
  { extension: "nl", name: ".NL", type: "CCTLD" as TldType, registry: "SIDN", country: "Netherlands", countryCode: "NL", popularityScore: 54, description: "Netherlands." },
  { extension: "br", name: ".BR", type: "CCTLD" as TldType, registry: "Registro.br", country: "Brazil", countryCode: "BR", popularityScore: 55, description: "Brazil." },
  { extension: "kr", name: ".KR", type: "CCTLD" as TldType, registry: "KISA", country: "South Korea", countryCode: "KR", popularityScore: 48, description: "South Korea." },
  { extension: "sg", name: ".SG", type: "CCTLD" as TldType, registry: "SGNIC", country: "Singapore", countryCode: "SG", popularityScore: 45, description: "Singapore." },
  { extension: "ae", name: ".AE", type: "CCTLD" as TldType, registry: "TRA", country: "United Arab Emirates", countryCode: "AE", popularityScore: 36, description: "UAE." },
  { extension: "nz", name: ".NZ", type: "CCTLD" as TldType, registry: "InternetNZ", country: "New Zealand", countryCode: "NZ", popularityScore: 43, description: "New Zealand." },
  { extension: "ie", name: ".IE", type: "CCTLD" as TldType, registry: "IE Domain Registry", country: "Ireland", countryCode: "IE", popularityScore: 41, description: "Ireland." },
  { extension: "ch", name: ".CH", type: "CCTLD" as TldType, registry: "SWITCH", country: "Switzerland", countryCode: "CH", popularityScore: 46, description: "Switzerland." },
  { extension: "se", name: ".SE", type: "CCTLD" as TldType, registry: "IIS", country: "Sweden", countryCode: "SE", popularityScore: 44, description: "Sweden." },
  { extension: "pl", name: ".PL", type: "CCTLD" as TldType, registry: "NASK", country: "Poland", countryCode: "PL", popularityScore: 42, description: "Poland." },
  { extension: "mx", name: ".MX", type: "CCTLD" as TldType, registry: "NIC Mexico", country: "Mexico", countryCode: "MX", popularityScore: 38, description: "Mexico." },
  { extension: "za", name: ".ZA", type: "CCTLD" as TldType, registry: "ZADNA", country: "South Africa", countryCode: "ZA", popularityScore: 33, description: "South Africa." },
  { extension: "id", name: ".ID", type: "CCTLD" as TldType, registry: "PANDI", country: "Indonesia", countryCode: "ID", popularityScore: 34, description: "Indonesia." },
  { extension: "solutions", name: ".SOLUTIONS", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 25, description: "Business solutions." },
  { extension: "systems", name: ".SYSTEMS", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 23, description: "Systems." },
  { extension: "world", name: ".WORLD", type: "NEW_GTLD" as TldType, registry: "Binky Moon", popularityScore: 28, description: "Global presence." },
  { extension: "fun", name: ".FUN", type: "NEW_GTLD" as TldType, registry: "Radix", popularityScore: 22, description: "Entertainment." },
  { extension: "media", name: ".MEDIA", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 31, description: "Media companies." },
  { extension: "blog", name: ".BLOG", type: "NEW_GTLD" as TldType, registry: "Knock Knock WHOIS There", popularityScore: 38, description: "Blogs." },
  { extension: "money", name: ".MONEY", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 21, description: "Finance." },
  { extension: "cc", name: ".CC", type: "CCTLD" as TldType, registry: "Verisign", country: "Cocos Islands", countryCode: "CC", popularityScore: 35, description: "Alternative to .com." },
  { extension: "to", name: ".TO", type: "CCTLD" as TldType, registry: "Tonic", country: "Tonga", countryCode: "TO", popularityScore: 28, description: "Flexible policies." },
  { extension: "fm", name: ".FM", type: "CCTLD" as TldType, registry: "BRS Media", country: "Micronesia", countryCode: "FM", popularityScore: 32, description: "Audio brands." },
  { extension: "ly", name: ".LY", type: "CCTLD" as TldType, registry: "Libya Telecom", country: "Libya", countryCode: "LY", popularityScore: 36, description: "Short links." },
  { extension: "sh", name: ".SH", type: "CCTLD" as TldType, registry: "Government of St. Helena", country: "Saint Helena", countryCode: "SH", popularityScore: 25, description: "Tech projects." },
  { extension: "is", name: ".IS", type: "CCTLD" as TldType, registry: "ISNIC", country: "Iceland", countryCode: "IS", popularityScore: 34, description: "Iceland." },
  { extension: "so", name: ".SO", type: "CCTLD" as TldType, registry: "Somic", country: "Somalia", countryCode: "SO", popularityScore: 30, description: "Social projects." },
  { extension: "school", name: ".SCHOOL", type: "NEW_GTLD" as TldType, registry: "Identity Digital", popularityScore: 19, description: "Schools." },
  { extension: "hotel", name: ".HOTEL", type: "NEW_GTLD" as TldType, registry: "HOTEL Top-Level Domain", popularityScore: 22, description: "Hotels." },
  { extension: "homes", name: ".HOMES", type: "NEW_GTLD" as TldType, registry: "XYZ.COM LLC", popularityScore: 20, description: "Real estate." },
  { extension: "photo", name: ".PHOTO", type: "NEW_GTLD" as TldType, registry: "Uniregistry", popularityScore: 21, description: "Photography." },
  { extension: "video", name: ".VIDEO", type: "NEW_GTLD" as TldType, registry: "Uniregistry", popularityScore: 23, description: "Video." },
  { extension: "music", name: ".MUSIC", type: "NEW_GTLD" as TldType, registry: "DotMusic", popularityScore: 25, description: "Music." },
];

const CATEGORIES = [
  { slug: "technology", name: "Technology", description: "Tech companies, startups and developers." },
  { slug: "ai", name: "AI & Machine Learning", description: "AI and ML projects." },
  { slug: "business", name: "Business", description: "Professional and commercial." },
  { slug: "finance", name: "Finance", description: "Banking and investments." },
  { slug: "education", name: "Education", description: "Schools and learning." },
  { slug: "healthcare", name: "Healthcare", description: "Medical and wellness." },
  { slug: "travel", name: "Travel", description: "Travel and tourism." },
  { slug: "food", name: "Food & Dining", description: "Restaurants and food." },
  { slug: "ecommerce", name: "Ecommerce", description: "Online stores." },
  { slug: "community", name: "Community", description: "Communities and social." },
  { slug: "personal", name: "Personal", description: "Personal branding." },
  { slug: "creative", name: "Creative", description: "Design, art and studio." },
  { slug: "developer", name: "Developer", description: "Developer tools." },
  { slug: "gaming", name: "Gaming", description: "Games and esports." },
  { slug: "geographic", name: "Geographic", description: "Country and region TLDs." },
];

const PRICE_MAP: Record<string, { reg: number; ren: number; trf: number }> = {
  com: { reg: 9.98, ren: 12.98, trf: 9.98 },
  net: { reg: 11.98, ren: 14.98, trf: 11.98 },
  org: { reg: 10.98, ren: 13.98, trf: 10.98 },
  io: { reg: 32.98, ren: 39.98, trf: 32.98 },
  ai: { reg: 69.98, ren: 79.98, trf: 69.98 },
  dev: { reg: 12, ren: 12, trf: 12 },
  app: { reg: 14, ren: 14, trf: 14 },
  co: { reg: 11.99, ren: 28.99, trf: 11.99 },
  xyz: { reg: 1.99, ren: 12.99, trf: 1.99 },
  me: { reg: 6.99, ren: 19.99, trf: 6.99 },
  info: { reg: 3.99, ren: 18.99, trf: 3.99 },
  online: { reg: 2.99, ren: 29.99, trf: 2.99 },
  store: { reg: 2.99, ren: 49.99, trf: 2.99 },
  tech: { reg: 5.99, ren: 39.99, trf: 5.99 },
  cloud: { reg: 9.99, ren: 19.99, trf: 9.99 },
  shop: { reg: 2.99, ren: 29.99, trf: 2.99 },
  site: { reg: 1.99, ren: 24.99, trf: 1.99 },
  uk: { reg: 7.99, ren: 9.99, trf: 7.99 },
  de: { reg: 6.99, ren: 8.99, trf: 6.99 },
  ca: { reg: 12.99, ren: 15.99, trf: 12.99 },
  default: { reg: 14.99, ren: 19.99, trf: 14.99 },
};

async function main() {
  console.log("Seeding DEMO data...");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }
  const registrarIds: Record<string, string> = {};
  for (const r of REGISTRARS) {
    const rec = await prisma.registrar.upsert({
      where: { slug: r.slug },
      update: { name: r.name, website: r.website, affiliateUrl: r.affiliateUrl, whoisPrivacy: r.whoisPrivacy, dnssec: r.dnssec, apiAvailable: r.apiAvailable, isDemo: true },
      create: { slug: r.slug, name: r.name, website: r.website, affiliateUrl: r.affiliateUrl, whoisPrivacy: r.whoisPrivacy, dnssec: r.dnssec, apiAvailable: r.apiAvailable, isDemo: true, description: r.name + " — DEMO listing." },
    });
    registrarIds[r.slug] = rec.id;
  }
  const tldIds: Record<string, string> = {};
  const unique = Array.from(new Map(TLDS.map((t) => [t.extension, t])).values());
  for (const t of unique) {
    const rec = await prisma.tld.upsert({
      where: { extension: t.extension },
      update: { name: t.name, type: t.type, registry: t.registry, country: (t as any).country, countryCode: (t as any).countryCode, description: t.description, popularityScore: t.popularityScore, isDemo: true, status: "ACTIVE" as TldStatus },
      create: { extension: t.extension, name: t.name, type: t.type, registry: t.registry, country: (t as any).country, countryCode: (t as any).countryCode, description: t.description, popularityScore: t.popularityScore, isDemo: true, status: "ACTIVE" as TldStatus },
    });
    tldIds[t.extension] = rec.id;
  }
  const catMap: Record<string, string[]> = {
    technology: ["io", "ai", "dev", "app", "tech", "cloud", "software", "systems"],
    ai: ["ai", "io", "dev", "tech"],
    business: ["com", "co", "biz", "company", "solutions", "agency"],
    finance: ["finance", "money"],
    education: ["academy", "school"],
    geographic: ["uk", "de", "ca", "au", "in", "us", "eu", "jp", "cn"],
    developer: ["dev", "io", "app", "tech", "software"],
    ecommerce: ["shop", "store", "online"],
    personal: ["me"],
    creative: ["design", "studio", "art", "photo", "video"],
    gaming: ["game", "gg", "fun"],
  };
  for (const [slug, exts] of Object.entries(catMap)) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) continue;
    for (const ext of exts) {
      const tid = tldIds[ext];
      if (!tid) continue;
      await prisma.tldCategoryRelation.upsert({
        where: { tldId_categoryId: { tldId: tid, categoryId: cat.id } },
        update: {},
        create: { tldId: tid, categoryId: cat.id },
      });
    }
  }
  const slugs = Object.keys(registrarIds);
  let n = 0;
  for (const [ext, tid] of Object.entries(tldIds)) {
    const base = PRICE_MAP[ext] || PRICE_MAP.default;
    for (let i = 0; i < slugs.length; i++) {
      const rid = registrarIds[slugs[i]];
      const f = 0.9 + (i % 5) * 0.05;
      const reg = Math.round(base.reg * f * 100) / 100;
      const ren = Math.round(base.ren * f * 100) / 100;
      const trf = Math.round(base.trf * f * 100) / 100;
      const promo = i % 3 === 0 && reg > 5;
      await prisma.pricing.upsert({
        where: { tldId_registrarId_currency: { tldId: tid, registrarId: rid, currency: "USD" } },
        update: { registrationPrice: reg, renewalPrice: ren, transferPrice: trf, promoPrice: promo ? Math.round(reg * 0.7 * 100) / 100 : null, promoCode: promo ? "DEMO20" : null, confidence: "DEMO" as DataConfidence, isDemo: true, sourceType: "demo", lastChecked: new Date() },
        create: { tldId: tid, registrarId: rid, currency: "USD", registrationPrice: reg, renewalPrice: ren, transferPrice: trf, promoPrice: promo ? Math.round(reg * 0.7 * 100) / 100 : null, promoCode: promo ? "DEMO20" : null, confidence: "DEMO" as DataConfidence, isDemo: true, sourceType: "demo", lastChecked: new Date() },
      });
      n++;
      await prisma.registrarTld.upsert({
        where: { registrarId_tldId: { registrarId: rid, tldId: tid } },
        update: { supported: true },
        create: { registrarId: rid, tldId: tid, supported: true },
      });
    }
  }
  for (const s of ["namecheap", "porkbun", "dynadot"]) {
    await prisma.promotion.create({
      data: {
        registrarId: registrarIds[s], code: "DEMO20", discount: "20% off first year",
        description: "DEMO promotion — not a real code.", tldsCovered: ["com", "net", "org", "xyz"],
        appliesTo: ["registration"], startDate: new Date(), endDate: new Date(Date.now() + 90 * 86400000),
        isActive: true, isDemo: true, affiliateUrl: REGISTRARS.find((r) => r.slug === s)?.affiliateUrl ?? undefined,
      },
    });
  }
  await prisma.dataSource.createMany({
    data: [
      { name: "Demo Pricing Seed", dataType: "pricing", status: "ok", method: "manual", isDemo: true, updateFrequency: "on seed", lastSuccessfulUpdate: new Date() },
      { name: "Demo TLD Metadata", dataType: "metadata", status: "ok", method: "manual", isDemo: true, updateFrequency: "on seed", lastSuccessfulUpdate: new Date() },
      { name: "Live Registrar APIs (placeholder)", dataType: "pricing", status: "unknown", method: "api", isDemo: false, updateFrequency: "6h", sourceUrl: "Configure REGISTRAR_API_KEY_*" },
    ],
    skipDuplicates: true,
  });
  console.log("TLDs:", unique.length, "Registrars:", REGISTRARS.length, "Pricing:", n);
  console.log("Seed complete. ALL DATA IS DEMO / SAMPLE DATA.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
