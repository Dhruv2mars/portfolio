/** Label, optional aside, then a rule that draws itself in. */
export function SectionHeading({
  label,
  aside,
}: {
  label: string;
  aside?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="section-label">{label}</h2>
        {aside ? (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-2xs text-dim">
            {aside}
          </span>
        ) : null}
      </div>
      <div className="rule mt-3" />
    </div>
  );
}
