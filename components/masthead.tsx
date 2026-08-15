"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * The avatar slot is a designed absence (DESIGN.md §3): real footprint, real
 * border, real light. The light tracks the pointer across the whole masthead
 * so the empty slot reads as alive rather than broken.
 */
export function Masthead() {
  const slotRef = useRef<HTMLDivElement>(null);

  function moveLight(clientX: number, clientY: number) {
    const slot = slotRef.current;
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    slot.style.setProperty(
      "--lx",
      `${((clientX - rect.left) / rect.width) * 100}%`,
    );
    slot.style.setProperty(
      "--ly",
      `${((clientY - rect.top) / rect.height) * 100}%`,
    );
    slot.style.setProperty("--lit", "1");
  }

  return (
    <section
      className="reveal pt-14 sm:pt-20"
      onPointerMove={(event) => moveLight(event.clientX, event.clientY)}
      onPointerLeave={() => slotRef.current?.style.setProperty("--lit", "0")}
    >
      <div className="flex items-center gap-4" style={{ "--i": 0 } as React.CSSProperties}>
        <div ref={slotRef} className="avatar-slot size-14 shrink-0 sm:size-16">
          {site.avatar ? (
            <Image
              src={site.avatar}
              alt={site.name}
              fill
              sizes="64px"
              priority
              className="z-[3] object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            {site.name}
          </h1>
          <p className="mt-1 font-mono text-xs text-dim">{site.tagline}</p>
        </div>
      </div>

      <p
        className="mt-7 max-w-[52ch] text-base text-muted"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {site.positioning}
      </p>

      <ul
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {site.socials.map((social) => {
          const isMail = social.href.startsWith("mailto:");
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target={isMail ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex h-7 items-center gap-1 rounded-full border border-border px-2.5 font-mono text-2xs text-dim transition-colors duration-150 hover:border-border-strong hover:text-foreground"
              >
                {social.label}
                <ArrowUpRight className="size-3 opacity-60" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
