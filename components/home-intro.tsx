import { site } from "@/lib/site";

export function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-heading"
      className="pt-10 pb-8 sm:pt-14 sm:pb-10"
    >
      <h1
        id="home-intro-heading"
        className="text-[1.75rem] font-semibold tracking-tight text-foreground text-pretty sm:text-[2rem]"
      >
        {site.name}
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted text-pretty">
        {site.positioning}
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
        {site.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex min-h-9 items-center text-foreground no-underline transition-opacity duration-200 ease-[var(--ease-editorial)] hover:underline"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
