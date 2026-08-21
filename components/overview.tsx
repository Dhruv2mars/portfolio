import { Panel, PanelContent } from "@/components/panel";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/handwritten-note";
import { SOCIAL_ICONS } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * How to reach the author — one panel, one row of doors.
 *
 * The reference gives this a legend of facts above the row: a job, a school, a
 * location, a clock. None of them are load-bearing here. A reader deciding
 * whether to write does not need to be told the hour where the letter lands,
 * and a line that only says where its author sits is a line spent on the
 * author rather than on the reader. What is left is the part that does
 * something when you touch it.
 */
export function Overview() {
  return (
    <Panel>
      {/* Every panel on the page is a landmark, so every panel gets a name.
          The ones that carry no visible title carry it for the screen reader
          instead — otherwise a reader jumping by region lands in an unnamed
          section and has to read it to find out what it is. */}
      <h2 className="sr-only">Overview</h2>

      {/* The row is unlabelled glyphs; what it is *for* is the one thing they
          do not say. The note says it in the margin, in the hand the other
          margin notes are written in, and only where there is a gutter to hold
          it and a pointer to follow it. */}
      <div className="relative">
        <HandwrittenNote className="top-4 right-full mr-4 hidden w-24 flex-col items-end text-right pointer-fine:xl:flex">
          <span className="-rotate-6">say hi</span>
          <HandwrittenArrow className="mt-0.5 translate-x-4 -rotate-12" />
        </HandwrittenNote>
        <PanelContent className="flex flex-wrap gap-2">
          {site.socials.map((social) => {
            const Glyph = SOCIAL_ICONS[social.label];
            const isMail = social.href.startsWith("mailto:");
            return (
              <a
                key={social.label}
                href={social.href}
                target={isMail ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 transition-all hover:bg-accent hover:text-foreground active:scale-[0.98] dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                <Glyph className="size-4.5" />
              </a>
            );
          })}
        </PanelContent>
      </div>
    </Panel>
  );
}
