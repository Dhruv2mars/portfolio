import Link from "next/link";
import { Row, SectionHead } from "@/components/ledger";
import { getLatestPublishedPosts } from "@/lib/blog";

/**
 * `YYYY-MM-DD` — the ledger's only date format. Dates are data, so they are
 * mono, tabular, and machine-shaped; no "August 8, 2026" anywhere.
 */
export function isoDay(publishedAt: string): string {
  const match = /^\d{4}-\d{2}-\d{2}/.exec(publishedAt);
  if (match) return match[0];
  const parsed = new Date(publishedAt);
  return Number.isNaN(parsed.getTime())
    ? publishedAt
    : parsed.toISOString().slice(0, 10);
}

/**
 * Home → LATEST (DESIGN.md §4, §8). Up to three Posts in the row grammar,
 * no index numeral, the date in the tail. The whole section is omitted by
 * `app/page.tsx` when zero Posts are published — an empty teaser is a CONTEXT
 * anti-pattern, so this component never renders a placeholder.
 */
export function HomeBlog() {
  const posts = getLatestPublishedPosts(3);
  if (posts.length === 0) return null;

  return (
    <>
      <SectionHead
        label="LATEST"
        value="Product thinking, written down as it happens."
        action={
          <Link href="/blog" className="section-head-link">
            all posts ↗
          </Link>
        }
      />

      {/* 20px to the first row; the row's own 20px padding completes the block */}
      <div data-reveal-text="" style={{ marginTop: 20 }}>
        {posts.map((post) => (
          <Row
            key={post.slug}
            name={post.title}
            tail={isoDay(post.publishedAt)}
            description={post.summary}
            href={`/blog/${post.slug}`}
          />
        ))}
      </div>
    </>
  );
}
