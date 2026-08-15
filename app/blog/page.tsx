import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { formatPostDate, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building tooling for coding agents.",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  // Nothing empty is ever shown to a Visitor (CONTEXT.md → Blog / Post).
  if (posts.length === 0) notFound();

  return (
    <div className="pt-14 sm:pt-20">
      <SectionHeading label="blog" aside={`${posts.length}`} />

      <ul className="reveal mt-2">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className="border-b border-border last:border-0"
            style={{ "--i": index } as React.CSSProperties}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="row-item flex items-baseline gap-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-base font-medium tracking-tight text-foreground">
                  {post.title}
                </span>
                <span className="mt-1.5 block max-w-[52ch] text-sm text-muted">
                  {post.summary}
                </span>
              </span>
              <span className="shrink-0 font-mono text-2xs tabular-nums text-dim">
                {formatPostDate(post.publishedAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
