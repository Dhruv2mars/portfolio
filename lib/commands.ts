import { site } from "@/lib/site";

/**
 * Command menu model — the full list of actions a Visitor can run.
 * Pure data + filtering so behavior stays testable.
 */
export type CommandGroup = "Navigate" | "Actions" | "Socials";

export type CommandAction =
  | { type: "navigate"; href: string; external?: boolean }
  | { type: "copy"; text: string; doneLabel: string }
  | { type: "theme" };

export type CommandItem = {
  id: string;
  group: CommandGroup;
  label: string;
  keywords: string[];
  /** Right-side hint rendered in the row (e.g. "↵", "⌘L"). */
  hint?: string;
  action: CommandAction;
};

export const GROUP_ORDER: readonly CommandGroup[] = [
  "Navigate",
  "Actions",
  "Socials",
] as const;

const EMAIL = "Dhruv2mars@gmail.com";

/** Dark-state drives only the theme-toggle label. */
export function buildCommands(options: { isDark: boolean }): CommandItem[] {
  const items: CommandItem[] = [
    {
      id: "home",
      group: "Navigate",
      label: "Home",
      keywords: ["index", "start"],
      action: { type: "navigate", href: "/" },
    },
    {
      id: "writings",
      group: "Navigate",
      label: "Writings",
      keywords: ["blog", "posts", "essays", "writing"],
      action: { type: "navigate", href: "/writings" },
    },
    {
      id: "projects",
      group: "Navigate",
      label: "Projects",
      keywords: ["work", "repos", "code"],
      action: { type: "navigate", href: "/projects" },
    },
    {
      id: "rss",
      group: "Navigate",
      label: "RSS feed",
      keywords: ["feed", "subscribe", "xml", "atom"],
      action: { type: "navigate", href: site.rssPath, external: true },
    },
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      keywords: ["email", "mail", "contact", "copy", "reach"],
      action: { type: "copy", text: EMAIL, doneLabel: "Email copied" },
    },
    {
      id: "theme",
      group: "Actions",
      label: options.isDark ? "Switch to light theme" : "Switch to dark theme",
      keywords: ["theme", "dark", "light", "mode", "appearance", "toggle"],
      action: { type: "theme" },
    },
    {
      id: "source",
      group: "Actions",
      label: "View source",
      keywords: ["github", "code", "source", "repo"],
      action: {
        type: "navigate",
        href: "https://github.com/Dhruv2mars/portfolio",
        external: true,
      },
    },
  ];

  for (const social of site.socials) {
    if (social.label === "Email") continue;
    items.push({
      id: `social-${social.label.toLowerCase()}`,
      group: "Socials",
      label: social.label,
      keywords: ["social", "external", "link", social.label.toLowerCase()],
      action: { type: "navigate", href: social.href, external: true },
    });
  }

  return items;
}

function normalize(query: string): string {
  return query.trim().toLowerCase();
}

/** Case-insensitive substring match over label + keywords. Order preserved. */
export function filterCommands(
  items: readonly CommandItem[],
  query: string,
): CommandItem[] {
  const q = normalize(query);
  if (!q) return [...items];

  return items.filter((item) => {
    if (item.label.toLowerCase().includes(q)) return true;
    return item.keywords.some((k) => k.includes(q));
  });
}

/** Flatten into renderable blocks of [group, items[]], dropping empty groups. */
export function groupCommands(
  items: readonly CommandItem[],
): { group: CommandGroup; items: CommandItem[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((i) => i.group === group),
  })).filter(({ items: groupItems }) => groupItems.length > 0);
}
