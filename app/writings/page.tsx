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
    <section className="pt-14 pb-20 sm:pt-20" aria-labelledby="writings-heading">
      <p className="section-title mb-4">Index</p>
      <h1 id="writings-heading" className="display-title">
        Writings
      </h1>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border-strong bg-background-muted/60 px-5 py-10 sm:px-8">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Coming soon
          </p>
          <p className="body-copy mt-3 max-w-[32rem]">
            The pipeline is live — MDX, RSS, and SEO are wired. Essays land here
            when they&apos;re ready.
          </p>
        </div>
      ) : (
        <ul className="cv-list mt-10" aria-labelledby="writings-heading">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writings/${post.slug}`} className="cv-row">
                <span className="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline">
                  <span className="cv-row-name">{post.title}</span>
                  <span className="cv-row-desc">{post.summary}</span>
                </span>
                <span className="cv-row-meta">
                  <span>
                    {formatPostDate(post.publishedAt)}
                    <span aria-hidden> · </span>
                    {post.readingTimeMinutes} min
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
