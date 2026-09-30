import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tld = searchParams.get("tld");
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));

  try {
    const where = tld
      ? { tld: { extension: tld.toLowerCase() } }
      : {};
    const items = await prisma.pricing.findMany({
      where,
      take: limit,
      orderBy: { registrationPrice: "asc" },
      include: {
        tld: { select: { extension: true } },
        registrar: { select: { slug: true, name: true } },
      },
    });
    return NextResponse.json({
      data: items.map((p) => ({
        tld: p.tld.extension,
        registrar: p.registrar.slug,
        registrarName: p.registrar.name,
        currency: p.currency,
        registration: Number(p.registrationPrice),
        renewal: Number(p.renewalPrice),
        transfer: p.transferPrice != null ? Number(p.transferPrice) : null,
        promo: p.promoPrice != null ? Number(p.promoPrice) : null,
        promoCode: p.promoCode,
        isDemo: p.isDemo,
        confidence: p.confidence,
        lastChecked: p.lastChecked,
      })),
      notice: "Prices are indicative. Demo data labelled.",
    });
  } catch (e) {
    return NextResponse.json({ error: "Database unavailable", detail: String(e) }, { status: 503 });
  }
}
