import type { Metadata } from "next";
import { isoDay } from "@/components/home-blog";
import { Field, Row, Rule, SectionHead } from "@/components/ledger";
import { Reveal } from "@/components/reveal";
import { getPublishedPosts, type PostRecord } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product thinking in writing.",
  openGraph: {
    title: "Blog",
    description: "Product thinking in writing.",
  },
};

/** Posts arrive newest-first, so a single pass keeps the year groups ordered. */
function groupByYear(
  posts: readonly PostRecord[],
): { year: string; posts: PostRecord[] }[] {
  const groups: { year: string; posts: PostRecord[] }[] = [];
  for (const post of posts) {
    const year = isoDay(post.publishedAt).slice(0, 4);
    const current = groups[groups.length - 1];
    if (current && current.year === year) current.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}

/**
 * Blog index (DESIGN.md §8): header · 120 · two-line heading · rule · lead ·
 * 60 · rows grouped by year.
 *
 * The year marker lives OUTSIDE the field, in the left gutter, sticky at 60px
 * — the gutters carrying content is what justifies the 1056px field. Below
 * 1280px (where the gutters do not exist) it degrades to a plain label row
 * above its group.
 */
export default function BlogPage() {
  const posts = getPublishedPosts();
  const groups = groupByYear(posts);

  return (
    <div style={{ paddingTop: 120, paddingBottom: 160 }}>
      <Reveal as="section">
        <Field>
          <SectionHead label="BLOG" value="Product thinking, written down." />

          <div style={{ marginTop: 20 }}>
            <Rule />
          </div>

          <p className="t-lead" data-reveal-text="" style={{ marginTop: 20 }}>
            Notes on design engineering, agents, and the judgment behind what
            ships. Every Post is something I had to decide for real.
          </p>

          {posts.length === 0 ? (
            /* One of exactly three display moments sitewide. The absence is
               the content — no illustration, no badge, no sample Posts. */
            <div data-reveal-text="" style={{ marginTop: 120 }}>
              <p className="t-display" style={{ color: "var(--color-fg-dim)" }}>
                0 posts
              </p>
              <p className="t-value" style={{ marginTop: 40 }}>
                Writing lands here. The first is in progress.
              </p>
              <div style={{ marginTop: 60 }}>
                <a
                  className="t-meta link-quiet"
                  href={site.rssPath}
                  style={{ display: "inline-block" }}
                >
                  rss ↗
                </a>
              </div>
            </div>
          ) : (
            <div data-reveal-text="" style={{ marginTop: 60 }}>
              {groups.map((group) => (
                <div key={group.year} className="relative">
                  <h3 className="t-meta mb-[20px] xl:absolute xl:top-0 xl:bottom-0 xl:left-[calc(-1_*_var(--gutter))] xl:mb-0 xl:w-[calc(var(--gutter)_-_20px)] xl:text-right">
                    <span className="xl:sticky xl:top-[60px] xl:block">
                      {group.year}
                    </span>
                  </h3>
                  {group.posts.map((post) => (
                    <Row
                      key={post.slug}
                      name={post.title}
                      tail={`${isoDay(post.publishedAt)} · ${post.readingTimeMinutes} min`}
                      description={post.summary}
                      href={`/blog/${post.slug}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </Field>
      </Reveal>
    </div>
  );
}
