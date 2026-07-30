import Link from "next/link";
import { HOME_SECTION_COPY } from "@/lib/home";
import { formatPostDate, getLatestPublishedPosts } from "@/lib/blog";

export function HomeBlog() {
  const posts = getLatestPublishedPosts(3);

  return (
    <section aria-labelledby="home-blog-heading" className="section-home">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="home-blog-heading" className="section-title">
            {HOME_SECTION_COPY.blog}
          </h2>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Recent thinking
          </p>
        </div>
        <Link
          href="/blog"
          className="link-editorial-muted text-[13px] font-medium"
        >
          View all
        </Link>
      </div>
      <ul
        className="mt-5 divide-y divide-border"
        aria-labelledby="home-blog-heading"
      >
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="row-interactive block no-underline"
            >
              <span className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
                {post.title}
              </span>
              <p className="meta-copy mt-1.5">
                {formatPostDate(post.publishedAt)}
              </p>
              <p className="mt-1.5 max-w-[38rem] text-[13px] leading-5 text-muted text-pretty">
                {post.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
