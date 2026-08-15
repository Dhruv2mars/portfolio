export type Project = {
  name: string;
  description: string;
  url: string;
  /** Live demo or docs, when one exists and is different from `url`. */
  live?: string;
  language: string;
  year: number;
  /** Short third-party signal. Only ever a fact, never a vanity metric. */
  note?: string;
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
    note: "published on npm",
  },
  {
    name: "pi-queue",
    description:
      "FIFO message queue and steering for pi. Queue follow-ups while the agent is still working.",
    url: "https://github.com/Dhruv2mars/pi-queue",
    live: "https://www.npmjs.com/package/@dhruv2mars/pi-queue",
    language: "TypeScript",
    year: 2026,
    note: "published on npm",
  },
  {
    name: "offdex",
    description:
      "Local-first Codex experience across phone, web, and a native bridge.",
    url: "https://github.com/Dhruv2mars/offdex",
    language: "TypeScript",
    year: 2026,
  },
  {
    name: "gunmetal",
    description:
      "Local OpenAI-compatible API that routes inference through the AI subscriptions you already pay for.",
    url: "https://github.com/Dhruv2mars/gunmetal",
    live: "https://gunmetalapp.vercel.app",
    language: "Rust",
    year: 2026,
  },
  {
    name: "mdv-ts",
    description:
      "Terminal markdown editor and viewer — live editing, formatted preview, OpenTUI rendering.",
    url: "https://github.com/Dhruv2mars/mdv-ts",
    language: "TypeScript",
    year: 2026,
  },
  {
    name: "block",
    description:
      "WebGPU grid explorer for generating and curating logo marks, built on TypeGPU.",
    url: "https://github.com/Dhruv2mars/block",
    live: "https://block-five-zeta.vercel.app",
    language: "TypeScript",
    year: 2026,
  },
  {
    name: "codexchat",
    description:
      "Native chat client that runs inference against your existing ChatGPT subscription.",
    url: "https://github.com/Dhruv2mars/codexchat",
    language: "Rust",
    year: 2026,
  },
  {
    name: "openutm-v0",
    description:
      "Cross-platform, open source alternative to UTM for running virtual machines.",
    url: "https://github.com/Dhruv2mars/openutm-v0",
    language: "TypeScript",
    year: 2026,
  },
];

export function getProjects(): readonly Project[] {
  return PROJECTS;
}

export const PROJECT_NAMES = PROJECTS.map((p) => p.name);

/** Host shown on hover, e.g. `relunar.com`. */
export function destinationHost(project: Project): string {
  return new URL(project.live ?? project.url).host.replace(/^www\./, "");
}
