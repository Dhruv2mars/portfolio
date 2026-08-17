export type NavItem = {
  label: string;
  href: string;
  /** In-page anchors get scroll-spy treatment; routes do not. */
  section?: string;
};

export const HOME_SECTIONS = ["activity", "work"] as const;
export type HomeSectionId = (typeof HOME_SECTIONS)[number];

/**
 * Labels are title-case: they are proper names for places on the page, and at
 * the header's small size lowercase reads as a stylistic tic rather than as
 * navigation. `section` stays lowercase — it is a DOM id, not prose.
 */
const BASE_NAV: readonly NavItem[] = [
  { label: "Activity", href: "/#activity", section: "activity" },
  { label: "Work", href: "/#work", section: "work" },
];

/**
 * Blog only appears once a real Post is published. Nothing empty is ever
 * shown to a Visitor — see CONTEXT.md → Blog / Post.
 */
export function navItems(hasPublishedPosts: boolean): readonly NavItem[] {
  return hasPublishedPosts
    ? [...BASE_NAV, { label: "Blog", href: "/blog" }]
    : BASE_NAV;
}
