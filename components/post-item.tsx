import Image from "next/image";
import Link from "next/link";
import { formatPostDate, type PostSummary } from "@/lib/posts";

/**
 * One Post, as a row across the page.
 *
 * The reference draws Posts as cards in two columns, and it is right to: every
 * one of its Posts ships a 1200×630 cover, and a grid of pictures is what a
 * grid is for. Ours ship none, and a card with no picture is a row that has
 * been put in a box — half the width, so the summary breaks after four words,
 * and at one Post it is a card beside a hole.
 *
 * So the picture is optional and the row is not. When a cover exists it leads
 * the row as a 16:9 plate; when it does not, the row is a title, a sentence and
 * two facts, which is the same shape a Project row has. That is the site's
 * idiom — things on rules, full width — and it reads the same at one Post as at
 * fifty.
 */
export function PostItem({
  post,
  headingAs = "h2",
}: {
  post: PostSummary;
  headingAs?: "h2" | "h3";
}) {
  const Heading = headingAs;

  return (
    <li className="border-b border-line last:border-b-0">
      {/* `relative` scopes the stretched link to this row, so the next Post's
          title never falls under this one's target. */}
      <div className="group/post relative flex items-start gap-4 p-4 transition-[background-color] duration-150 ease-out hover:bg-accent-muted">
        {post.image ? (
          <div className="relative w-28 shrink-0 select-none max-sm:hidden">
            {/* Grey until the pointer is on it: colour is the reward for
                choosing this one, not a thing six rows shout at once. */}
            <Image
              className="aspect-1200/630 rounded-lg grayscale transition-[filter] duration-300 ease-out group-hover/post:grayscale-0"
              src={post.image}
              alt=""
              width={1200}
              height={630}
              quality={100}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-lg inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Heading className="leading-snug font-medium text-balance">
            <Link href={`/blog/${post.slug}`}>
              <span aria-hidden className="absolute inset-0" />
              {post.title}
            </Link>
          </Heading>

          <p className="typeset typeset-description text-muted-foreground">
            {post.summary}
          </p>

          {/* Date and length, in the same mono the rest of the site measures
              things in. A `dl` because they are facts about the Post, not two
              more pieces of its prose. */}
          <dl className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground/80 tabular-nums">
            <dt className="sr-only">Published on</dt>
            <dd>
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt)}
              </time>
            </dd>
            <span aria-hidden>·</span>
            <dt className="sr-only">Reading time</dt>
            <dd>{post.readingTimeMinutes} min read</dd>
          </dl>
        </div>
      </div>
    </li>
  );
}
