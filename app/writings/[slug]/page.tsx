import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
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

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${site.url}/writings/${post.slug}`,
    },
  };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-10 pb-16 sm:pt-14">
      <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {formatPostDate(post.publishedAt)}
        <span aria-hidden="true"> · </span>
        {post.readingTimeMinutes} min read
      </p>
      {post.tags && post.tags.length > 0 ? (
        <p className="mt-2 text-sm text-muted">{post.tags.join(" · ")}</p>
      ) : null}
      <div className="prose-editorial mt-10">
        <CustomMDX source={post.content} />
      </div>
    </article>
  );
}
