export type NavItem = {
  label: "Home" | "Blog" | "Projects";
  href: "/" | "/blog" | "/projects";
};

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
] as const;
