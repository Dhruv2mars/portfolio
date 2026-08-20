import type { CommandItem } from "@/components/command-palette";
import type { PostRecord } from "@/lib/blog";
import { navItems } from "@/lib/nav";
import { destinationHost, getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

/**
 * Everything the Portfolio can reach, in one flat list. Built on the server
 * so the palette ships no data-fetching of its own.
 */
export function paletteItems(posts: readonly PostRecord[]): CommandItem[] {
  const go: CommandItem[] = [
    { id: "home", group: "Go", label: "Home", href: "/" },
    ...navItems(posts.length > 0).map((item) => ({
      id: `nav-${item.label.toLowerCase()}`,
      group: "Go",
      label: item.label,
      href: item.href,
    })),
  ];

  // Every Post by name. A palette that lists the Blog but not what is in it
  // sends the Visitor to a page to do the search again.
  const writing: CommandItem[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    group: "Posts",
    label: post.title,
    hint: post.publishedAt.slice(0, 10),
    href: `/blog/${post.slug}`,
  }));

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
    ...writing,
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
      hint: "light / dark",
      action: "toggle-theme",
    },
    {
      id: "copy-url",
      group: "Settings",
      label: "Copy link to this page",
      action: "copy-url",
    },
  ];
}
