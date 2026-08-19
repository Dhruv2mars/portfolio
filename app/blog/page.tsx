import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogSection } from "@/components/blog-section";
import { getPublishedPosts } from "@/lib/blog";

/**
 * With nothing published the route 404s, so it must not advertise itself as a
 * Blog — naming a page the Visitor cannot reach is a lie told by the tab.
 */
export function generateMetadata(): Metadata {
  if (getPublishedPosts().length === 0) return { title: "Nothing lives here" };
  return {
    title: "Blog",
    description: "Notes on coding agents and the models behind them.",
  };
}

export default function BlogPage() {
  // Nothing empty is ever shown to a Visitor (CONTEXT.md → Blog / Post).
  if (getPublishedPosts().length === 0) notFound();

  return (
    <div className="[--separator-height:--spacing(8)]">
      <BlogSection as="h1" />
    </div>
  );
}
