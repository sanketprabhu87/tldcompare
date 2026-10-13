/**
 * Affiliate URL helpers — only approved templates; no fabricated tracking IDs.
 */
export function buildOutboundUrl(
  destinationUrl: string,
  trackingTemplate?: string | null
): string {
  if (!destinationUrl || !/^https?:\/\//i.test(destinationUrl)) {
    throw new Error("Invalid destination URL");
  }
  if (!trackingTemplate) return destinationUrl;
  // Template may contain {url} placeholder
  if (trackingTemplate.includes("{url}")) {
    return trackingTemplate.replace("{url}", encodeURIComponent(destinationUrl));
  }
  return trackingTemplate;
}

export function safeRel(): string {
  return "noopener noreferrer sponsored";
}
