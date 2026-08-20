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
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { formatPostDate } from "@/lib/posts";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}${post.image ?? ogImagePath(post.title)}`,
    author: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <article className="[--separator-height:--spacing(8)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="screen-line-bottom border-x border-line px-4 py-3">
        <Link
          href="/blog"
          className="link-underline extend-touch-target inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Blog
        </Link>
      </div>

      <Panel>
        <PanelHeader>
          <PanelTitle as="h1">{post.title}</PanelTitle>
          <PanelDescription className="typeset-timescale flex flex-wrap items-center gap-x-2 font-mono tabular-nums">
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
          </PanelDescription>
        </PanelHeader>

        <PanelContent className="typeset prose">
          <CustomMDX source={post.content} />
        </PanelContent>
      </Panel>
    </article>
  );
}
