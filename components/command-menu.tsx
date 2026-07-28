"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  buildCommands,
  filterCommands,
  groupCommands,
  type CommandItem,
} from "@/lib/commands";
import {
  getCommandMenuOpen,
  setCommandMenuOpen,
  subscribeCommandMenu,
  toggleCommandMenu,
} from "@/lib/command-menu-store";

export function useCommandMenuOpen(): boolean {
  return useSyncExternalStore(
    subscribeCommandMenu,
    getCommandMenuOpen,
    () => false,
  );
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

/**
 * Command menu — ⌘K. One honest answer to "where do I go next".
 * Listbox semantics; arrows cycle, Enter runs, Esc closes.
 */
export function CommandMenu() {
  const open = useCommandMenuOpen();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [query, setQuery] = useState("");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => buildCommands({ isDark }), [isDark]);
  const filtered = useMemo(() => filterCommands(items, query), [items, query]);
  const groups = useMemo(() => groupCommands(filtered), [filtered]);

  // Selection is derived — no effect needed when the list shrinks.
  const activeId =
    chosenId && filtered.some((i) => i.id === chosenId)
      ? chosenId
      : (filtered[0]?.id ?? null);

  const close = useCallback(() => {
    setCommandMenuOpen(false);
    setQuery("");
    setStatus(null);
    setChosenId(null);
  }, []);

  // Global ⌘K / Ctrl+K — open/close from anywhere.
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommandMenu();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  // Focus input + lock scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the active option in view while arrowing.
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    listRef.current
      .querySelector(`[data-command-id="${activeId}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const run = useCallback(
    (item: CommandItem) => {
      const action = item.action;
      switch (action.type) {
        case "navigate": {
          close();
          if (action.external) {
            window.open(action.href, "_blank", "noopener,noreferrer");
          } else {
            router.push(action.href);
          }
          return;
        }
        case "copy": {
          void navigator.clipboard
            .writeText(action.text)
            .then(() => {
              setStatus(action.doneLabel);
              window.setTimeout(close, 700);
            })
            .catch(() => {
              setStatus("Copy failed — blocked by browser");
              window.setTimeout(close, 1200);
            });
          return;
        }
        case "theme": {
          setTheme(isDark ? "light" : "dark");
          setStatus(isDark ? "Light theme on" : "Dark theme on");
          window.setTimeout(close, 450);
          return;
        }
      }
    },
    [close, isDark, router, setTheme],
  );

  const onKeydown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (filtered.length === 0) return;
      const index = filtered.findIndex((i) => i.id === activeId);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next =
        filtered[(index + delta + filtered.length) % filtered.length];
      setChosenId(next?.id ?? null);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered.find((i) => i.id === activeId) ?? filtered[0];
      if (item) run(item);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
      className="command-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="command-panel" onKeyDown={onKeydown}>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setChosenId(null);
            }}
            placeholder="Go anywhere…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-faint"
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div
          ref={listRef}
          role="listbox"
          aria-activedescendant={activeId ?? undefined}
          className="max-h-[19rem] overflow-y-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.length === 0 ? (
            <p className="px-3 py-6 text-[13px] text-faint">
              Nothing matches “{query}”.
            </p>
          ) : (
            groups.map(({ group, items: groupItems }) => (
              <div key={group} className="pb-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      id={`command-${item.id}`}
                      aria-selected={active}
                      data-command-id={item.id}
                      onMouseMove={() => {
                        if (!active) setChosenId(item.id);
                      }}
                      onClick={() => run(item)}
                      className={`command-row ${active ? "command-row-active" : ""}`}
                    >
                      <span className="truncate">{item.label}</span>
                      {active ? (
                        <kbd className="kbd shrink-0" aria-hidden>
                          ↵
                        </kbd>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <p className="meta-copy" aria-live="polite">
            {status ?? `${filtered.length} ${filtered.length === 1 ? "command" : "commands"}`}
          </p>
          <p className="meta-copy" aria-hidden>
            ↑↓ navigate
          </p>
        </div>
      </div>
    </div>
  );
}
