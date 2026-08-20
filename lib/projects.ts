import { filterByQuery } from "@/lib/search";

/**
 * What kind of thing the project *is*, which is what its gutter glyph draws.
 * Kept here as a plain string union so this module stays free of React —
 * `components/projects-section.tsx` owns the kind→glyph map.
 */
export type ProjectKind =
  | "cli"
  | "queue"
  | "app"
  | "server"
  | "editor"
  | "canvas"
  | "chat"
  | "vm";

export type Project = {
  name: string;
  description: string;
  url: string;
  /** Live demo or docs, when one exists and is different from `url`. */
  live?: string;
  language: string;
  year: number;
  kind: ProjectKind;
  /** Short third-party signal. Only ever a fact, never a vanity metric. */
  note?: string;
  /**
   * The project's own mark, when it has one, checked into `public/projects`
   * rather than fetched from the project's site — a row must not depend on
   * eight other origins being up, and the Visitor must not be announced to
   * them for looking at this page.
   *
   * `mono` says the file is a silhouette, which is most of them: it is then
   * drawn as a mask in the row's own ink, so a project mark and a kind glyph
   * are the same weight of thing. Marks that carry their own colour (a full
   * composition, not a glyph) drop `mono` and are drawn as an image.
   */
  logo?: { src: string; mono?: boolean };
};

/**
 * Curated, not enumerated. The GitHub account has ~45 repos; eight earn a
 * row here. Order is editorial: the agentic thesis first, then shipped
 * craft. See CONTEXT.md → Project.
 */
const PROJECTS: readonly Project[] = [
  {
    name: "relunar",
    description:
      "CLI-first repro harness for coding agents — deterministic sandboxes, issue reads, and reports.",
    url: "https://github.com/Dhruv2mars/relunar",
    live: "https://relunar.com",
    language: "TypeScript",
    year: 2026,
    kind: "cli",
    note: "published on npm",
    logo: { src: "/projects/relunar.svg", mono: true },
  },
  {
    name: "pi-queue",
    description:
      "FIFO message queue and steering for pi. Queue follow-ups while the agent is still working.",
    url: "https://github.com/Dhruv2mars/pi-queue",
    live: "https://www.npmjs.com/package/@dhruv2mars/pi-queue",
    language: "TypeScript",
    year: 2026,
    kind: "queue",
    note: "published on npm",
  },
  {
    name: "offdex",
    description:
      "Local-first Codex experience across phone, web, and a native bridge.",
    url: "https://github.com/Dhruv2mars/offdex",
    language: "TypeScript",
    year: 2026,
    kind: "app",
  },
  {
    name: "gunmetal",
    description:
      "Local OpenAI-compatible API routing inference through subscriptions you already pay for.",
    url: "https://github.com/Dhruv2mars/gunmetal",
    live: "https://gunmetalapp.vercel.app",
    language: "Rust",
    year: 2026,
    kind: "server",
    logo: { src: "/projects/gunmetal.svg", mono: true },
  },
  {
    name: "mdv-ts",
    description:
      "Terminal markdown editor and viewer — live editing, formatted preview, OpenTUI rendering.",
    url: "https://github.com/Dhruv2mars/mdv-ts",
    language: "TypeScript",
    year: 2026,
    kind: "editor",
  },
  {
    name: "block",
    description:
      "WebGPU grid explorer for generating and curating logo marks, built on TypeGPU.",
    url: "https://github.com/Dhruv2mars/block",
    live: "https://block-five-zeta.vercel.app",
    language: "TypeScript",
    year: 2026,
    kind: "canvas",
    logo: { src: "/projects/block.svg" },
  },
  {
    name: "codexchat",
    description:
      "Native chat client that runs inference against your existing ChatGPT subscription.",
    url: "https://github.com/Dhruv2mars/codexchat",
    language: "Rust",
    year: 2026,
    kind: "chat",
  },
  {
    name: "openutm-v0",
    description:
      "Cross-platform, open source alternative to UTM for running virtual machines.",
    url: "https://github.com/Dhruv2mars/openutm-v0",
    language: "TypeScript",
    year: 2026,
    kind: "vm",
  },
];

export function getProjects(): readonly Project[] {
  return PROJECTS;
}

export const PROJECT_NAMES = PROJECTS.map((p) => p.name);

/**
 * Everything a row shows, plus the year and the kind, which are things a
 * Visitor looks for by name ("rust", "2026", "cli") even though the kind is
 * only ever drawn as a glyph.
 */
export function searchProjects(
  projects: readonly Project[],
  query: string,
): Project[] {
  return filterByQuery(projects, query, (project) => [
    project.name,
    project.description,
    project.language,
    project.kind,
    project.note,
    project.year,
  ]);
}

/** Host shown on hover, e.g. `relunar.com`. */
export function destinationHost(project: Project): string {
  return new URL(project.live ?? project.url).host.replace(/^www\./, "");
}
