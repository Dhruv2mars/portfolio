import Link from "next/link";
import { HOME_SECTION_COPY } from "@/lib/home";
import { formatPostDate, getLatestPublishedPosts } from "@/lib/writings";

export function HomeWritings() {
  const posts = getLatestPublishedPosts(3);

  return (
    <section
      aria-labelledby="home-writings-heading"
      className="section-home reveal reveal-delay-3"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="home-writings-heading" className="section-title">
            {HOME_SECTION_COPY.writings}
          </h2>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-foreground">
            Recent thinking
          </p>
        </div>
        <Link
          href="/writings"
          className="link-editorial-muted text-[13px] font-medium"
        >
          View all
        </Link>
      </div>
      <ul className="cv-list mt-5" aria-labelledby="home-writings-heading">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/writings/${post.slug}`} className="cv-row">
              <span className="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline">
                <span className="cv-row-name">{post.title}</span>
                <span className="cv-row-desc">{post.summary}</span>
              </span>
              <span className="cv-row-meta">
                <span>{formatPostDate(post.publishedAt)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
