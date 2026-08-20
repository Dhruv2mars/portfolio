"use client";

import { useMemo, useState } from "react";
import { PostItem } from "@/components/post-item";
import { SearchField, SearchStatus } from "@/components/search-field";
import { searchPosts, type PostSummary } from "@/lib/posts";

/**
 * The index, with a filter over it.
 *
 * The reference keeps its query in the URL, which buys a shareable search and
 * costs a query-state dependency, a Suspense boundary and a router write on
 * every keystroke. A filter over a list this size is a glance, not a
 * destination — nobody sends a friend a link to a filtered blog index — so the
 * query lives in the component and the URL stays the address of the page.
 *
 * The list is not virtualised and does not need to be: it is filtering an
 * array that was already sent, in memory, with no request behind it.
 */
export function PostSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => searchPosts(posts, query), [posts, query]);

  return (
    <>
      <SearchField
        value={query}
        onChange={setQuery}
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
