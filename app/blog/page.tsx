import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/icons";
import { IconTile } from "@/components/icon-tile";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { Tag } from "@/components/tag";
import { formatPostDate, getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building tooling for coding agents.",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  // Nothing empty is ever shown to a Visitor (CONTEXT.md → Blog / Post).
  if (posts.length === 0) notFound();

  return (
    <div className="[--separator-height:--spacing(8)]">
      <Panel>
        <PanelHeader>
          <PanelTitle>
            Blog
            <PanelTitleSup className="tabular-nums">
              {posts.length}
            </PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            Notes on building tooling for coding agents.
          </PanelDescription>
        </PanelHeader>

        <ul>
          {posts.map((post) => (
            <li
              key={post.slug}
              className="group/post flex items-center border-b border-line transition-colors last:border-b-0 hover:bg-accent-muted"
            >
              <IconTile className="mx-4">
                <ArrowUpRight />
              </IconTile>

              <div className="min-w-0 flex-1 border-l border-dashed border-line">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex w-full items-center gap-2 p-4 pr-2 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 leading-snug font-medium text-balance">
                      {post.title}
                    </h2>
                    <p className="typeset typeset-description text-muted-foreground">
                      {post.summary}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      <li className="flex">
                        <Tag className="tabular-nums">
                          <time dateTime={post.publishedAt}>
                            {formatPostDate(post.publishedAt)}
                          </time>
                        </Tag>
                      </li>
                      <li className="flex">
                        <Tag className="tabular-nums">
                          {post.readingTimeMinutes} min read
                        </Tag>
                      </li>
                    </ul>
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div
        aria-hidden
        className="stripe-divider screen-line-bottom h-(--separator-height) w-full border-x border-line"
      />
    </div>
  );
}
