import type { CommandItem } from "@/components/command-palette";
import { navItems } from "@/lib/nav";
import { destinationHost, getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

/**
 * Everything the Portfolio can reach, in one flat list. Built on the server
 * so the palette ships no data-fetching of its own.
 */
export function paletteItems(hasPosts: boolean): CommandItem[] {
  const go: CommandItem[] = [
    { id: "home", group: "Go", label: "Home", href: "/" },
    ...navItems(hasPosts).map((item) => ({
      id: `nav-${item.label.toLowerCase()}`,
      group: "Go",
      label: item.label,
      href: item.href,
    })),
  ];

  const projects: CommandItem[] = getProjects().map((project) => ({
    id: `project-${project.name}`,
    group: "Projects",
    label: project.name,
    hint: destinationHost(project),
    href: project.live ?? project.url,
    external: true,
  }));

  const elsewhere: CommandItem[] = site.socials.map((social) => ({
    id: `social-${social.label}`,
    group: "Elsewhere",
    label: social.label,
    href: social.href,
    external: true,
  }));

  return [
    ...go,
    ...projects,
    ...elsewhere,
    {
      id: "rss",
      group: "Elsewhere",
      label: "RSS",
      href: site.rssPath,
      external: true,
    },
    {
      id: "theme",
      group: "Settings",
      label: "Toggle theme",
      action: "toggle-theme",
    },
  ];
}
