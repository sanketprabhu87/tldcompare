import { prisma } from "@/lib/db";
import { threeYearCost } from "@/lib/utils";

export async function getCheapestPricingForTld(tldId: string) {
  const rows = await prisma.pricing.findMany({
    where: { tldId },
    include: { registrar: true },
    orderBy: { registrationPrice: "asc" },
  });
  if (!rows.length) return null;
  const cheapest = rows[0];
  return {
    ...cheapest,
    threeYear: threeYearCost(Number(cheapest.registrationPrice), Number(cheapest.renewalPrice)),
  };
}

export async function getTldTableData(opts: {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  type?: string;
  maxReg?: number;
  search?: string;
}) {
  const page = opts.page ?? 1;
  const pageSize = Math.min(opts.pageSize ?? 50, 100);
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (opts.type) where.type = opts.type;
  if (opts.search) {
    where.OR = [
      { extension: { contains: opts.search.toLowerCase() } },
      { name: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  const [tlds, total] = await Promise.all([
    prisma.tld.findMany({
      where,
      include: {
        pricing: {
          include: { registrar: true },
          orderBy: { registrationPrice: "asc" },
          take: 1,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: opts.sort === "popularity" ? { popularityScore: opts.order ?? "desc" } : { extension: "asc" },
    }),
    prisma.tld.count({ where }),
  ]);

  const rows = tlds.map((t) => {
    const p = t.pricing[0];
    const reg = p ? Number(p.registrationPrice) : null;
    const ren = p ? Number(p.renewalPrice) : null;
    const trf = p?.transferPrice != null ? Number(p.transferPrice) : null;
    return {
      id: t.id,
      extension: t.extension,
      name: t.name,
      type: t.type,
      registry: t.registry,
      country: t.country,
      popularityScore: t.popularityScore,
      whoisPrivacy: t.whoisPrivacy,
      dnssec: t.dnssec,
      isDemo: t.isDemo,
      registration: reg,
      renewal: ren,
      transfer: trf,
      threeYear: reg != null && ren != null ? threeYearCost(reg, ren) : null,
      cheapestRegistrar: p?.registrar?.name ?? null,
      cheapestRegistrarSlug: p?.registrar?.slug ?? null,
      promoPrice: p?.promoPrice != null ? Number(p.promoPrice) : null,
      promoCode: p?.promoCode ?? null,
    };
  });

  if (opts.maxReg != null) {
    return {
      rows: rows.filter((r) => r.registration != null && r.registration <= opts.maxReg!),
      total,
      page,
      pageSize,
    };
  }

  return { rows, total, page, pageSize };
}
