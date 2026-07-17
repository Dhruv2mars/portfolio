import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container-editorial flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-foreground">{site.name}</span>
          <span aria-hidden="true"> / </span>
          <span>{year}</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex min-h-9 items-center text-muted no-underline transition-colors duration-200 ease-[var(--ease-editorial)] hover:text-foreground hover:underline"
            >
              {social.label}
            </a>
          ))}
          <Link
            href={site.rssPath}
            className="inline-flex min-h-9 items-center text-muted no-underline transition-colors duration-200 ease-[var(--ease-editorial)] hover:text-foreground hover:underline"
          >
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
