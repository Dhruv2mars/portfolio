"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FOCUSABLE_CHROME } from "@/lib/a11y";
import { PRIMARY_NAV } from "@/lib/nav";
import { site } from "@/lib/site";

/**
 * The header pill (DESIGN.md §5).
 *
 *   [ avatar 20px ] [ ▪▪▫▪▪▫▫ ]  home  blog  projects   dark ⁄ light
 *
 * CONTEXT mandates the floating pill; §GRAFT-4 de-genericizes it by making it
 * carry the site's own motif — the 7-day pulse strip is the same data, the same
 * ramp, one grade down from the Home year grid.
 *
 * It is deliberately motionless: no entrance animation, no motion/AnimatePresence.
 * The pill and the two ledger rules are the elements that persist untouched
 * across every route change, and that persistence is itself the craft signal.
 */

/**
 * A transparent 24px-tall hit area, absolutely positioned so it never changes
 * layout or moves the active item's ember underline (DESIGN §4 §FIX-9 uses the
 * same device for heatmap cells). Its parent must be `position: relative`.
 */
function HitArea() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: -2,
        right: -2,
        top: "50%",
        height: 24,
        transform: "translateY(-50%)",
      }}
    />
  );
}

export function SiteHeader({ pulse }: { pulse?: ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 z-30 flex justify-center px-5" style={{ top: 20 }}>
      <div className="header-pill pointer-events-auto max-w-full">
        <Link
          href="/"
          aria-label={`${site.name} — Home`}
          className="relative flex items-center"
        >
          {/* the only image we own, and the only image on the site */}
          <Image
            src={site.avatar}
            alt=""
            width={20}
            height={20}
            className="avatar"
            style={{ width: 20, height: 20, display: "block" }}
            priority
          />
          <HitArea />
        </Link>

        {/* Pulse — 7 cells of real data, a decorative echo of the year grid.
            Dropped below 640px, where §4 collapses the pill to avatar + nav. */}
        {pulse ? (
          <span className="hidden items-center sm:flex" aria-hidden="true">
            {pulse}
          </span>
        ) : null}

        <nav
          aria-label={FOCUSABLE_CHROME.primaryNavLabel}
          className="flex items-center"
          style={{ gap: 20 }}
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
                className="nav-link"
              >
                {item.label.toLowerCase()}
                <HitArea />
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
