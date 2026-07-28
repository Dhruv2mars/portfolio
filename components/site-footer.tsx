import Link from "next/link";
import { LocalTime } from "@/components/local-time";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container-wide flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="meta-copy">
          <span className="text-muted">{site.name}</span>
          <span className="mx-2 text-border-strong" aria-hidden>
            ·
          </span>
          <span>{year}</span>
          <span className="mx-2 text-border-strong" aria-hidden>
            ·
          </span>
          <LocalTime />
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px]">
          {site.socials.map((social, index) => (
            <span key={social.label} className="flex items-center">
              {index > 0 ? (
                <span className="mx-2 text-border-strong" aria-hidden>
                  /
                </span>
              ) : null}
              <a
                href={social.href}
                {...(social.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="link-editorial-muted min-h-8"
              >
                {social.label}
              </a>
            </span>
          ))}
          <span className="mx-2 text-border-strong" aria-hidden>
            /
          </span>
          <Link href={site.rssPath} className="link-editorial-muted min-h-8">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
