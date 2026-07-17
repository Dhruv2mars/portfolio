import Link from "next/link";
import { HOME_SECTION_COPY } from "@/lib/home";
import { formatPostDate, getLatestPublishedPosts } from "@/lib/writings";

export function HomeWritings() {
  const posts = getLatestPublishedPosts(3);

  return (
    <section
      aria-labelledby="home-writings-heading"
      className="section-home"
    >
      <h2
        id="home-writings-heading"
        className="text-[1.125rem] font-semibold tracking-tight text-foreground"
      >
        {HOME_SECTION_COPY.writings}
      </h2>
      <ul className="mt-6 space-y-5" aria-labelledby="home-writings-heading">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writings/${post.slug}`}
              className="link-editorial text-[15px] font-medium"
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
