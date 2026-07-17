import Link from "next/link";
import { ContactLinks } from "@/components/contact-links";
import { primaryNav, site } from "@/lib/site";

type SiteHeaderProps = {
  pathname: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ pathname }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          {site.name}
        </Link>

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

        <ContactLinks className="site-contact site-contact--header" />
      </div>
    </header>
  );
}
