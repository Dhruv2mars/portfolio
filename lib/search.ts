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
 *
 * Each field is tested on its own rather than joined into one string. Joining
 * and then folding out the separator lets a query straddle a boundary: a
 * project written in `ts` with the note `rust` would answer to "tsrust", which
 * is a match the reader cannot see and cannot have meant.
 */
export function filterByQuery<T>(
  items: readonly T[],
  query: string,
  terms: (item: T) => readonly (string | number | undefined)[],
): T[] {
  const needle = normalize(query.trim());
  if (!needle) return [...items];

  return items.filter((item) =>
    terms(item).some(
      (term) => term !== undefined && normalize(String(term)).includes(needle),
    ),
  );
}
