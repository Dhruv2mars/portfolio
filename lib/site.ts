export type NavItem = {
  label: "Home" | "Writing" | "Projects";
  href: "/" | "/writing" | "/projects";
};

export type ContactLink = {
  label: "Email" | "X" | "GitHub" | "LinkedIn";
  href: string;
};

/** Primary surfaces only — no separate About or Activity (ADR-0003). */
export const primaryNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
  { label: "Projects", href: "/projects" },
] as const;

/** Contact lives as header/footer links, not a dedicated surface. */
export const contactLinks: readonly ContactLink[] = [
  { label: "Email", href: "mailto:Dhruv2mars@gmail.com" },
  { label: "X", href: "https://x.com/Dhruv2mars" },
  { label: "GitHub", href: "https://github.com/Dhruv2mars" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dhruv2mars" },
] as const;

export const site = {
  name: "Dhruv Sharma",
  handle: "@Dhruv2mars",
  tagline:
    "I build AI-native products end to end — from the interface to the agent loop.",
  description:
    "Dhruv Sharma — AI-native builder and design engineer. Writing, projects, and token activity.",
  /** Canonical origin for RSS, sitemap, OG, and JSON-LD. */
  url: "https://dhruv2mars.com",
} as const;
