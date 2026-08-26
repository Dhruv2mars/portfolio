"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VolumeIcon } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * Say the name.
 *
 * The button plays a recording, not a synthesiser. A voice reading `/dʱruːʋ/`
 * off an English phoneme set has no breathy-voiced d and no retroflex v to
 * read it with, so it says a different name confidently — which is worse than
 * saying nothing. The true reading stays in the button's own title for anyone
 * who would rather read it than hear it.
 *
 * Playback goes through Web Audio rather than an `<audio>` element: the clip
 * is decoded once into a buffer, so a second press replays from memory on the
 * same frame instead of seeking a stream. What delay there is is deliberate
 * and measured, not whatever the network happened to cost.
 */

/**
 * Seconds between the press and the first sample.
 *
 * Zero is technically correct and reads as a glitch: the name arrives before
 * the press has finished registering as a press, so the two feel unrelated. A
 * beat of air lets the button acknowledge the click first and the voice answer
 * it second. Scheduled on the audio clock rather than a timer, so the beat is
 * the same length every press.
 */
const LEAD_IN = 0.12;

/** Decoded once per document, not once per mount, and shared by every press. */
let decoded: Promise<AudioBuffer> | null = null;
let context: AudioContext | null = null;

function audioContext(): AudioContext {
  return (context ??= new AudioContext());
}

function buffer(url: string): Promise<AudioBuffer> {
  return (decoded ??= fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`pronunciation: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((bytes) => audioContext().decodeAudioData(bytes))
    .catch((error) => {
      // Drop the failed attempt so the next press can try again rather than
      // inheriting one bad network moment for the life of the page.
      decoded = null;
      throw error;
    }));
}

export function PronounceName() {
  const [speaking, setSpeaking] = useState(false);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(
    () => () => {
      sourceRef.current?.stop();
      sourceRef.current = null;
    },
    [],
  );

  const play = useCallback(() => {
    const url = site.pronunciation.audio;
    if (!url) return;

    // Constructed on the press, so nothing is suspended waiting for a gesture
    // that may never come — a visitor who never clicks never opens a context.
    const ctx = audioContext();
    if (ctx.state === "suspended") void ctx.resume();

    setSpeaking(true);

    buffer(url)
      .then((clip) => {
        // A second press restarts the name rather than layering it.
        sourceRef.current?.stop();

        const source = ctx.createBufferSource();
        source.buffer = clip;
        source.connect(ctx.destination);
        source.onended = () => {
          if (sourceRef.current === source) {
            sourceRef.current = null;
            setSpeaking(false);
          }
        };
        // The waves start pulsing on the press while the voice waits out the
        // lead-in. They loop rather than track the audio, so the head start
        // reads as the glyph winding up, not as the sound running late.
        source.start(ctx.currentTime + LEAD_IN);
        sourceRef.current = source;
      })
      .catch(() => setSpeaking(false));
  }, []);

  if (!site.pronunciation.audio) return null;

  return (
    <button
      type="button"
      onClick={play}
      data-slot="pronounce"
      data-speaking={speaking || undefined}
      title={`${site.name} ${site.pronunciation.phonetic}`}
      aria-label={`Hear how ${site.name} is pronounced`}
      className="relative flex size-6 shrink-0 touch-manipulation items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.98] dark:hover:bg-accent/50"
    >
      {/* The tap target a finger needs, without the box a cursor would see. */}
      <span
        className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden
      />
      <VolumeIcon className="size-4.5" />
    </button>
  );
}
