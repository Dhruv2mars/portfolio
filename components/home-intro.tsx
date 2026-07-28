"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

export function HomeIntro() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="home-intro-heading"
      className="pt-14 sm:pt-20"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 id="home-intro-heading" className="display-title">
        {site.name}
      </h1>
      <p className="body-copy mt-5 max-w-[34rem]">{site.positioning}</p>
      <p
        role="status"
        className="meta-copy mt-6 flex items-center gap-2.5 text-faint"
      >
        <span
          className="status-dot size-[5px] shrink-0 text-foreground/70"
          aria-hidden
        />
        <span>
          <span className="text-muted">{site.statusNote.lead}</span>{" "}
          {site.statusNote.detail}
        </span>
      </p>
      <ul className="mt-7 flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-[12px] leading-4 tracking-[-0.01em]">
        {site.socials.map((social, index) => (
          <li key={social.label} className="flex items-center">
            {index > 0 ? (
              <span className="mx-2.5 text-border-strong" aria-hidden>
                /
              </span>
            ) : null}
            <a
              href={social.href}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex min-h-8 items-center text-muted no-underline underline-offset-[3px] decoration-current/0 transition-[color,text-decoration-color] duration-150 ease-[var(--ease-out-quad)] hover:text-foreground hover:underline hover:decoration-current/40"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
