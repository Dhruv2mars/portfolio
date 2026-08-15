import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { CustomMDX } from "@/components/mdx";
import { formatPostDate, getPostBySlug, getPublishedPosts } from "@/lib/blog";
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
    <article className="reveal pt-14 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-2xs text-dim transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        blog
      </Link>

      <h1 className="mt-6 max-w-[32ch] text-2xl font-medium tracking-tight text-balance">
        {post.title}
      </h1>

      <p className="mt-3 font-mono text-2xs text-dim">
        <time dateTime={post.publishedAt}>
          {formatPostDate(post.publishedAt)}
        </time>
        {" · "}
        {post.readingTimeMinutes} min read
      </p>

      <div className="rule mt-7" />

      <div className="prose mt-8">
        <CustomMDX source={post.content} />
      </div>
    </article>
  );
}
