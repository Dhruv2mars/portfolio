import { CopyLink } from "@/components/copy-link";
import { MoreLink } from "@/components/more-link";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { PostItem } from "@/components/post-item";
import { getPublishedPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** How many Posts the home page carries before it defers to `/blog`. */
export const HOME_POST_LIMIT = 6;

/**
 * On the home page this is the latest few with a door at the bottom; on
 * `/blog` it is everything and the door is gone. Same cards either way — the
 * page decides how many, the card decides nothing.
 *
 * Two columns with a rule down the middle, drawn behind the cards rather than
 * on them: a border on the card itself would stop at the shorter of the two,
 * and the rule is a property of the page, not of the Post.
 */
export function BlogSection({
  limit,
  as = "h2",
}: {
  limit?: number;
  as?: "h1" | "h2";
}) {
  const posts = getPublishedPosts();
  const shown = limit ? posts.slice(0, limit) : posts;
  const hidden = posts.length - shown.length;

  return (
    <Panel id="blog">
      <PanelHeader>
        <PanelTitle as={as}>
          Blog
          <PanelTitleSup className="tabular-nums">{posts.length}</PanelTitleSup>
          <CopyLink id="blog" label="Blog" />
        </PanelTitle>
        <PanelDescription>
          Notes on coding agents and the models behind them.
        </PanelDescription>
      </PanelHeader>

      <div className="relative py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2"
        >
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {shown.map((post) => (
            <li
              key={post.slug}
              className={cn(
                "max-sm:screen-line-top max-sm:screen-line-bottom",
                "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom",
              )}
            >
              <PostItem post={post} headingAs={as === "h1" ? "h2" : "h3"} />
            </li>
          ))}
        </ul>
      </div>

      {hidden > 0 ? <MoreLink href="/blog">All posts</MoreLink> : null}
    </Panel>
  );
}
