export type NavItem = {
  label: string;
  href: string;
  /** In-page anchors get scroll-spy treatment; routes do not. */
  section?: string;
};

export const HOME_SECTIONS = ["projects"] as const;
export type HomeSectionId = (typeof HOME_SECTIONS)[number];

/**
 * Labels are title-case: they are proper names for places on the page, and at
 * the header's small size lowercase reads as a stylistic tic rather than as
 * navigation. `section` stays lowercase — it is a DOM id, not prose.
 */
const BASE_NAV: readonly NavItem[] = [
  { label: "Projects", href: "/#projects", section: "projects" },
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

/**
 * Which section a reader is actually in, given where each one starts and how
 * far the page has scrolled. The rule is the last section whose top has passed
 * under the header — not the nearest, which flickers between two neighbours
 * whenever one is short.
 *
 * The bottom of the page is a special case: a final section shorter than the
 * viewport can never reach the header, so it would never light up. At the
 * bottom, the last section is the one you are looking at by definition.
 */
export function activeSectionId(
  sections: readonly { id: string; top: number }[],
  scrollTop: number,
  atBottom = false,
): string | null {
  if (sections.length === 0) return null;
  if (atBottom) return sections[sections.length - 1].id;
  let current: string | null = null;
  for (const section of sections) {
    if (section.top <= scrollTop) current = section.id;
  }
  return current;
}
