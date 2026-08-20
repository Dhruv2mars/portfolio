"use client";

import { CloseIcon, SearchIcon } from "@/components/icons";

/**
 * The filter above a list. One field, used by the blog index and the projects
 * index, so the two pages type the same way — the second search box a Visitor
 * meets should teach them nothing new.
 *
 * It owns no state: the list it filters does, because the list is the thing
 * that has to re-render. See `PostSearch` and `ProjectSearch`.
 */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="screen-line-bottom p-2">
      <div className="relative flex items-center">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            // Escape empties the field before it does anything else — the same
            // key the palette closes with, doing the same job here.
            if (event.key === "Escape" && value) {
              event.preventDefault();
              onChange("");
            }
          }}
          placeholder={placeholder}
          aria-label={label}
          autoComplete="off"
          spellCheck={false}
          /* 16px on a phone: anything smaller and iOS zooms the page on focus,
             which lands the Visitor somewhere they did not ask to be. */
          className="h-9 w-full rounded-lg border border-border bg-transparent pr-9 pl-9 text-base text-foreground placeholder:text-muted-foreground sm:text-sm dark:bg-input/30"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-1.5 flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * What a filter did, for someone who cannot see the list change shape. The
 * count is the whole message: a screen reader announcing every matching title
 * on every keystroke is worse than silence.
 */
export function SearchStatus({
  count,
  noun,
}: {
  count: number;
  noun: string;
}) {
  return (
    <p role="status" className="sr-only">
      {count === 1 ? `1 ${noun}` : `${count} ${noun}s`}
    </p>
  );
}
