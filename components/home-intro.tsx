"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  XLogo,
} from "@/components/icons";
import { site } from "@/lib/site";

const SOCIAL_ICONS = {
  X: XLogo,
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  Email: EnvelopeSimple,
} as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HomeIntro() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="home-intro-heading"
      className="pt-16 pb-16 sm:pt-24 sm:pb-20"
      variants={container}
      initial={reduce ? false : "hidden"}
      animate="show"
    >
      <motion.div variants={item}>
        <Image
          src={site.avatar}
          alt={`Portrait of ${site.name}`}
          width={60}
          height={60}
          priority
          className="size-[60px] rounded-full ring-1 ring-border"
        />
      </motion.div>
      <motion.h1
        variants={item}
        id="home-intro-heading"
        className="display-title mt-6"
      >
        {site.name}
      </motion.h1>
      <motion.p variants={item} className="body-copy mt-5 max-w-[32rem]">
        {site.positioning}
      </motion.p>
      <motion.ul variants={item} className="mt-7 flex items-center gap-2.5">
        {site.socials.map((social) => {
          const Icon = SOCIAL_ICONS[social.label];
          return (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                {...(social.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="icon-chip"
              >
                <Icon size={16} aria-hidden />
              </a>
            </li>
          );
        })}
      </motion.ul>
    </motion.section>
  );
}
