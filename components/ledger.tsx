import type { ReactNode } from "react";

/**
 * The shared LEDGER primitives. Every surface is built from these four things
 * and nothing else. See DESIGN.md §4.
 */

/** One year wide. Every rule, row, and footer lives inside a Field. */
export function Field({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article";
}) {
  return <Tag className={`field ${className}`}>{children}</Tag>;
}

/** The one graphic primitive. Draws itself when inside a revealed block. */
export function Rule({ className = "" }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

/**
 * Two-line section heading: a mono label over a serif value line.
 * Line 1 carries the section's one affordance on its right end.
 */
export function SectionHead({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <div data-reveal-text="">
      <div className="section-head">
        <h2 className="t-label">{label}</h2>
        {action}
      </div>
      <p className="t-value" style={{ marginTop: 20 }}>
        {value}
      </p>
    </div>
  );
}

/**
 * The row grammar — Projects, Latest, and Blog index all use this.
 * Line 1: [index] name ——————— tail. Line 2: description.
 */
export function Row({
  index,
  name,
  tail,
  tailHover,
  description,
  href,
  external,
}: {
  /** `01`–`08` on Projects, a date on Blog, omitted on Latest */
  index?: string;
  name: string;
  tail: string;
  /** what the tail crossfades to on hover — where the link actually goes */
  tailHover?: string;
  description?: string;
  href: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="row-line">
        {index ? <span className="row-index">{index}</span> : null}
        <span className="t-name">{name}</span>
        <span className="row-leader" aria-hidden="true" />
        <span className="row-tail">
          <span data-tail="rest">{tail}</span>
          {tailHover ? (
            <span data-tail="hover" aria-hidden="true">
              {tailHover}
            </span>
          ) : null}
        </span>
      </div>
      {description ? <p className="row-desc">{description}</p> : null}
    </>
  );

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      className="row block"
      style={{
        gridTemplateColumns: index
          ? "max-content max-content 1fr max-content"
          : undefined,
      }}
      {...linkProps}
    >
      {inner}
    </a>
  );
}
