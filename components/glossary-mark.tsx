"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { InfoIcon } from "@/components/icons";

/** Air kept between the panel and the edge of the viewport. */
const GUTTER = 12;

/**
 * The mark that carries a definition, standing where the term is first used.
 *
 * The definition is in the document either way — closed, it is the button's
 * own description, so a screen reader hears it on focus and never has to find
 * a section at the end of the post. Opening it is the sighted equivalent: one
 * panel, dismissed by Escape, by a click outside, or by opening another.
 */
export function GlossaryMark({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const root = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLSpanElement>(null);

  // The panel is centred under a mark that can sit anywhere on the line, so
  // near either rail it would hang off the frame. Measured once it is up,
  // then nudged back inside. The nudge is cleared by the toggle rather than
  // here, so this only ever measures a panel drawn at its true centre.
  useLayoutEffect(() => {
    if (!open) return;
    const box = panel.current?.getBoundingClientRect();
    if (!box) return;
    if (box.left < GUTTER) setShift(GUTTER - box.left);
    else if (box.right > window.innerWidth - GUTTER) {
      setShift(window.innerWidth - GUTTER - box.right);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      root.current?.querySelector("button")?.focus();
    };
    // Capture, so a mark opened over another control closes before that
    // control decides it was clicked.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={root} className="glossary">
      <button
        type="button"
        className="glossary-mark extend-touch-target"
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => {
          setShift(0);
          setOpen((was) => !was);
        }}
      >
        <InfoIcon />
        <span className="sr-only">{`Definition of ${term}`}</span>
      </button>

      <span
        ref={panel}
        id={id}
        role="note"
        className={open ? "glossary-panel" : "sr-only"}
        style={open && shift ? { marginLeft: `${shift}px` } : undefined}
      >
        <span className="glossary-term">{term}</span>
        <span className="glossary-definition">{definition}</span>
      </span>
    </span>
  );
}
