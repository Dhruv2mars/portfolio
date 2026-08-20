import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { CustomMDX } from "@/components/mdx";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/components/panel";
import { PostActions } from "@/components/post-actions";
import { PostNeighbours } from "@/components/post-neighbours";
import { TocInline } from "@/components/toc-inline";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { findNeighbours, formatPostDate, postMarkdown } from "@/lib/posts";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";
import { tableOfContents } from "@/lib/toc";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const image = post.image ?? ogImagePath(post.title);
  const url = `${site.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      publishedTime: post.publishedAt,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;

  // The index is newest-first, so the neighbours come from the same order the
  // Visitor saw on the way in.
  const { newer, older } = findNeighbours(getPublishedPosts(), post.slug);
  const neighbour = (post: { slug: string; title: string } | null) =>
    post ? { slug: post.slug, title: post.title } : null;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      url,
      image: `${site.url}${post.image ?? ogImagePath(post.title)}`,
      author: { "@type": "Person", name: site.name, url: site.url },
      isPartOf: { "@type": "Blog", "@id": `${site.url}/blog` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${site.url}/blog`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <article className="[--separator-height:--spacing(8)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* The toolbar: the way back on the left, what you can do with the post
          on the right. Above the title because it is about the document rather
          than in it — a share button under a thousand words is a share button
          you decided to press in the first paragraph and then had to hunt
          for. */}
      <div className="screen-line-bottom flex items-center justify-between gap-2 border-x border-line py-2 pr-2 pl-4">
        <Link
          href="/blog"
          className="link-underline extend-touch-target inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Blog
        </Link>

        <PostActions
          markdown={postMarkdown(post, url, post.content)}
          rawUrl={`${url}/raw.md`}
          url={url}
          title={post.title}
          newer={neighbour(newer)}
          older={neighbour(older)}
        />
      </div>

      <Panel>
        <PanelHeader>
          <PanelTitle as="h1">{post.title}</PanelTitle>
          <PanelDescription>
            <p className="text-balance">{post.summary}</p>
            <p className="typeset-timescale mt-2 flex flex-wrap items-center gap-x-2 font-mono tabular-nums">
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt)}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMinutes} min read</span>
            </p>
          </PanelDescription>
        </PanelHeader>

        <TocInline entries={tableOfContents(post.content)} />

        <PanelContent className="typeset prose">
          <CustomMDX source={post.content} />
        </PanelContent>
      </Panel>

      <PostNeighbours newer={neighbour(newer)} older={neighbour(older)} />
    </article>
  );
}
