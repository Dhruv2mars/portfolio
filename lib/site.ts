export type SocialLink = {
  label: "X" | "GitHub" | "LinkedIn" | "Email";
  href: string;
};

export const site = {
  name: "Dhruv Sharma",
  handle: "Dhruv2mars",
  /** Short Home positioning — not the old bio. */
  positioning:
    "Design Engineer building with AI as the default. I care about how products feel — and write down the judgment that got them there.",
  url: "https://dhruv2mars.com",
  avatar: "https://github.com/Dhruv2mars.png",
  socials: [
    { label: "X", href: "https://x.com/Dhruv2mars" },
    { label: "GitHub", href: "https://github.com/Dhruv2mars" },
    { label: "LinkedIn", href: "https://linkedin.com/in/dhruv2mars" },
    { label: "Email", href: "mailto:Dhruv2mars@gmail.com" },
  ] as const satisfies readonly SocialLink[],
  rssPath: "/feed.xml",
} as const;
