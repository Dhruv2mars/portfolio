"use client";

import { useEffect, useState } from "react";
import { CheckIcon, LinkIcon } from "@/components/icons";

/**
 * A deep link to the panel it sits in. Hidden until the title is hovered or
 * the button itself is focused, so it never competes with the heading.
 */
export function CopyLink({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={`Copy link to ${label}`}
      title={copied ? "Copied" : `Copy link to ${label}`}
      onClick={async () => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
        } catch {
          // A denied clipboard permission is not worth an error state; the
          // hash is still in the address bar for anyone who wants it.
          window.location.hash = id;
        }
      }}
      className="ml-1.5 inline-flex size-7 -translate-y-1 items-center justify-center rounded-md align-middle text-muted-foreground opacity-0 transition-[color,background-color,opacity] hover:bg-accent hover:text-accent-foreground focus-visible:opacity-100 group-hover/panel-title:opacity-100"
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <LinkIcon className="size-4" />
      )}
    </button>
  );
}
