"use client";

import { useEffect, useState } from "react";

/**
 * A filter query that lives in the component and mirrors itself into `?q=`.
 *
 * Both indexes need the same three things and used to agree on only the first
 * of them: filter on every keystroke without a server round trip, leave a URL
 * that can be copied or refreshed, and follow the back button when the reader
 * uses it. `replaceState` rather than a route push, so filtering does not fill
 * the history with one entry per character, and `popstate` rather than
 * `useSearchParams`, because the URL is being written here without telling the
 * router and the router would answer with a stale value.
 *
 * `/projects` and `/blog` are the same page twice (DESIGN.md §2). This is the
 * part of that claim which is behaviour rather than layout.
 */
export function useMirroredQuery(
  initialQuery = "",
): [string, (value: string) => void] {
  const [query, setQuery] = useState(initialQuery);

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
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  };

  return [query, updateQuery];
}
