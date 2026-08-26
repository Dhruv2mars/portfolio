"use client";

import { useEffect, useRef } from "react";

import { WORDMARK, WORDMARK_DOTS } from "@/lib/wordmark-dots";

/** How much of the remaining distance a dot closes each frame. */
const EASE = 0.22;
/** Below this, a dot has arrived and the loop is allowed to stop. */
const SETTLED = 0.05;

/**
 * The footer signature, dithered.
 *
 * The mark is not drawn here — it is a run of coordinates baked by
 * `tools/wordmark-studio.html` and checked in at `lib/wordmark-dots.ts`, so the
 * letterforms are tuned with sliders against the drawn original rather than
 * guessed at in code. This file only places those dots and moves them.
 *
 * An invisible circle follows the cursor. A dot inside it is pushed straight
 * out along the line from the cursor, by an amount that falls off as the cube
 * of the distance: full strength under the pointer, almost nothing at the rim,
 * so the field has no visible edge for the eye to catch on. Squares rather than
 * circles, because a dither is made of pixels — and because a few thousand
 * `fillRect` calls a frame cost a third of what the same number of arcs do.
 *
 * It is a signature, not information: `aria-hidden`, and inert under
 * `prefers-reduced-motion`, where it renders once and never listens.
 */
export function SiteWordmark({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const count = WORDMARK_DOTS.length;
    const rest = new Float32Array(count);
    const current = new Float32Array(count);

    let dot = 1;
    let radius = 0;
    let strength = 0;
    let dpr = 1;
    let ink = "";
    let client: { x: number; y: number } | null = null;
    let frameId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      const half = dot / 2;
      for (let i = 0; i < count; i += 2) {
        ctx.fillRect(current[i] - half, current[i + 1] - half, dot, dot);
      }
    };

    /* The dots are stored in the studio's box, so every measurement is one
       uniform scale: fit the box inside the canvas and centre it. On a phone
       the width binds and the mark gets shorter; on a wide screen the height
       binds and it stops growing, which is what keeps it quiet. */
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const scale = Math.min(
        canvas.width / WORDMARK.box.width,
        canvas.height / WORDMARK.box.height,
      );
      const offsetX = (canvas.width - WORDMARK.box.width * scale) / 2;
      const offsetY = (canvas.height - WORDMARK.box.height * scale) / 2;

      for (let i = 0; i < count; i += 2) {
        rest[i] = offsetX + WORDMARK_DOTS[i] * scale;
        rest[i + 1] = offsetY + WORDMARK_DOTS[i + 1] * scale;
      }
      current.set(rest);

      dot = Math.max(1, WORDMARK.dot * scale);
      radius = WORDMARK.repelRadius * scale;
      strength = WORDMARK.repelStrength * scale;
      ink = getComputedStyle(canvas).color;
      draw();
    };

    const step = () => {
      const rect = canvas.getBoundingClientRect();
      const pointer = client
        ? { x: (client.x - rect.left) * dpr, y: (client.y - rect.top) * dpr }
        : null;
      let moving = false;

      for (let i = 0; i < count; i += 2) {
        let targetX = rest[i];
        let targetY = rest[i + 1];

        if (pointer) {
          const dx = targetX - pointer.x;
          const dy = targetY - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius) {
            const falloff = 1 - distance / radius;
            const push = strength * falloff * falloff * falloff;
            // Directly under the cursor there is no outward direction to take,
            // so send it up rather than divide by nothing.
            if (distance > 0.001) {
              targetX += (dx / distance) * push;
              targetY += (dy / distance) * push;
            } else {
              targetY -= push;
            }
          }
        }

        current[i] += (targetX - current[i]) * EASE;
        current[i + 1] += (targetY - current[i + 1]) * EASE;

        if (
          !moving &&
          (Math.abs(current[i] - targetX) > SETTLED ||
            Math.abs(current[i + 1] - targetY) > SETTLED)
        ) {
          moving = true;
        }
      }

      draw();
      // A still cursor lets every dot arrive, and the loop ends. The next
      // pointer event restarts it, so an idle footer costs nothing.
      frameId = moving ? requestAnimationFrame(step) : 0;
    };

    const kick = () => {
      if (!frameId) frameId = requestAnimationFrame(step);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(canvas);

    // The theme swaps a class on the root, and `ink` was resolved from it.
    const theme = new MutationObserver(() => {
      ink = getComputedStyle(canvas).color;
      draw();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPointerMove = (event: PointerEvent) => {
      if (still.matches) return;
      client = { x: event.clientX, y: event.clientY };
      kick();
    };
    const onPointerOut = () => {
      client = null;
      kick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerOut);
    window.addEventListener("blur", onPointerOut);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      theme.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerOut);
      window.removeEventListener("blur", onPointerOut);
    };
  }, []);

  return (
    <div
      className={`screen-line-bottom after:z-1 after:bg-foreground/15 ${className ?? ""}`}
    >
      <div className="flex w-full items-center justify-center px-4 py-4 md:px-6 md:py-5">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-wordmark={WORDMARK.text}
          className="block h-10 w-full max-w-[1410px] text-foreground/45 sm:h-12 md:h-14"
        />
      </div>
    </div>
  );
}
