"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowUpRight, SearchIcon } from "@/components/icons";
import { nextTheme, type ColorScheme } from "@/lib/theme";

export type CommandItem = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href?: string;
  external?: boolean;
  /** Present for behaviour-only entries such as the theme switch. */
  action?: "toggle-theme";
};

function matches(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const haystack = `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase();
  const needle = query.toLowerCase().trim();
  // Subsequence match, so "ofx" still finds "offdex".
  let i = 0;
  for (const char of haystack) {
    if (char === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return haystack.includes(needle);
}

export function CommandPalette({ items }: { items: readonly CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const listId = useId();

  const results = useMemo(
    () => items.filter((item) => matches(item, query)),
    [items, query],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const run = useCallback(
    (item: CommandItem | undefined) => {
      if (!item) return;
      close();
      if (item.action === "toggle-theme") {
        const current: ColorScheme = resolvedTheme === "light" ? "light" : "dark";
        setTheme(nextTheme(current));
        return;
      }
      if (!item.href) return;
      if (item.href.startsWith("mailto:")) {
        window.location.href = item.href;
      } else if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [close, resolvedTheme, router, setTheme],
  );

  // Global shortcut.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((wasOpen) => {
          if (!wasOpen) restoreTo.current = document.activeElement as HTMLElement;
          return !wasOpen;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock the page behind the dialog, focus the input, and hand focus back to
  // whatever opened it on the way out.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) {
    return <PaletteTrigger onOpen={(from) => {
      restoreTo.current = from;
      setOpen(true);
    }} />;
  }

  const grouped = results.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});
  let flatIndex = -1;

  return (
    <>
      <PaletteTrigger onOpen={(from) => {
        restoreTo.current = from;
        setOpen(true);
      }} />
      <div
        className="palette-backdrop fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="palette-panel w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((i) => (results.length ? (i + 1) % results.length : 0));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((i) =>
                results.length ? (i - 1 + results.length) % results.length : 0,
              );
            } else if (event.key === "Enter") {
              event.preventDefault();
              run(results[active]);
            } else if (event.key === "Tab") {
              // Two focusables only; keep focus inside without a trap library.
              event.preventDefault();
            }
          }}
        >
          <div className="flex items-center gap-2.5 border-b border-line px-3.5">
            <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              placeholder="Jump to…"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                results[active] ? `${listId}-${results[active].id}` : undefined
              }
              className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded-sm border border-line bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
              esc
            </kbd>
          </div>

          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Results"
            className="max-h-[52vh] overflow-y-auto p-1.5"
          >
            {results.length === 0 ? (
              <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">
                Nothing matches “{query}”.
              </p>
            ) : (
              Object.entries(grouped).map(([group, groupItems]) => (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-2.5 pt-2 pb-1 font-mono text-[0.625rem] tracking-wider text-muted-foreground uppercase">
                    {group}
                  </p>
                  {groupItems.map((item) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    const isActive = index === active;
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        role="option"
                        aria-selected={isActive}
                        data-active={isActive}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(item)}
                        /* The active descendant carries the site ring here
                           exactly as it does in the activity grid, so "where
                           am I" looks the same in both widgets. */
                        className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                          isActive
                            ? "bg-accent text-accent-foreground outline-2 -outline-offset-2 outline-ring"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.hint ? (
                          <span className="truncate font-mono text-[0.625rem] text-muted-foreground">
                            {item.hint}
                          </span>
                        ) : null}
                        {item.external ? (
                          <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PaletteTrigger({
  onOpen,
}: {
  onOpen: (from: HTMLElement | null) => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      title="Search (⌘K)"
      data-slot="command-menu-trigger"
      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <SearchIcon className="size-4.5" />
    </button>
  );
}
