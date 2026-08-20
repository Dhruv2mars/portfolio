/**
 * One matcher, for every list on the site that has a filter over it.
 *
 * Spaces are dropped as well as case folded, so "codingagents" finds "coding
 * agents" and "pi queue" finds "pi-queue". Someone typing into a filter is not
 * typing prose; they are typing until the thing they want is the only thing
 * left, and every character that has to be exact is a way for that to fail.
 */
const normalize = (text: string) =>
  text.toLowerCase().replaceAll(" ", "").replaceAll("-", "");

/**
 * `terms` returns the fields worth matching for one item. Blanks are allowed
 * — an optional field is simply absent from the haystack rather than a reason
 * for the caller to build the array conditionally.
 */
export function filterByQuery<T>(
  items: readonly T[],
  query: string,
  terms: (item: T) => readonly (string | number | undefined)[],
): T[] {
  const needle = normalize(query.trim());
  if (!needle) return [...items];

  return items.filter((item) =>
    normalize(
      terms(item)
        .filter((term) => term !== undefined)
        .join(" "),
    ).includes(needle),
  );
}
