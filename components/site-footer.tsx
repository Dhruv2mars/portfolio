import Link from "next/link";
import { Rss } from "@/components/icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="container-site mt-auto">
      <div className="flex flex-col gap-3 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta-copy">
          <span className="text-muted">© {year}</span>
          <span className="mx-2 text-border-strong" aria-hidden>
            ·
          </span>
          <span>{site.name}</span>
        </p>
        <div className="flex items-center gap-4 text-[13px]">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="link-muted min-h-8"
            >
              {social.label}
            </a>
          ))}
          <Link
            href={site.rssPath}
            aria-label="RSS feed"
            className="link-muted min-h-8 gap-1.5"
          >
            <Rss size={13} weight="bold" aria-hidden />
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
