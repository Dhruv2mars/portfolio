"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="site-nav" aria-label="Primary">
      {primaryNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "site-nav__link is-active" : "site-nav__link"}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
