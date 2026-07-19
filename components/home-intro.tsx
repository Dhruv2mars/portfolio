"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

export function HomeIntro() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="home-intro-heading"
      className="pt-14 pb-12 sm:pt-[4.5rem] sm:pb-14"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="meta-copy mb-4">Portfolio</p>
      <h1 id="home-intro-heading" className="display-title">
        {site.name}
      </h1>
      <p className="body-copy mt-5 max-w-[36rem]">{site.positioning}</p>
      <p
        role="status"
        className="mt-5 max-w-[36rem] border-l-2 border-foreground/25 pl-3.5 text-[14px] leading-6 text-muted"
      >
        <span className="font-medium text-foreground">{site.statusNote.lead}</span>{" "}
        {site.statusNote.detail}
      </p>
      <ul className="mt-7 flex flex-wrap items-center gap-x-1 gap-y-2 text-[13px]">
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
              className="link-editorial min-h-8 font-medium"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
