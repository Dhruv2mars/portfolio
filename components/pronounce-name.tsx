"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VolumeIcon } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * Say the name.
 *
 * A recording is the correct answer and the slot is here for one:
 * `site.pronunciation.audio` takes precedence the moment it is set. Until a
 * recording exists the button synthesises from a respelling — "Droov Sharma"
 * rather than "Dhruv Sharma", because an English voice reads the true spelling
 * as three syllables. That is a substitute, not a fake: the phonetic reading is
 * printed in the button's own title, so the Visitor always has the real answer
 * even if the voice on their machine mangles it.
 *
 * If the machine can neither play nor speak, no button is drawn. A control that
 * does nothing is worse than an absent one.
 */
export function PronounceName() {
  const [available, setAvailable] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAvailable(
      Boolean(site.pronunciation.audio) || "speechSynthesis" in window,
    );
    return () => {
      audioRef.current?.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const play = useCallback(() => {
    if (speaking) return;

    if (site.pronunciation.audio) {
      const audio = (audioRef.current ??= new Audio(site.pronunciation.audio));
      audio.currentTime = 0;
      setSpeaking(true);
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      void audio.play().catch(() => setSpeaking(false));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      site.pronunciation.respelling,
    );
    utterance.lang = "en-US";
    // Slower than speech, because the point is the shape of the word.
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    // Chrome keeps a spoken queue across pages; clear it or a second press
    // stacks instead of replaying.
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [speaking]);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={play}
      data-slot="pronounce"
      data-speaking={speaking || undefined}
      title={`${site.name} ${site.pronunciation.phonetic}`}
      aria-label={`Hear how ${site.name} is pronounced`}
      className="flex size-6 shrink-0 touch-manipulation items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.98] dark:hover:bg-accent/50"
    >
      <VolumeIcon className="size-4" />
    </button>
  );
}
