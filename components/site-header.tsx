"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { PRIMARY_NAV } from "@/lib/nav";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="pointer-events-none sticky top-4 z-30 flex justify-center px-4"
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="header-pill pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
        <Link
          href="/"
          aria-label={`${site.name} — Home`}
          className="group flex min-h-8 items-center gap-2 rounded-full pr-1 pl-1.5 no-underline"
        >
          <Image
            src={site.avatar}
            alt=""
            width={22}
            height={22}
            className="size-[22px] rounded-full ring-1 ring-border transition-transform duration-200 ease-[var(--ease-spring)] group-hover:scale-105"
          />
          <span className="hidden text-[13px] font-medium tracking-[-0.01em] text-foreground transition-opacity duration-150 group-hover:opacity-70 min-[400px]:inline">
            {site.handle}
          </span>
        </Link>

        <div className="mx-1 h-4 w-px bg-border" aria-hidden />

        <nav
          aria-label={FOCUSABLE_CHROME.primaryNavLabel}
          className="flex items-center gap-0.5"
        >
          {PRIMARY_NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                data-active={active}
                className="nav-item"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-1 h-4 w-px bg-border" aria-hidden />
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
