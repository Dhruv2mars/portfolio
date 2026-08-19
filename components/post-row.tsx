import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { IconTile } from "@/components/icon-tile";
import { Tag } from "@/components/tag";
import { formatPostDate, type PostRecord } from "@/lib/blog";

/**
 * One Post in a list. The whole row is the target and the whole row is the
 * hover surface: a title that lights on its own while the rest of the row
 * stays cold reads as two controls where there is only one.
 */
export function PostRow({
  post,
  headingAs = "h2",
}: {
  post: PostRecord;
  headingAs?: "h2" | "h3";
}) {
  const Heading = headingAs;

  return (
    <li className="group/post relative flex items-center border-b border-line transition-[background-color] duration-150 ease-out last:border-b-0 hover:bg-accent-muted">
      <IconTile className="mx-4">
        <ArrowUpRight />
      </IconTile>

      <div className="min-w-0 flex-1 border-l border-dashed border-line">
        <div className="p-4">
          <Heading className="mb-1 leading-snug font-medium text-balance">
            <Link href={`/blog/${post.slug}`}>
              {/* The link is the row. Stretching it here rather than wrapping
                  the row keeps the heading the accessible name of the link. */}
              <span aria-hidden className="absolute inset-0" />
              {post.title}
            </Link>
          </Heading>

          <p className="typeset typeset-description text-muted-foreground">
            {post.summary}
          </p>

          <ul className="mt-2 flex flex-wrap gap-1.5">
            <li className="flex">
              <Tag className="tabular-nums">
                <time dateTime={post.publishedAt}>
                  {formatPostDate(post.publishedAt)}
                </time>
              </Tag>
            </li>
            <li className="flex">
              <Tag className="tabular-nums">
                {post.readingTimeMinutes} min read
              </Tag>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
