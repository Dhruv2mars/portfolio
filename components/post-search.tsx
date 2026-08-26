"use client";

import { useMemo } from "react";
import { PanelHeader, PanelTitle, PanelTitleSup } from "@/components/panel";
import { PostItem } from "@/components/post-item";
import { SearchField, SearchStatus } from "@/components/search-field";
import { useMirroredQuery } from "@/components/use-mirrored-query";
import { searchPosts, type PostSummary } from "@/lib/posts";

/**
 * The index, with a filter over it.
 *
 * The list is not virtualised and does not need to be: it is filtering an
 * array that was already sent, in memory, with no request behind it.
 *
 * The `h1` is here for the same reason it is in `ProjectSearch`: the count
 * beside it describes the rows below it, so the thing that filters them is the
 * thing that has to render it.
 */
export function PostSearch({
  posts,
  initialQuery = "",
}: {
  posts: PostSummary[];
  initialQuery?: string;
}) {
  const [query, updateQuery] = useMirroredQuery(initialQuery);
  const shown = useMemo(() => searchPosts(posts, query), [posts, query]);

  return (
    <>
      <PanelHeader>
        <PanelTitle as="h1">
          Blog
          <PanelTitleSup className="tabular-nums">{shown.length}</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <SearchField
        value={query}
        onChange={updateQuery}
        label="Search posts"
        placeholder="Search posts…"
      />
      <SearchStatus count={shown.length} noun="post" />

      {shown.length > 0 ? (
        <ul>
          {shown.map((post) => (
            <PostItem key={post.slug} post={post} headingAs="h2" />
          ))}
        </ul>
      ) : (
        <p className="p-4 font-mono text-sm text-muted-foreground">
          No posts match “{query}”.
        </p>
      )}
    </>
  );
}
