import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/panel";
import { PostSearch } from "@/components/post-search";
import { getPublishedPosts } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";

/**
 * With nothing published the route 404s, so it must not advertise itself as a
 * Blog — naming a page the Visitor cannot reach is a lie told by the tab.
 */
export function generateMetadata(): Metadata {
  if (getPublishedPosts().length === 0) return { title: "Nothing lives here" };
  return {
    title: "Blog",
    alternates: { canonical: `${site.url}/blog` },
  };
}

export default function BlogPage() {
  // Nothing empty is ever shown to a Visitor (CONTEXT.md → Blog / Post).
  const posts = getPublishedPosts();
  if (posts.length === 0) notFound();

  // The body is the one thing a row never draws, and the rows are drawn in the
  // browser here — so it is dropped before the list crosses over rather than
  // shipped down and ignored.
  const summaries = posts.map(({ content: _content, ...summary }) => summary);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog`,
    name: "Blog",
    url: `${site.url}/blog`,
    author: { "@type": "Person", name: site.name, url: site.url },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${site.url}/blog/${post.slug}`,
      headline: post.title,
      description: post.summary,
      url: `${site.url}/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* One panel, not a heading floating above a list: the index is a single
          thing on the page, and the site draws single things inside rails.
          There is no tagline under the title — the reference needs one because
          its heading *is* the tagline; ours says the word the nav promised and
          then gets out of the way of the posts. */}
      <Panel id="blog">
        <PanelHeader>
          <PanelTitle as="h1">
            Blog
            <PanelTitleSup className="tabular-nums">
              {posts.length}
            </PanelTitleSup>
          </PanelTitle>
        </PanelHeader>

        <PostSearch posts={summaries} />
      </Panel>
    </>
  );
}
