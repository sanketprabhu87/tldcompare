import { NextResponse } from "next/server";
import { parseDomainOrKeyword } from "@/lib/domain/parse";
import { getActiveProviders } from "@/lib/providers/registry";
import { calculateOwnershipCost } from "@/lib/pricing/ownership";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const parsed = parseDomainOrKeyword(q);
  if (!parsed.keyword) {
    return NextResponse.json({ error: "Missing or invalid q" }, { status: 400 });
  }
  const providers = getActiveProviders();
  const primary = providers[0];
  if (!primary) return NextResponse.json({ error: "No providers configured" }, { status: 503 });

  const exts = parsed.extension ? [parsed.extension] : ["com", "net", "org", "io", "ai", "dev", "app"];
  const results = [];
  for (const ext of exts) {
    const domain = `${parsed.keyword}.${ext}`;
    const [avail, reg, ren] = await Promise.all([
      primary.checkAvailability(domain),
      primary.getRegistrationPrice(domain),
      primary.getRenewalPrice(domain),
    ]);
    const cost = calculateOwnershipCost({ registration: reg.money.amount, renewal: ren.money.amount, years: 3 });
    results.push({
      domain,
      availability: avail.status,
      availabilitySource: avail.sourceType,
      registration: reg.money.amount,
      renewal: ren.money.amount,
      threeYear: cost.total,
      currency: reg.money.currency,
      priceSource: reg.sourceType,
      checkedAt: avail.checkedAt,
      provider: primary.metadata.slug,
    });
  }
  return NextResponse.json({ query: q, keyword: parsed.keyword, results, notice: "Demo-sourced rows are not live." });
}
