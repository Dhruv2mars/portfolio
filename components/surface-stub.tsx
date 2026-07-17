type SurfaceStubProps = {
  title: string;
  lede: string;
  note?: string;
};

/** Lightweight placeholder until surface tickets land (#15–#17). */
export function SurfaceStub({ title, lede, note }: SurfaceStubProps) {
  return (
    <section className="surface-stub">
      <p className="surface-stub__eyebrow">Coming into focus</p>
      <h1 className="surface-stub__title">{title}</h1>
      <p className="surface-stub__lede">{lede}</p>
      {note ? <p className="surface-stub__note">{note}</p> : null}
    </section>
  );
}
