"use client";

import { useEffect, useMemo, useState } from "react";
import { PostItem } from "@/components/post-item";
import { SearchField, SearchStatus } from "@/components/search-field";
import { searchPosts, type PostSummary } from "@/lib/posts";

/**
 * The index, with a filter over it.
 *
 * The query lives in the component for instant filtering and mirrors the URL
 * without a route transition, so a filtered index can be shared or refreshed
 * without turning every keystroke into a server navigation.
 *
 * The list is not virtualised and does not need to be: it is filtering an
 * array that was already sent, in memory, with no request behind it.
 */
export function PostSearch({
  posts,
  initialQuery = "",
}: {
  posts: PostSummary[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const shown = useMemo(() => searchPosts(posts, query), [posts, query]);

  useEffect(() => {
    const onPopState = () => {
      setQuery(new URL(window.location.href).searchParams.get("q") ?? "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const updateQuery = (value: string) => {
    setQuery(value);
    const url = new URL(window.location.href);
    const normalized = value.trim();
    if (normalized) url.searchParams.set("q", normalized);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <>
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
