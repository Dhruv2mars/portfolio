import Link from "next/link";
import { ContactLinks } from "@/components/contact-links";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          {site.name}
        </Link>

        <SiteNav />

        <ContactLinks className="site-contact site-contact--header" />
      </div>
    </header>
  );
}
