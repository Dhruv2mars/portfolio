import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";
import {
  formatPostDate,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/writings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.image ?? ogImagePath(post.title);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${site.url}/writings/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    description: post.summary,
    url: `${site.url}/writings/${post.slug}`,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <article className="pt-14 pb-20 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Link
        href="/writings"
        className="link-editorial-muted meta-copy min-h-8 no-underline"
      >
        ← Writings
      </Link>
      <h1 className="display-title mt-6">{post.title}</h1>
      <p className="meta-copy mt-4">
        {formatPostDate(post.publishedAt)}
        <span aria-hidden> · </span>
        {post.readingTimeMinutes} min read
      </p>
      {post.tags && post.tags.length > 0 ? (
        <p className="meta-copy mt-2">{post.tags.join(" · ")}</p>
      ) : null}
      <div className="prose-editorial mt-10">
        <CustomMDX source={post.content} />
      </div>
    </article>
  );
}
