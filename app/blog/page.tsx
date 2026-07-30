import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { formatPostDate, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product thinking in writing.",
  openGraph: {
    title: "Blog",
    description: "Product thinking in writing.",
  },
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <section className="pt-16 pb-20 sm:pt-20" aria-labelledby="blog-heading">
      <Reveal>
        <p className="eyebrow mb-4">Index</p>
        <h1 id="blog-heading" className="page-title">
          Blog
        </h1>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-surface/40 px-5 py-10 sm:px-8">
            <p className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
              Coming soon
            </p>
            <p className="body-copy mt-3 max-w-[30rem]">
              The pipeline is live — MDX, RSS, and SEO are wired. Posts land
              here when they&apos;re ready.
            </p>
          </div>
        ) : (
          <ul
            className="mt-10 divide-y divide-border/70"
            aria-labelledby="blog-heading"
          >
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="row-interactive block py-4 no-underline"
                >
                  <span className="text-[1.0625rem] font-medium tracking-[-0.015em] text-foreground">
                    {post.title}
                  </span>
                  <p className="meta-copy mt-1.5">
                    {formatPostDate(post.publishedAt)}
                    <span aria-hidden> · </span>
                    {post.readingTimeMinutes} min read
                  </p>
                  <p className="mt-2 max-w-[36rem] text-[14px] leading-6 text-muted text-pretty">
                    {post.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
