export type NavItem = {
  label: string;
  href: string;
  /** In-page anchors get scroll-spy treatment; routes do not. */
  section?: string;
};

export const HOME_SECTIONS = ["activity", "work"] as const;
export type HomeSectionId = (typeof HOME_SECTIONS)[number];

const BASE_NAV: readonly NavItem[] = [
  { label: "activity", href: "/#activity", section: "activity" },
  { label: "work", href: "/#work", section: "work" },
];

/**
 * Blog only appears once a real Post is published. Nothing empty is ever
 * shown to a Visitor — see CONTEXT.md → Blog / Post.
 */
export function navItems(hasPublishedPosts: boolean): readonly NavItem[] {
  return hasPublishedPosts
    ? [...BASE_NAV, { label: "blog", href: "/blog" }]
    : BASE_NAV;
}
