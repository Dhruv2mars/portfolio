import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getPublishedPosts } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writings",
  description: "Product thinking in writing.",
  openGraph: {
    title: "Writings",
    description: "Product thinking in writing.",
  },
};

export default function WritingsPage() {
  const posts = getPublishedPosts();

  return (
    <section className="pt-14 pb-20 sm:pt-16" aria-labelledby="writings-heading">
      <p className="meta-copy mb-4">Index</p>
      <h1 id="writings-heading" className="display-title">
        Writings
      </h1>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border-strong bg-background-muted/60 px-5 py-10 sm:px-8">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Coming soon
          </p>
          <p className="body-copy mt-3 max-w-[32rem]">
            The pipeline is live — MDX, RSS, and SEO are wired. Essays land here
            when they&apos;re ready.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-border" aria-labelledby="writings-heading">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writings/${post.slug}`}
                className="row-interactive block no-underline"
              >
                <span className="text-[1.0625rem] font-medium tracking-[-0.015em] text-foreground">
                  {post.title}
                </span>
                <p className="meta-copy mt-1.5">
                  {formatPostDate(post.publishedAt)}
                  <span aria-hidden> · </span>
                  {post.readingTimeMinutes} min read
                </p>
                <p className="mt-2 max-w-[38rem] text-[14px] leading-6 text-muted text-pretty">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
