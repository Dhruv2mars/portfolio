import { site } from "@/lib/site";
import { buildRssXml } from "@/lib/discovery";
import { getPublishedPosts } from "@/lib/blog";

export async function GET() {
  const xml = buildRssXml({
    siteUrl: site.url,
    siteName: site.name,
    description: site.positioning,
    posts: getPublishedPosts(),
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  });
}
