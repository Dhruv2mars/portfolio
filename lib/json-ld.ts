/** Serialize JSON for embedding in <script type="application/ld+json">. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
