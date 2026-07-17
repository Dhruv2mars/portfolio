import type { Metadata } from "next";
import Link from "next/link";
import {
  formatPostDate,
  getPublishedPosts,
} from "@/lib/writings";

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
    <section className="pt-10 pb-16 sm:pt-14" aria-labelledby="writings-heading">
      <h1
        id="writings-heading"
        className="text-[1.75rem] font-semibold tracking-tight text-foreground text-pretty sm:text-[2rem]"
      >
        Writings
      </h1>

      {posts.length === 0 ? (
        <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted text-pretty">
          No Posts published yet. This surface stays ready for when they land.
        </p>
      ) : (
        <ul className="mt-8 space-y-8" aria-labelledby="writings-heading">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writings/${post.slug}`}
                className="inline-flex min-h-9 items-center text-[1.0625rem] font-medium text-foreground no-underline transition-opacity duration-200 ease-[var(--ease-editorial)] hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {formatPostDate(post.publishedAt)}
                <span aria-hidden="true"> · </span>
                {post.readingTimeMinutes} min read
              </p>
              <p className="mt-2 max-w-[38rem] text-[15px] leading-6 text-muted text-pretty">
                {post.summary}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
