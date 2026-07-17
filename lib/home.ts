/**
 * Home composition — Editorial shell order for Visitors.
 * Footer lives in the site shell; content sections render on `/`.
 */
export const HOME_SHELL_ORDER = [
  "intro",
  "ai-activity",
  "selected-projects",
  "writings",
  "footer",
] as const;

export type HomeShellSectionId = (typeof HOME_SHELL_ORDER)[number];

export type HomeContentSectionId = Exclude<HomeShellSectionId, "footer">;

export type HomeCompositionInput = {
  selectedProjectCount: number;
  publishedPostCount: number;
};

/** Visitor-facing Home section titles — single source for IA language checks. */
export const HOME_SECTION_COPY = {
  intro: null,
  "ai-activity": "AI Activity",
  "selected-projects": "Selected Projects",
  writings: "Latest Writings",
  footer: null,
} as const satisfies Record<HomeShellSectionId, string | null>;

function includeContentSection(
  id: HomeContentSectionId,
  input: HomeCompositionInput,
): boolean {
  switch (id) {
    case "intro":
    case "ai-activity":
      return true;
    case "selected-projects":
      return input.selectedProjectCount > 0;
    case "writings":
      return input.publishedPostCount > 0;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

/** Content sections on Home in shell order, omitting empty optional strips. */
export function composeHomeContentSections(
  input: HomeCompositionInput,
): HomeContentSectionId[] {
  return HOME_SHELL_ORDER.filter((id): id is HomeContentSectionId => {
    if (id === "footer") return false;
    return includeContentSection(id, input);
  });
}
