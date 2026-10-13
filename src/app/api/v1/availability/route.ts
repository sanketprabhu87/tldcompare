import { NextResponse } from "next/server";
import { parseDomainOrKeyword } from "@/lib/domain/parse";
import { getActiveProviders } from "@/lib/providers/registry";

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain") || "";
  const parsed = parseDomainOrKeyword(domain);
  if (parsed.kind !== "domain" || !parsed.fqdn) {
    return NextResponse.json({ error: "Provide a full domain, e.g. example.com" }, { status: 400 });
  }
  const results = await Promise.all(getActiveProviders().map((p) => p.checkAvailability(parsed.fqdn!)));
  return NextResponse.json({ domain: parsed.fqdn, results });
}
