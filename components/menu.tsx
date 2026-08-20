"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A menu, hand-rolled because the site has no dropdown anywhere else and a
 * headless menu library weighs more than the two lists that use it.
 *
 * What it owes the Visitor is the WAI-ARIA menu button contract and nothing
 * more: the trigger says it is expanded, the arrows walk the items, Home and
 * End jump the ends, Escape closes and hands focus back to the button that
 * opened it, and a click anywhere else dismisses it. Items are found in the
 * DOM rather than registered through context, which keeps a `MenuItem` an
 * ordinary button and a `MenuLink` an ordinary anchor.
 */
export function Menu({
  label,
  trigger,
  className,
  children,
}: {
  /** What the trigger is called, for anyone who cannot see its icon. */
  label: string;
  trigger: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const items = () =>
    Array.from(
      root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    // Capture, so a menu that opens over another control closes before that
    // control decides it was clicked.
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  const move = (from: HTMLElement | null, delta: number) => {
    const list = items();
    if (list.length === 0) return;
    const index = from ? list.indexOf(from) : -1;
    const next = (index + delta + list.length) % list.length;
    list[next]?.focus();
  };

  return (
    <div
      ref={root}
      className={cn("relative", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          close(true);
          return;
        }
        if (!open) return;
        const target = event.target as HTMLElement;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(target.closest('[role="menuitem"]'), 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          move(target.closest('[role="menuitem"]'), -1);
        } else if (event.key === "Home") {
          event.preventDefault();
          items()[0]?.focus();
        } else if (event.key === "End") {
          event.preventDefault();
          items().at(-1)?.focus();
        } else if (event.key === "Tab") {
          // Tab means the Visitor is done here; the menu should not be a place
          // they have to walk out of item by item.
          setOpen(false);
        }
      }}
      // A menu that stays open after picking something reads as a failed
      // click. Every item closes it, so the handler lives on the container.
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('[role="menuitem"]')) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
            // The panel is not mounted yet; focus lands after this paint.
            requestAnimationFrame(() => items()[0]?.focus());
          }
        }}
        className="action-button"
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={label}
          className="absolute top-full right-0 z-50 mt-1 min-w-48 rounded-lg border border-line bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

const ITEM =
  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground [&_svg]:size-4 [&_svg]:shrink-0";

export function MenuItem({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button role="menuitem" type="button" className={cn(ITEM, className)} {...props} />
  );
}

export function MenuLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      role="menuitem"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(ITEM, className)}
      {...props}
    />
  );
}

/** A hairline between two groups of items that mean different things. */
export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-line" />;
}
