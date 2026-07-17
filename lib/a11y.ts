/**
 * Keyboard / focus chrome contracts for the Editorial shell.
 * Used by Primary nav, theme control, and outbound Project/Post links.
 */
export const FOCUSABLE_CHROME = {
  primaryNavLabel: "Primary",
  skipToContentHref: "#main-content",
  skipToContentLabel: "Skip to content",
  mainContentId: "main-content",
} as const;

/** A control is keyboard-reachable when it can receive focus and has a name. */
export function isKeyboardReachableControl(options: {
  hasAccessibleName: boolean;
  tabbable: boolean;
}): boolean {
  return options.tabbable && options.hasAccessibleName;
}
