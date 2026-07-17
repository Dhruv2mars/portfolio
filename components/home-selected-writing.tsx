import Link from "next/link";
import {
  formatWritingDate,
  listSelectedWriting,
  type WritingPiece,
} from "@/lib/writing";

function HomeWritingEmpty() {
  return (
    <p className="home-writing__empty">
      Coming soon — the Writing pipeline is ready; published pieces will appear
      here with no stand-ins in the meantime.
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
            <span className="home-writing__title">{piece.metadata.title}</span>
            <span className="home-writing__summary">
              {piece.metadata.summary}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Home selected Writing — honest empty/coming-soon when the collection is empty (ADR-0013). */
export function HomeSelectedWriting() {
  const pieces = listSelectedWriting();

  return (
    <section
      className="home-section home-section--writing"
      aria-labelledby="home-writing-heading"
    >
      <header className="home-section__intro">
        <h2 id="home-writing-heading" className="home-section__title">
          Writing
        </h2>
        <p className="home-section__lede">
          Long-form pieces that show how Dhruv thinks and decides.
        </p>
      </header>
      {pieces.length === 0 ? (
        <HomeWritingEmpty />
      ) : (
        <HomeWritingList pieces={pieces} />
      )}
    </section>
  );
}
