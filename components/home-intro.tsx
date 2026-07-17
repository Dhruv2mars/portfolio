import { site } from "@/lib/site";

export function HomeIntro() {
  return (
    <section aria-labelledby="home-intro-heading" className="pt-10 pb-4 sm:pt-14">
      <h1
        id="home-intro-heading"
        className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]"
      >
        {site.name}
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted">
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
              className="text-foreground no-underline hover:underline"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
