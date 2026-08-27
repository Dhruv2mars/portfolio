"use client";

import { useEffect, useRef } from "react";

import { WORDMARK, WORDMARK_DOTS } from "@/lib/wordmark-dots";

/** How much of the remaining distance a dot closes each frame. */
const EASE = 0.22;
/** The signature's weight against the page, applied per dot rather than in CSS. */
const INK = 0.45;
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
 * It runs the full width of the viewport while everything above it is held to
 * a three-quarter-column, and the bottom sixth of the lettering is below the
 * last pixel of the page. Both are deliberate: the mark is the only thing on
 * the site that ignores the frame, and a name that runs off the edge reads as
 * a signature rather than as one more row of content. The canvas is sized by
 * aspect ratio, so the crop is the same fraction at every viewport instead of
 * drifting with the height.
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

    let side = 1;
    let alpha = INK;
    let radius = 0;
    let strength = 0;
    let dpr = 1;
    let ink = "";
    let client: { x: number; y: number } | null = null;
    let frameId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.globalAlpha = alpha;
      const half = side / 2;
      for (let i = 0; i < count; i += 2) {
        ctx.fillRect(
          Math.round(current[i] - half),
          Math.round(current[i + 1] - half),
          side,
          side,
        );
      }
    };

    /* The dots are stored in the studio's box, so every measurement is one
       uniform scale. The canvas is only tall enough for the kept fraction of
       that box, and the lettering is pinned to its top — so the last sixth
       lands past the bottom edge and is never drawn. */
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const scale = Math.min(
        canvas.width / WORDMARK.box.width,
        canvas.height / (WORDMARK.box.height * WORDMARK.visible),
      );
      const offsetX = (canvas.width - WORDMARK.box.width * scale) / 2;
      const offsetY = 0;

      for (let i = 0; i < count; i += 2) {
        rest[i] = offsetX + WORDMARK_DOTS[i] * scale;
        rest[i + 1] = offsetY + WORDMARK_DOTS[i + 1] * scale;
      }
      current.set(rest);

      /* Whole device pixels, always. A fractional `fillRect` is antialiased
         across two columns and the mark turns to smear — on a phone, where a
         dot is barely one pixel wide, that smear is the whole signature.
         Rounding the side loses ink, so the alpha is raised by the area it
         cost and the mark keeps its weight at every size. */
      const exact = Math.max(1, WORDMARK.dot * scale);
      side = Math.max(1, Math.round(exact));
      alpha = Math.min(1, (INK * (exact * exact)) / (side * side));
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
    /* Out past the frame's two-pixel gutter, so the mark touches the glass.
       The deep top pad below `sm` is the dock's landing: it floats there now
       that there is no fade under it, and this is the only band on the page
       where it covers nothing. */
    <div className={`-mx-2 pt-20 sm:pt-8 ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-wordmark={WORDMARK.text}
        className="block w-full text-foreground"
        style={{
          aspectRatio: `${WORDMARK.box.width} / ${WORDMARK.box.height * WORDMARK.visible}`,
        }}
      />
    </div>
  );
}
