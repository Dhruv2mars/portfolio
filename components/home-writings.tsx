import Link from "next/link";
import { formatPostDate, getLatestPublishedPosts } from "@/lib/writings";

export function HomeWritings() {
  const posts = getLatestPublishedPosts(3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-writings-heading"
      className="border-t border-border pt-10 pb-8 sm:pt-12 sm:pb-10"
    >
      <h2
        id="home-writings-heading"
        className="text-[1.125rem] font-semibold tracking-tight text-foreground"
      >
        Latest Writings
      </h2>
      <ul className="mt-6 space-y-5" aria-labelledby="home-writings-heading">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writings/${post.slug}`}
              className="inline-flex min-h-9 items-center text-[15px] font-medium text-foreground no-underline transition-opacity duration-200 ease-[var(--ease-editorial)] hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {formatPostDate(post.publishedAt)}
            </p>
            <p className="mt-1 max-w-[38rem] text-[14px] leading-6 text-muted text-pretty">
              {post.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
