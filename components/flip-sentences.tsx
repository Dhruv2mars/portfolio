"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The role line, said more than one way.
 *
 * One line is a job title; four in rotation is a description of the work, and
 * the Visitor gets the whole of it without the hero growing a paragraph. Each
 * arrival is swept once by the same gradient the single line used to carry —
 * remounting on the key restarts the animation, so the sweep is a property of
 * *arriving*, not a loop running under the text.
 *
 * It stops when it is not being watched: off screen, or on a tab in the
 * background. Under `prefers-reduced-motion` there is no rotation at all — the
 * first line stands, because a caption that changes itself every three seconds
 * is the exact thing that setting is asking us not to do.
 *
 * And it stops for good once it has been all the way round. A loop that never
 * ends is the one thing §6 forbids outright, and it is also the wrong shape
 * for what this line is doing: the rotation exists to widen the role past a
 * job title, which is a thing you say once. So the sentences run a single
 * pass and the canonical one — `site.tagline`, the line that metadata and
 * structured data carry, where nothing can rotate — is where the hero comes
 * to rest. After that the masthead is a still picture, which is what every
 * screenshot of it should be.
 */

const INTERVAL_MS = 3000;

// The line travels upwards: the arriving sentence rises from below the
// baseline and the leaving one continues up and out. One direction for both
// halves, so the rotation reads as a single column of text moving past a
// window rather than two unrelated fades.
const VARIANTS = {
  initial: { y: "20%", opacity: 0, filter: "blur(1px)" },
  animate: { y: "0%", opacity: 1, filter: "blur(0px)" },
  exit: {
    y: "-40%",
    opacity: 0,
    filter: "blur(1px)",
  },
};

export function FlipSentences({
  sentences,
  className,
}: {
  sentences: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Set once the pass has returned to the first sentence. State rather than a
  // ref because it has to re-run the effect that owns the timer, and it is
  // never unset: a second lap is the perpetual loop this exists to prevent.
  const [settled, setSettled] = useState(false);

  const play = inView && !reduced && !settled && sentences.length > 1;

  useEffect(() => {
    if (!play) return;
    // A background tab throws its timers into a queue and fires them in a
    // burst on return; pausing on `visibilitychange` is what keeps the line
    // from flickering through four states the moment the Visitor comes back.
    let timer = 0;
    const start = () => {
      timer = window.setInterval(() => {
        setIndex((i) => {
          const next = (i + 1) % sentences.length;
          // Back at the top: the pass is done. Flip the flag rather than
          // clearing here, so the effect's own cleanup is what stops the
          // timer and there is exactly one place that owns it.
          if (next === 0) setSettled(true);
          return next;
        });
      }, INTERVAL_MS);
    };
    const stop = () => window.clearInterval(timer);
    const onVisibility = () => {
      stop();
      if (!document.hidden) start();
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [play, sentences.length]);

  const current = sentences[reduced ? 0 : index] ?? sentences[0];

  return (
    <p ref={ref} className={cn("flex items-center overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          className="shimmer inline-block"
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          variants={VARIANTS}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
