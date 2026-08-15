import Image from "next/image";
import { site } from "@/lib/site";

/**
 * The Home masthead (DESIGN.md §4, §8).
 *
 * One compact block — NOT a hero. The fold's event is the serif numeral below,
 * so this must stay short enough that the whole year grid clears 900px.
 * ~145px tall at 1440px: 40 avatar · 20 · 2-line lead · 20 · social words.
 *
 * evilrabbit's device: bold name, gray continuation, one line, no display
 * heading. The circular icon chips of the old site are deleted deliberately —
 * they were its single most generic element.
 */

/** avatar is 2 units — the only image on the page */
const AVATAR = 40;

const CONTINUATION = " — Design Engineer, AI-pilled.";

const LEAD =
  "I build and think with agents as the default way of working, not as a side interest. What ships is a judgment call, and I write those down.";

export function HomeIntro() {
  return (
    <>
      <div
        data-reveal-text=""
        style={{ display: "flex", alignItems: "center", gap: 20 }}
      >
        <Image
          src={site.avatar}
          alt={`Portrait of ${site.name}`}
          width={AVATAR}
          height={AVATAR}
          priority
          className="avatar"
          style={{ width: AVATAR, height: AVATAR }}
        />
        <h1 className="t-name" style={{ margin: 0 }}>
          {site.name}
          <span style={{ color: "var(--color-fg-muted)" }}>{CONTINUATION}</span>
        </h1>
      </div>

      <p className="t-lead" data-reveal-text="" style={{ marginTop: 20 }}>
        {LEAD}
      </p>

      <ul
        className="t-meta"
        data-reveal-text=""
        aria-label="Elsewhere"
        style={{
          marginTop: 20,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: 20,
        }}
      >
        {site.socials.map((social) => {
          const mail = social.href.startsWith("mailto:");
          return (
            <li key={social.label}>
              <a
                href={social.href}
                className="link-quiet"
                {...(mail
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {social.label.toLowerCase()}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
