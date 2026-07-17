/** Allowlist for MDX / post links. */
export function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("#")) return true;
  // Internal app paths only — not protocol-relative "//evil".
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}
