import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.registrar.findMany({
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        website: true,
        whoisPrivacy: true,
        dnssec: true,
        apiAvailable: true,
        isDemo: true,
      },
    });
    return NextResponse.json({ data: items, notice: "Demo listings labelled." });
  } catch (e) {
    return NextResponse.json({ error: "Database unavailable", detail: String(e) }, { status: 503 });
  }
}
