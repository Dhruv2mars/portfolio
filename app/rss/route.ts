import { site } from "@/lib/site";
import { buildRssFeed, getPublishedWriting } from "@/lib/writing";

export function GET() {
  const pieces = getPublishedWriting();
  const rssFeed = buildRssFeed(pieces, {
    title: `${site.name} — Writing`,
    description: "Long-form Writing that shows how Dhruv thinks and decides.",
    baseUrl: site.url,
  });

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
