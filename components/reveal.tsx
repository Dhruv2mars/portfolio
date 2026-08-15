"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A revealed block. Its 1px rule draws itself left→right; its text follows 80ms
 * later. Pure CSS animation — this component only flips `data-revealed`.
 *
 * The old implementation left sections permanently blank when they were already
 * in view on mount, so the first paint check is deliberate and non-negotiable.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** ms, capped at 6 stagger steps upstream */
  delay?: number;
  as?: "div" | "section" | "header" | "footer";
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    // already in view at mount → reveal immediately, do not wait for a scroll
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      data-reveal=""
      data-revealed={revealed || undefined}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
