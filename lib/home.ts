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

/** Content sections on Home in shell order, omitting empty optional strips. */
export function composeHomeContentSections(
  input: HomeCompositionInput,
): HomeContentSectionId[] {
  const sections: HomeContentSectionId[] = ["intro", "ai-activity"];

  if (input.selectedProjectCount > 0) {
    sections.push("selected-projects");
  }

  if (input.publishedPostCount > 0) {
    sections.push("writings");
  }

  return sections;
}
