export type NavItem = {
  label: string;
  href: string;
};

/**
 * Every nav entry is a route. The home page carries samples of these places,
 * but the nav points at the places themselves — a header link that scrolls the
 * page you are already on is a link that does nothing on every other page.
 *
 * Labels are title-case: they are proper names for pages, and at the header's
 * small size lowercase reads as a stylistic tic rather than as navigation.
 */
const BASE_NAV: readonly NavItem[] = [{ label: "Projects", href: "/projects" }];

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
 * Which entry the reader is inside. A section of a route counts as that route
 * — `/blog/a-post` is still the Blog — but only on a segment boundary, so
 * `/projects-archive` is not `/projects`.
 */
export function isCurrentRoute(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
