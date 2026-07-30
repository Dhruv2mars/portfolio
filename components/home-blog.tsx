import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { HOME_SECTION_COPY } from "@/lib/home";
import { formatPostDate, getLatestPublishedPosts } from "@/lib/blog";

export function HomeBlog() {
  const posts = getLatestPublishedPosts(3);

  return (
    <section aria-labelledby="home-blog-heading" className="section-home">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="home-blog-heading" className="eyebrow">
              {HOME_SECTION_COPY.blog}
            </h2>
            <p className="mt-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
              Recent thinking
            </p>
          </div>
          <Link href="/blog" className="section-head-link">
            All posts
            <ArrowRight size={11} weight="bold" aria-hidden />
          </Link>
        </div>
        <ul
          className="mt-5 divide-y divide-border/70"
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
                  <span aria-hidden> · </span>
                  {post.readingTimeMinutes} min
                </p>
                <p className="mt-1.5 max-w-[36rem] text-[13px] leading-5 text-muted text-pretty">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
