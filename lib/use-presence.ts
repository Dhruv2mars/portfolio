import { useEffect, useState } from "react";

/**
 * Keeps a node mounted for `ms` after `open` goes false, so an exit animation
 * has something to play on.
 *
 * React removes a node the moment state says to, in the same commit — there is
 * no frame in between for CSS to animate, which is why `@starting-style` and
 * `transition-behavior: allow-discrete` cannot do this job on their own. The
 * only way out is to keep rendering the node a little longer than the state
 * that owns it, and that is all this does.
 *
 * The returned `state` is meant for a `data-state` attribute; the stylesheet
 * picks the entrance or the exit off it rather than off a second class name.
 */
export function usePresence(open: boolean, ms: number) {
  const [exiting, setExiting] = useState(false);
  // `open` as of the last render, kept in state rather than a ref so that
  // noticing it changed is a render-phase adjustment — the one place React
  // sanctions calling a setter outside an event or a callback.
  const [wasOpen, setWasOpen] = useState(open);

  if (wasOpen !== open) {
    setWasOpen(open);
    setExiting(!open);
  }

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => setExiting(false), ms);
    return () => window.clearTimeout(timer);
  }, [exiting, ms]);

  return {
    present: open || exiting,
    state: open ? ("open" as const) : ("closed" as const),
  };
}
