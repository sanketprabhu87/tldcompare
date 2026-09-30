import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));
  const type = searchParams.get("type");

  try {
    const where = type ? { type: type as never, status: "ACTIVE" as const } : { status: "ACTIVE" as const };
    const [items, total] = await Promise.all([
      prisma.tld.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { extension: "asc" },
        select: {
          extension: true,
          name: true,
          type: true,
          registry: true,
          country: true,
          whoisPrivacy: true,
          dnssec: true,
          popularityScore: true,
          isDemo: true,
        },
      }),
      prisma.tld.count({ where }),
    ]);
    return NextResponse.json({
      data: items,
      meta: { page, limit, total, demo: true },
      notice: "Demo/sample data unless live sources connected.",
    });
  } catch (e) {
    return NextResponse.json({ error: "Database unavailable", detail: String(e) }, { status: 503 });
  }
}
