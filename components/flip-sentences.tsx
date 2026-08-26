"use client";

import { cn } from "@/lib/utils";

/**
 * The role line, said more than one way.
 *
 * The role line is a caption, not a ticker. Keep the first authored sentence
 * stable so the identity block stays quiet and readable. It still receives a
 * single arrival sweep, which gives the line a little life without creating a
 * timer or a recurring motion source.
 */

export function FlipSentences({
  sentences,
  className,
}: {
  sentences: readonly string[];
  className?: string;
}) {
  const current = sentences[0] ?? "";

  return (
    <p className={cn("flex items-center overflow-hidden", className)}>
      <span className="shimmer inline-block">{current}</span>
    </p>
  );
}
