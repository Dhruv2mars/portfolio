export type Project = {
  name: string;
  description: string;
  url: string;
  year?: number;
  selected?: boolean;
  /** Rank among selected Projects on Home (ascending). */
  homeRank?: number;
};

const PROJECTS: readonly Project[] = [
  {
    name: "GridFall",
    description: "Tetris in your terminal.",
    url: "https://github.com/Dhruv2mars/GridFall",
    year: 2025,
    selected: true,
    homeRank: 5,
  },
  {
    name: "Project-r",
    description:
      "AI tutor in your IDE — local, offline, voice-first (Gemma 3n).",
    url: "https://github.com/Dhruv2mars/project-r",
    year: 2025,
    selected: true,
    homeRank: 1,
  },
  {
    name: "Cinemasketch",
    description: "AI storyboard generator from a text prompt (NVIDIA).",
    url: "https://github.com/Dhruv2mars/cinemasketch",
    year: 2025,
    selected: true,
    homeRank: 4,
  },
  {
    name: "SuperChant",
    description:
      "Distraction-free Android mala for counting mantras with volume buttons.",
    url: "https://github.com/Dhruv2mars/superchant",
    year: 2026,
  },
  {
    name: "Detox",
    description:
      "Privacy-first Android app blocker with local allowlists and blocking overlays.",
    url: "https://github.com/Dhruv2mars/detox",
    year: 2026,
  },
  {
    name: "Offdex",
    description:
      "Local-first Codex experience across phone, web, and a native bridge.",
    url: "https://github.com/Dhruv2mars/offdex",
    year: 2026,
    selected: true,
    homeRank: 2,
  },
  {
    name: "Gunmetal",
    description:
      "Local OpenAI-compatible API for routing your existing AI provider access.",
    url: "https://github.com/Dhruv2mars/gunmetal",
    year: 2026,
    selected: true,
    homeRank: 3,
  },
  {
    name: "MDV",
    description:
      "Terminal Markdown app with a live editor, formatted preview, and in-app guide.",
    url: "https://github.com/Dhruv2mars/mdv",
    year: 2026,
  },
];

export const PROJECT_NAMES = PROJECTS.map((p) => p.name);

/** Full Projects index in stable editorial order. */
export function getProjects(): readonly Project[] {
  return PROJECTS;
}

/** Home selected Projects, ordered by homeRank. */
export function getSelectedProjects(): readonly Project[] {
  return PROJECTS.filter((p) => p.selected)
    .slice()
    .sort((a, b) => (a.homeRank ?? 0) - (b.homeRank ?? 0));
}

/** @deprecated Prefer getProjects() — kept for any transitional imports. */
export const projects = PROJECTS;
