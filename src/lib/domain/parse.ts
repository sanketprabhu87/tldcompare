import { z } from "zod";

const domainRegex = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const labelRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export const searchInputSchema = z.string().trim().min(1).max(253);

export function normalizeInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.$/, "");
}

export function parseDomainOrKeyword(raw: string): {
  kind: "domain" | "keyword";
  keyword: string;
  extension: string | null;
  fqdn: string | null;
} {
  const cleaned = normalizeInput(raw);
  if (!cleaned) {
    return { kind: "keyword", keyword: "", extension: null, fqdn: null };
  }
  if (domainRegex.test(cleaned)) {
    const parts = cleaned.split(".");
    const extension = parts.pop()!;
    const keyword = parts.join(".");
    return { kind: "domain", keyword, extension, fqdn: cleaned };
  }
  // keyword with optional trailing extension hint: "brand.ai"
  const parts = cleaned.split(".");
  if (parts.length === 2 && labelRegex.test(parts[0]) && /^[a-z]{2,24}$/i.test(parts[1])) {
    return {
      kind: "domain",
      keyword: parts[0],
      extension: parts[1],
      fqdn: cleaned,
    };
  }
  return { kind: "keyword", keyword: cleaned.replace(/[^a-z0-9-]/gi, ""), extension: null, fqdn: null };
}

export function isValidLabel(label: string): boolean {
  return labelRegex.test(label) && label.length <= 63;
}
