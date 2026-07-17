export type NavItem = {
  label: "Home" | "Writings" | "Projects";
  href: "/" | "/writings" | "/projects";
};

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Writings", href: "/writings" },
  { label: "Projects", href: "/projects" },
] as const;
