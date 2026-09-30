import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDomainInput, threeYearCost } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const parsed = parseDomainInput(q);
  if (!parsed.keyword) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const defaults = ["com", "net", "org", "io", "ai", "dev", "app", "co", "xyz"];
  const extensions = parsed.tld ? [parsed.tld] : defaults;

  try {
    const tlds = await prisma.tld.findMany({
      where: { extension: { in: extensions } },
      include: {
        pricing: {
          orderBy: { registrationPrice: "asc" },
          take: 1,
          include: { registrar: { select: { slug: true, name: true, affiliateUrl: true } } },
        },
      },
    });

    const results = tlds.map((t) => {
      const p = t.pricing[0];
      const reg = p ? Number(p.registrationPrice) : null;
      const ren = p ? Number(p.renewalPrice) : null;
      return {
        domain: `${parsed.keyword}.${t.extension}`,
        tld: t.extension,
        availability: "UNKNOWN",
        registration: reg,
        renewal: ren,
        threeYear: reg != null && ren != null ? threeYearCost(reg, ren) : null,
        registrar: p?.registrar?.name ?? null,
        affiliateUrl: p?.registrar?.affiliateUrl ?? null,
        isDemo: true,
      };
    });

    return NextResponse.json({
      query: q,
      keyword: parsed.keyword,
      results,
      notice: "Availability is UNKNOWN in demo mode. Connect live providers for real checks.",
    });
  } catch (e) {
    return NextResponse.json({ error: "Database unavailable", detail: String(e) }, { status: 503 });
  }
}
