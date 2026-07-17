import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="container-editorial flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} / {year}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="text-muted no-underline hover:text-foreground hover:underline"
            >
              {social.label}
            </a>
          ))}
          <Link
            href={site.rssPath}
            className="text-muted no-underline hover:text-foreground hover:underline"
          >
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
