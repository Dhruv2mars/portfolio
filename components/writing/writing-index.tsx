import Link from "next/link";
import type { WritingPiece } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writing";

export function WritingComingSoon() {
  return (
    <section className="writing-surface" aria-labelledby="writing-heading">
      <header className="page-intro">
        <h1 id="writing-heading" className="page-intro__title">
          Writing
        </h1>
        <p className="page-intro__lede">
          Coming soon. Long-form pieces will appear here when they are ready —
          the pipeline is live; the shelf is empty on purpose.
        </p>
      </header>
    </section>
  );
}

export function WritingIndexList({ pieces }: { pieces: WritingPiece[] }) {
  return (
    <section className="writing-surface" aria-labelledby="writing-heading">
      <header className="page-intro">
        <h1 id="writing-heading" className="page-intro__title">
          Writing
        </h1>
        <p className="page-intro__lede">
          How I think about products, agents, and craft.
        </p>
      </header>
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
              <span>
                <span className="writing-list__title">
                  {piece.metadata.title}
                </span>
                <span className="writing-list__summary">
                  {piece.metadata.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
