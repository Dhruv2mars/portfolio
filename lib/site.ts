export type SocialLink = {
  label: "X" | "GitHub" | "LinkedIn" | "Email";
  href: string;
};

export const site = {
  name: "Dhruv Sharma",
  handle: "Dhruv2mars",
  /** The positioning, shown under the name. Lowercase on purpose. */
  tagline: "agentic engineer",
  /** One line of context. Proof lives below it, not in it. */
  positioning:
    "I build tooling for coding agents — repro harnesses, queues, local-first inference — and ship with them every day.",
  url: "https://dhruv2mars.com",
  /**
   * No portrait exists yet. The masthead reserves this slot and renders a
   * live placeholder; setting this to an image path is the only change
   * needed to fill it, with no layout shift. See DESIGN.md §3.
   */
  avatar: null as string | null,
  socials: [
    { label: "X", href: "https://x.com/Dhruv2mars" },
    { label: "GitHub", href: "https://github.com/Dhruv2mars" },
    { label: "LinkedIn", href: "https://linkedin.com/in/dhruv2mars" },
    { label: "Email", href: "mailto:Dhruv2mars@gmail.com" },
  ] as const satisfies readonly SocialLink[],
  rssPath: "/feed.xml",
} as const;

/** Socials minus mailto, for `sameAs` in structured data. */
export function profileUrls(): string[] {
  return site.socials
    .filter((s) => !s.href.startsWith("mailto:"))
    .map((s) => s.href);
}
