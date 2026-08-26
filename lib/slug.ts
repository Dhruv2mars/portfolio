/**
 * The id a heading gets, and the anchor a glossary mark points at.
 *
 * One function, imported by both the MDX renderer and the glossary split, so
 * the two cannot drift — a mark that resolves to nothing is a definition the
 * author wrote and the page silently dropped.
 */
export function slugify(str: unknown): string {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
