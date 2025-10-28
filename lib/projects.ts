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
    name: "project-r",
    description:
      "AI tutor in your IDE — local, offline, voice-first (Gemma 3n).",
    url: "https://github.com/Dhruv2mars/project-r",
  },
  {
    name: "cinemasketch",
    description:
      "AI storyboard generator from a text prompt (NVIDIA).",
    url: "https://github.com/Dhruv2mars/cinemasketch",
  },
  {
    name: "LocalChat",
    description:
      "Local, offline-first AI chat using Tauri, SQLite, and Ollama.",
    url: "https://github.com/Dhruv2mars/LocalChat",
  },
  {
    name: "noteit",
    description:
      "Offline-first note-taking app for mobile, web, and desktop.",
    url: "https://github.com/Dhruv2mars/noteit",
  },
  {
    name: "Code-Editor",
    description:
      "Code editor to write and run programs on macOS desktop (Tauri) and web (React).",
    url: "https://github.com/Dhruv2mars/Code-Editor",
  },
];

