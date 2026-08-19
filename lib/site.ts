export type SocialLink = {
  label: "X" | "GitHub" | "LinkedIn" | "Email";
  href: string;
};

export const site = {
  name: "Dhruv Sharma",
  handle: "Dhruv2mars",
  /** The role, shown under the name. Lowercase on purpose. */
  tagline: "agentic engineer",
  /**
   * The one-line description search results, feed readers and the install
   * manifest read. It is not rendered on the page: the hero already says the
   * name and the role, and a third line under them was prose the page did not
   * need. See `app/layout.tsx`.
   */
  description:
    "I build tooling for coding agents — repro harnesses, queues, local-first inference — and ship with them every day.",
  url: "https://dhruv2mars.com",
  /**
   * No portrait exists yet. The profile header reserves this slot and renders
   * a monogram at the same size; setting this to an image path is the only
   * change needed to fill it, with no layout shift.
   */
  avatar: null as string | null,
  /**
   * Where the author is, written the way it should read. The same string is
   * the map query, so there is nothing to keep in sync. `null` draws no row
   * rather than a placeholder — an empty pin is worse than no pin.
   */
  location: "New Delhi, India" as string | null,
  /**
   * The IANA zone the clock in the overview runs on. Read off the author's own
   * machine rather than guessed; change it here and the clock, the hands and
   * the distance to the reader all follow.
   */
  timezone: "Asia/Kolkata" as string | null,
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
