/**
 * Curated Projects catalog.
 * Index membership requires a still thumbnail (ADR-0006).
 */

export type Project = {
  slug: string;
  title: string;
  lede: string;
  href: string;
  /** Mandatory for index / selected visibility — omit to keep off the index. */
  stillSrc?: string;
  /** When true (and stillSrc is set), included in Home’s selected Projects. */
  selected?: boolean;
};

export type ProjectIndexRow = {
  title: string;
  lede: string;
  href: string;
  stillSrc: string;
};

export const projectsCatalog: readonly Project[] = [
  {
    slug: "gunmetal",
    title: "Gunmetal",
    lede:
      "Local OpenAI-compatible API for routing existing AI provider access.",
    href: "https://gunmetalapp.vercel.app",
    stillSrc: "/projects/gunmetal.svg",
    selected: true,
  },
  {
    slug: "cinemasketch",
    title: "Cinemasketch",
    lede: "AI storyboard generator from a text prompt — NVIDIA image models.",
    href: "https://cinemasketch-app.vercel.app",
    stillSrc: "/projects/cinemasketch.svg",
    selected: true,
  },
  {
    slug: "project-r",
    title: "project-r",
    lede: "AI tutor in your IDE — local, offline, voice-first (Gemma 3n).",
    href: "https://github.com/Dhruv2mars/project-r",
    stillSrc: "/projects/project-r.svg",
    selected: true,
  },
  {
    slug: "gridfall",
    title: "GridFall",
    lede: "Tetris in your terminal.",
    href: "https://github.com/Dhruv2mars/GridFall",
    stillSrc: "/projects/gridfall.svg",
  },
  {
    slug: "offdex",
    title: "Offdex",
    lede: "Local-first Codex experience across phone, web, and a native bridge.",
    href: "https://github.com/Dhruv2mars/offdex",
    stillSrc: "/projects/offdex.svg",
  },
  {
    slug: "mdv",
    title: "mdv",
    lede:
      "Terminal Markdown app with a live editor, formatted preview, and in-app guide.",
    href: "https://github.com/Dhruv2mars/mdv",
    stillSrc: "/projects/mdv.svg",
  },
  {
    slug: "superchant",
    title: "SuperChant",
    lede:
      "Distraction-free Android mala for counting mantras with volume buttons.",
    href: "https://github.com/Dhruv2mars/superchant",
    stillSrc: "/projects/superchant.svg",
  },
  {
    slug: "detox",
    title: "Detox",
    lede:
      "Privacy-first Android app blocker with local allowlists and blocking overlays.",
    href: "https://github.com/Dhruv2mars/detox",
    stillSrc: "/projects/detox.svg",
  },
  // Intentionally no still — stays off the index until one exists (ADR-0006).
  {
    slug: "relunar",
    title: "Relunar",
    lede: "GitHub issues reproduction harness for coding agents.",
    href: "https://relunar.com",
  },
] as const;

export function toIndexRow(project: Project): ProjectIndexRow | null {
  if (!project.stillSrc) {
    return null;
  }

  return {
    title: project.title,
    lede: project.lede,
    href: project.href,
    stillSrc: project.stillSrc,
  };
}

export function listIndexProjects(
  projects: readonly Project[] = projectsCatalog,
): ProjectIndexRow[] {
  return projects.flatMap((project) => {
    const row = toIndexRow(project);
    return row ? [row] : [];
  });
}

export function listSelectedProjects(
  projects: readonly Project[] = projectsCatalog,
): ProjectIndexRow[] {
  return projects.flatMap((project) => {
    if (!project.selected) {
      return [];
    }
    const row = toIndexRow(project);
    return row ? [row] : [];
  });
}
