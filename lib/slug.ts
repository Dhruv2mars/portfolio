/**
 * The id a heading gets, and the anchor a table of contents points at.
 *
 * One function, imported by both the MDX renderer and the contents list, so
 * the two cannot drift — a TOC whose links 404 into the middle of the page is
 * worse than no TOC.
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
