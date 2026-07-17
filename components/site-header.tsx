import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          {site.name}
        </Link>

        <SiteNav />

        <div className="site-header__tools">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
