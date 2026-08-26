# Blog (Posts)

Add a Post as an `.mdx` file in this directory. The filename (without extension) is the slug.

```mdx
---
title: Your title
publishedAt: 2026-07-01
updatedAt: 2026-08-01
summary: One-line summary for index and social cards.
tags: optional, comma, separated
draft: true
---

Body in MDX. Set `draft: false` (or omit draft) to publish.
```

Drafts never appear on `/blog`, Post detail routes, Home, or RSS.

## Frontmatter rules

This is not YAML. `lib/blog.ts` reads it with about thirty lines of string
handling, because the alternative is a parser dependency for five fields.

- **One line per field.** A block scalar (`>`, `|`) is rejected outright rather
  than half-parsed. A long summary stays on one long line.
- **Split on the first colon.** Everything after it is the value, so a title
  may contain colons without being quoted. Surrounding quotes, if you use
  them, are stripped.
- `updatedAt` is optional and only worth setting when the Post changed in a way
  a reader would care about; `dateModified` in the structured data falls back
  to `publishedAt`.
- `tags` are comma-separated. They are not drawn on the page and not matched by
  the search field — they go out as `keywords` in the Post's structured data.
