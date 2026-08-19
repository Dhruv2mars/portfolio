import { CopyLink } from "@/components/copy-link";
import { MoreLink } from "@/components/more-link";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { PostRow } from "@/components/post-row";
import { getPublishedPosts } from "@/lib/blog";

/** How many Posts the home page carries before it defers to `/blog`. */
export const HOME_POST_LIMIT = 3;

/**
 * On the home page this is the latest few with a door at the bottom; on
 * `/blog` it is everything and the door is gone. Same rows either way — the
 * page decides how many, the row decides nothing.
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
          Notes on building tooling for coding agents.
        </PanelDescription>
      </PanelHeader>

      <ul>
        {shown.map((post) => (
          <PostRow key={post.slug} post={post} headingAs={as === "h1" ? "h2" : "h3"} />
        ))}
      </ul>

      {hidden > 0 ? <MoreLink href="/blog">All posts</MoreLink> : null}
    </Panel>
  );
}
