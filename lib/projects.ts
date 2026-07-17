export type Project = {
  name: string;
  description: string;
  url: string;
};

export const projects: readonly Project[] = [
  {
    name: "GridFall",
    description: "Tetris in your terminal.",
    url: "https://github.com/Dhruv2mars/GridFall",
  },
  {
    name: "Project-r",
    description:
      "AI tutor in your IDE — local, offline, voice-first (Gemma 3n).",
    url: "https://github.com/Dhruv2mars/project-r",
  },
  {
    name: "Cinemasketch",
    description:
      "AI storyboard generator from a text prompt (NVIDIA).",
    url: "https://github.com/Dhruv2mars/cinemasketch",
  },
  {
    name: "SuperChant",
    description:
      "Distraction-free Android mala for counting mantras with volume buttons.",
    url: "https://github.com/Dhruv2mars/superchant",
  },
  {
    name: "Detox",
    description:
      "Privacy-first Android app blocker with local allowlists and blocking overlays.",
    url: "https://github.com/Dhruv2mars/detox",
  },
  {
    name: "Offdex",
    description:
      "Local-first Codex experience across phone, web, and a native bridge.",
    url: "https://github.com/Dhruv2mars/offdex",
  },
  {
    name: "Gunmetal",
    description:
      "Local OpenAI-compatible API for routing your existing AI provider access.",
    url: "https://github.com/Dhruv2mars/gunmetal",
  },
  {
    name: "MDV",
    description:
      "Terminal Markdown app with a live editor, formatted preview, and in-app guide.",
    url: "https://github.com/Dhruv2mars/mdv",
  },
];
