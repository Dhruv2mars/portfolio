"use client";

import { useMemo, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { PostItem } from "@/components/post-item";
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
      <div className="screen-line-bottom p-2">
        <div className="relative flex items-center">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // Escape empties the field before it does anything else — the
              // same key the palette closes with, doing the same job here.
              if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
              }
            }}
            placeholder="Search posts…"
            aria-label="Search posts"
            autoComplete="off"
            spellCheck={false}
            /* 16px on a phone: anything smaller and iOS zooms the page on
               focus, which lands the Visitor somewhere they did not ask to
               be. */
            className="h-9 w-full rounded-lg border border-border bg-transparent pr-9 pl-9 text-base text-foreground placeholder:text-muted-foreground sm:text-sm dark:bg-input/30"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <CloseIcon className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* The result of typing is a list changing shape somewhere below the
          field, which a screen reader has no way to notice. This says it. */}
      <p role="status" className="sr-only">
        {shown.length === 1 ? "1 post" : `${shown.length} posts`}
      </p>

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
