import Image from "next/image";
import Link from "next/link";
import { formatPostDate, type PostRecord } from "@/lib/blog";

/**
 * One Post, as a card rather than a row. Projects are a list of names — a row
 * each is right for them. A Post is a title, a sentence and a date, and three
 * lines of prose in a row the width of the page reads as a paragraph that
 * happens to be clickable.
 *
 * The whole card is the hover surface and the whole card is the target: the
 * link stretches over it with an absolute span, which keeps the heading the
 * link's accessible name instead of wrapping the card in an anchor.
 */
export function PostItem({
  post,
  headingAs = "h2",
}: {
  post: PostRecord;
  headingAs?: "h2" | "h3";
}) {
  const Heading = headingAs;

  return (
    <div className="group/post relative flex h-full flex-col gap-2 p-2 transition-[background-color] duration-150 ease-out hover:bg-accent-muted">
      {post.image ? (
        <div className="relative select-none">
          {/* Grey until the pointer is on it: colour is the reward for
              choosing this one, not a thing six cards shout at once. */}
          <Image
            className="aspect-1200/630 rounded-xl grayscale transition-[filter] duration-300 ease-out group-hover/post:grayscale-0"
            src={post.image}
            alt=""
            width={1200}
            height={630}
            quality={100}
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-1 p-2">
        <Heading className="text-lg leading-snug font-medium text-balance">
          <Link href={`/blog/${post.slug}`}>
            <span aria-hidden className="absolute inset-0" />
            {post.title}
          </Link>
        </Heading>

        <p className="typeset typeset-description flex-1 text-muted-foreground">
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
  );
}
