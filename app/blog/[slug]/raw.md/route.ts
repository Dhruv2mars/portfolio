import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { postMarkdown } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * The post as its source.
 *
 * Two audiences want this and neither wants HTML: a Visitor who would rather
 * read the markdown, and a model being handed the URL by the "Open in…"
 * actions on the page. The frontmatter is not served — it is bookkeeping for
 * the build — so the title and date are restated as prose the reader can see.
 *
 * The extension is in the path (`/blog/<slug>/raw.md`) because a Next dynamic
 * segment is the whole segment: `[slug].md` is not a route, it is a folder
 * with a dot in its name.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const markdown = postMarkdown(post, `${site.url}/blog/${post.slug}`, post.content);

  return new Response(markdown, {
    headers: {
      // Inline rather than a download: the point is to be readable in a tab.
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
