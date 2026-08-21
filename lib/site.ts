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
   * The role line said more than one way. The first is the canonical one — it
   * is what `tagline` carries into metadata and structured data, where nothing
   * can rotate — and the rest widen it without the hero growing a paragraph.
   */
  flipSentences: [
    "agentic engineer",
    "prototyper",
    "tooling for coding agents",
    "local-first by default",
  ] as const,
  /**
   * How the name sounds. `audio` is the answer — a recording of the name being
   * said — and `phonetic` is the same answer written down, shown on the button
   * for anyone who would rather read it. With no recording the button is not
   * drawn: a synthesised English voice has neither the breathy d nor the
   * retroflex v, so it says a different name confidently, which is worse than
   * silence.
   */
  pronunciation: {
    phonetic: "/dʱruːʋ ˈʃərmə/",
    audio: "/audio/dhruv-sharma.mp3" as string | null,
  },
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
   * Current Codex pet portrait. The profile header keeps its monogram fallback
   * so a missing asset never turns the masthead into a broken image.
   */
  avatar: "/avatar/sunny.webp" as string | null,
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
