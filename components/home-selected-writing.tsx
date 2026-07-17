import Link from "next/link";
import {
  formatWritingDate,
  listSelectedWriting,
  type WritingPiece,
} from "@/lib/writing";

function HomeWritingEmpty() {
  return (
    <p className="home-writing__empty">
      Coming soon. Long-form Writing will land here when it is ready — no
      placeholders in the meantime.
    </p>
  );
}

function HomeWritingList({ pieces }: { pieces: WritingPiece[] }) {
  return (
    <ul className="home-writing__list">
      {pieces.map((piece) => (
        <li key={piece.slug} className="home-writing__item">
          <Link href={`/writing/${piece.slug}`} className="home-writing__link">
            <span className="home-writing__meta">
              <time dateTime={piece.metadata.publishedAt}>
                {formatWritingDate(piece.metadata.publishedAt)}
              </time>
            </span>
            <span>
              <span className="home-writing__title">{piece.metadata.title}</span>
              <span className="home-writing__summary">
                {piece.metadata.summary}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Home selected Writing — honest empty/coming-soon when empty (ADR-0013). */
export function HomeSelectedWriting() {
  const pieces = listSelectedWriting();

  return (
    <section className="home-band" aria-labelledby="home-writing-heading">
      <header className="home-band__head">
        <div>
          <h2 id="home-writing-heading" className="home-band__title">
            Writing
          </h2>
          <p className="home-band__lede">
            How I think about products, agents, and craft.
          </p>
        </div>
        <Link href="/writing" className="home-band__link">
          View all
        </Link>
      </header>
      {pieces.length === 0 ? (
        <HomeWritingEmpty />
      ) : (
        <HomeWritingList pieces={pieces} />
      )}
    </section>
  );
}
