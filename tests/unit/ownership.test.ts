import { describe, it, expect } from "vitest";
import { calculateOwnershipCost, formatMoney } from "../../src/lib/pricing/ownership";
import { parseDomainOrKeyword } from "../../src/lib/domain/parse";

describe("calculateOwnershipCost", () => {
  it("computes 3-year total as reg + 2*ren", () => {
    const r = calculateOwnershipCost({ registration: 10, renewal: 12, years: 3 });
    expect(r.total).toBe(34);
    expect(r.incomplete).toBe(false);
  });

  it("does not invent totals when registration missing", () => {
    const r = calculateOwnershipCost({ registration: null, renewal: 12, years: 3 });
    expect(r.total).toBeNull();
    expect(r.incomplete).toBe(true);
  });

  it("formats unavailable money", () => {
    expect(formatMoney(null)).toBe("Price unavailable");
  });
});

describe("parseDomainOrKeyword", () => {
  it("parses full domains", () => {
    const r = parseDomainOrKeyword("Example.COM");
    expect(r.kind).toBe("domain");
    expect(r.keyword).toBe("example");
    expect(r.extension).toBe("com");
  });

  it("parses keywords", () => {
    const r = parseDomainOrKeyword("mybrand");
    expect(r.kind).toBe("keyword");
    expect(r.keyword).toBe("mybrand");
  });
});
