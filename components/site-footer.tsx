import { Rss } from "@/components/icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 py-8 font-mono text-2xs text-dim sm:flex-row sm:items-center sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>

        {/* min-size-6 keeps every tap target at 24px without visible chrome. */}
        <nav aria-label="Elsewhere" className="-my-1 flex items-center gap-3 sm:ml-auto">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex min-h-6 min-w-6 items-center justify-center transition-colors duration-150 hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
          <a
            href={site.rssPath}
            aria-label="RSS feed"
            className="inline-flex min-h-6 min-w-6 items-center justify-center transition-colors duration-150 hover:text-foreground"
          >
            <Rss className="size-3.5" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
