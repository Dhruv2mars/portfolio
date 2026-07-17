import Link from "next/link";
import type { WritingPiece } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writing";

export function WritingComingSoon() {
  return (
    <section className="writing-surface" aria-labelledby="writing-heading">
      <p className="writing-eyebrow">Writing</p>
      <h1 id="writing-heading" className="writing-title">
        Coming soon
      </h1>
      <p className="writing-lede">
        Long-form pieces that show how Dhruv thinks and decides. The pipeline is
        ready; published Writing will appear here — no stand-ins in the meantime.
      </p>
    </section>
  );
}

export function WritingIndexList({ pieces }: { pieces: WritingPiece[] }) {
  return (
    <section className="writing-surface" aria-labelledby="writing-heading">
      <p className="writing-eyebrow">Writing</p>
      <h1 id="writing-heading" className="writing-title">
        Writing
      </h1>
      <p className="writing-lede">
        Long-form pieces that show how Dhruv thinks and decides.
      </p>
      <ul className="writing-list">
        {pieces.map((piece) => (
          <li key={piece.slug} className="writing-list__item">
            <Link
              href={`/writing/${piece.slug}`}
              className="writing-list__link"
            >
              <span className="writing-list__meta">
                <time dateTime={piece.metadata.publishedAt}>
                  {formatWritingDate(piece.metadata.publishedAt)}
                </time>
              </span>
              <span className="writing-list__title">{piece.metadata.title}</span>
              <span className="writing-list__summary">
                {piece.metadata.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
