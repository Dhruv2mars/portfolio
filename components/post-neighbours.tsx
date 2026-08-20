import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import type { PostNeighbour } from "@/components/post-actions";
import { cn } from "@/lib/utils";

/**
 * The two posts either side, at the end of the one you just read — where the
 * question "what else is there" actually gets asked. The toolbar arrows make
 * the same jump, but they are icons: this is the place the titles get said.
 *
 * An end of the archive draws an empty half rather than a wide tile, so the
 * older post stays on the side the arrow points at whether or not it has a
 * neighbour to share the row with.
 */
export function PostNeighbours({
  newer,
  older,
}: {
  newer: PostNeighbour;
  older: PostNeighbour;
}) {
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="More posts"
      className="screen-line-bottom grid divide-y divide-line border-x border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0"
    >
      {newer ? <Tile post={newer} direction="newer" /> : <span />}
      {older ? <Tile post={older} direction="older" /> : null}
    </nav>
  );
}

function Tile({
  post,
  direction,
}: {
  post: NonNullable<PostNeighbour>;
  direction: "newer" | "older";
}) {
  const newer = direction === "newer";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "flex flex-col gap-1 p-4 transition-colors hover:bg-accent/50",
        !newer && "sm:items-end sm:text-right",
      )}
    >
      <span className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {newer ? <ArrowLeft className="size-3.5" /> : null}
        {newer ? "Newer" : "Older"}
        {newer ? null : <ArrowRight className="size-3.5" />}
      </span>
      <span className="font-medium text-balance text-foreground">
        {post.title}
      </span>
    </Link>
  );
}
