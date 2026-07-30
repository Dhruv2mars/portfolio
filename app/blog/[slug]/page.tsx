import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { CustomMDX } from "@/components/mdx";
import { Reveal } from "@/components/reveal";
import { ogImagePath } from "@/lib/discovery";
import { serializeJsonLd } from "@/lib/json-ld";
import { site } from "@/lib/site";
import {
  formatPostDate,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/blog";

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
      url: `${site.url}/blog/${post.slug}`,
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

export default async function BlogPostPage({ params }: PageProps) {
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
    url: `${site.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <article className="mx-auto max-w-[40rem] pt-16 pb-20 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Reveal>
        <Link
          href="/blog"
          className="link-muted meta-copy min-h-8 gap-1.5 no-underline"
        >
          <ArrowLeft size={12} weight="bold" aria-hidden />
          Blog
        </Link>
        <h1 className="display-title mt-6">{post.title}</h1>
        <p className="meta-copy mt-5 flex flex-wrap items-center gap-x-2">
          <span>{formatPostDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
          {post.tags && post.tags.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.tags.join(" · ")}</span>
            </>
          ) : null}
        </p>
        <div className="prose-blog mt-10">
          <CustomMDX source={post.content} />
        </div>
      </Reveal>
    </article>
  );
}
