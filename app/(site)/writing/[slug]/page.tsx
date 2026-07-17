import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WritingMDX } from "@/components/writing/mdx";
import { site } from "@/lib/site";
import {
  formatWritingDate,
  getPublishedWriting,
  getWritingBySlug,
  writingJsonLd,
} from "@/lib/writing";

type WritingSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedWriting().map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({
  params,
}: WritingSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = getWritingBySlug(slug);
  if (!piece) return {};

  const { title, publishedAt: publishedTime, summary: description, image } =
    piece.metadata;
  const ogImage = image
    ? image
    : `${site.url}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${site.url}/writing/${piece.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function WritingSlugPage({ params }: WritingSlugPageProps) {
  const { slug } = await params;
  const piece = getWritingBySlug(slug);

  if (!piece) {
    notFound();
  }

  return (
    <article className="writing-piece">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(writingJsonLd(piece, site.url)),
        }}
      />
      <p className="writing-eyebrow">
        <time dateTime={piece.metadata.publishedAt}>
          {formatWritingDate(piece.metadata.publishedAt)}
        </time>
      </p>
      <h1 className="writing-title">{piece.metadata.title}</h1>
      <p className="writing-lede">{piece.metadata.summary}</p>
      <div className="writing-prose">
        <WritingMDX source={piece.content} />
      </div>
    </article>
  );
}
