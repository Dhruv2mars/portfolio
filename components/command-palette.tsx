"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowUpRight, SearchIcon } from "@/components/icons";
import { SiteMark } from "@/components/site-mark";
import { nextTheme, type ColorScheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  const haystack =
    `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase();
  const needle = query.toLowerCase().trim();
  // Subsequence match, so "ofx" still finds "offdex".
  let i = 0;
  for (const char of haystack) {
    if (char === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return haystack.includes(needle);
}

type PaletteOpener = (from: HTMLElement | null) => void;

const PaletteContext = createContext<PaletteOpener | null>(null);

/**
 * The palette is one dialog behind two doors, and the doors are not siblings:
 * one sits in the header, the other in the dock at the foot of the page. The
 * open state has to live above both, so it lives here and each trigger reaches
 * it through context — which also lets the dock be mounted where it reads,
 * after the content, instead of being smuggled into the header for the sake of
 * sharing a `useState`.
 */
export function CommandPaletteProvider({
  items,
  children,
}: {
  items: readonly CommandItem[];
  children: React.ReactNode;
}) {
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

  const openFrom = useCallback((from: HTMLElement | null) => {
    restoreTo.current = from;
    setOpen(true);
  }, []);

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
        const current: ColorScheme =
          resolvedTheme === "light" ? "light" : "dark";
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
          if (!wasOpen)
            restoreTo.current = document.activeElement as HTMLElement;
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
    return (
      <PaletteContext.Provider value={openFrom}>
        {children}
      </PaletteContext.Provider>
    );
  }

  const grouped = results.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});
  let flatIndex = -1;

  return (
    <PaletteContext.Provider value={openFrom}>
      {children}
      <div
        className="palette-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-start max-sm:pt-16"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="palette-panel flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-popover px-1 shadow-lg ring-1 ring-foreground/10 dark:ring-foreground/20"
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
          {/* Three fixed bands — 48 of search, 320 of results, 40 of legend.
              The height never moves, so a query that matches nothing does not
              collapse the dialog out from under the cursor. */}
          <div className="flex h-12 shrink-0 items-center gap-2 px-3">
            <SearchIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
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
              /* 16px on a phone, 14px from sm up — the reference's own split.
                 Anything under 16px makes iOS Safari zoom the page the moment
                 the field takes focus, which throws the dialog off centre. */
              className="h-10 w-full rounded-lg bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            />
          </div>

          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Results"
            className="h-80 shrink-0 overflow-y-auto"
          >
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nothing matches “{query}”.
              </p>
            ) : (
              Object.entries(grouped).map(([group, groupItems]) => (
                <div key={group} className="mt-2 mb-1 px-1 last:mb-2">
                  <p className="p-2 text-xs font-medium text-muted-foreground">
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
                        /* The active descendant is marked by its fill alone,
                           as the reference marks it. Real focus never leaves
                           the input, so a ring drawn down here would be a
                           second focus indicator claiming a place the caret
                           is not. */
                        className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm ${
                          isActive
                            ? "bg-accent text-accent-foreground"
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

          {/* The legend. It names what Enter will actually do to the row under
              the cursor — open a page, leave for another site, or throw a
              switch — rather than promising one of the three. */}
          <div className="flex h-10 shrink-0 items-center justify-between gap-2 px-3 text-xs font-medium">
            <SiteMark aria-hidden className="size-6 text-muted-foreground" />
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="max-sm:hidden">
                {enterLabel(results[active])}
              </span>
              <Key>↵</Key>
            </span>
          </div>
        </div>
      </div>
    </PaletteContext.Provider>
  );
}

/** What Enter does to the highlighted row, in the site's own words. */
function enterLabel(item: CommandItem | undefined): string {
  if (!item) return "Nothing to open";
  if (item.action) return "Run";
  if (item.href?.startsWith("mailto:")) return "Write";
  return item.external ? "Open link" : "Go to page";
}

/**
 * One key cap. The recipe is the palette's own `esc` chip at header scale:
 * a hairline inset shadow rather than a border, so the cap reads as pressed
 * into the bar instead of stuck onto it.
 */
function Key({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-black/5 px-1 font-sans text-sm/none font-normal tracking-tight text-muted-foreground shadow-[inset_0_0_1px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/20",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * The same door, drawn twice. In the header it names its shortcut, because a
 * viewport with room for a nav bar has a keyboard behind it; in the dock it
 * names itself, because a thumb has no ⌘K. Never both at once.
 *
 * The modifier is chosen in CSS off an `os-macos` class the layout sets before
 * first paint — a state read during render would have to lie on the server
 * first and correct itself after hydration.
 */
export function PaletteTrigger({ dock }: { dock?: boolean }) {
  const openPalette = useContext(PaletteContext);
  return (
    <button
      type="button"
      onClick={(event) => openPalette?.(event.currentTarget)}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      data-slot="command-menu-trigger"
      className={cn(
        "flex h-8 shrink-0 touch-manipulation items-center rounded-lg text-sm font-medium text-muted-foreground transition-all active:scale-[0.98]",
        dock
          ? "min-w-20 gap-2"
          : "gap-1.5 px-1.5 hover:bg-accent hover:text-foreground dark:hover:bg-accent/50",
      )}
    >
      <SearchIcon aria-hidden className="size-4 shrink-0" />
      <span className="sm:hidden">Search…</span>
      <span aria-hidden className="hidden items-center gap-0.75 sm:flex">
        <Key className="[.os-macos_&]:hidden">Ctrl</Key>
        <Key className="hidden [.os-macos_&]:inline-flex">⌘</Key>
        <Key>K</Key>
      </span>
    </button>
  );
}
