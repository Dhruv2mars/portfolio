import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
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
          <span>{site.city}</span>
          <span className="mx-2 text-border-strong" aria-hidden>
            ·
          </span>
          <LocalTime />
        </p>
        <nav
          aria-label="Social links"
          className="flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-[12px] leading-4 tracking-[-0.01em]"
        >
          {site.socials.map((social, index) => (
            <span key={social.label} className="flex items-center">
              {index > 0 ? (
                <span className="mx-2.5 text-border-strong" aria-hidden>
                  /
                </span>
              ) : null}
              {social.label === "Email" ? (
                <CopyEmail
                  mail={social.href}
                  className="inline-flex min-h-8 items-center text-muted no-underline underline-offset-[3px] decoration-current/0 transition-[color,text-decoration-color] duration-150 ease-[var(--ease-out-quad)] hover:text-foreground hover:underline hover:decoration-current/40"
                />
              ) : (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center text-muted no-underline underline-offset-[3px] decoration-current/0 transition-[color,text-decoration-color] duration-150 ease-[var(--ease-out-quad)] hover:text-foreground hover:underline hover:decoration-current/40"
                >
                  {social.label}
                </a>
              )}
            </span>
          ))}
          <span className="mx-2.5 text-border-strong" aria-hidden>
            /
          </span>
          <Link
            href={site.rssPath}
            className="inline-flex min-h-8 items-center text-muted no-underline underline-offset-[3px] decoration-current/0 transition-[color,text-decoration-color] duration-150 ease-[var(--ease-out-quad)] hover:text-foreground hover:underline hover:decoration-current/40"
          >
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
