import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";
import { LEVEL_ALPHA } from "@/lib/figure";
import { glyphField } from "@/lib/glyph-404";

const FIELD = glyphField("404");

/**
 * The 404 boundary owns its own title; without this an unmatched URL wears the
 * home page's, in the tab and in every share card.
 *
 * No `robots` here. Next already emits `<meta name="robots" content="noindex">`
 * on this boundary, and declaring a second one only put two of the tag in the
 * built HTML. The directive it added was `nofollow`, which is wrong anyway:
 * every link on this page points back into the site, and those are the links a
 * crawler that landed here should follow.
 */
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <Panel>
        <PanelHeader>
          <PanelTitle as="h1">
            Nothing lives here
            <PanelTitleSup className="font-mono tabular-nums">404</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            The page you asked for either moved or was never written.
          </PanelDescription>
        </PanelHeader>

        <figure className="relative">
          {/* The number is set in measured cells: lit where the site has
              something, an empty hairline frame everywhere else. The
              column-indexed delay comes with them, so the plate wipes in left
              to right rather than appearing all at once. */}
          <div className="p-4">
            <div
              role="img"
              aria-label="404, drawn as a grid of cells"
              className="glyph-grid"
              style={{ "--cols": FIELD.cols } as React.CSSProperties}
            >
              {FIELD.cells.map((lit, index) => (
                <div
                  key={index}
                  aria-hidden
                  className="glyph-cell"
                  data-recorded={lit ? undefined : "false"}
                  style={
                    {
                      "--level": LEVEL_ALPHA[4],
                      "--col": index % FIELD.cols,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="tracking-wide text-muted-foreground/80">
                Fig. 404.
              </span>
              <span>no route answered for this address</span>
            </span>
            {/* The one control on a page whose whole job is to send you
                somewhere else, so it is a button rather than a footnote —
                the reference's own 36px pill at its own measurements. */}
            <Link
              href="/"
              className="inline-flex h-9 shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-lg border border-line bg-foreground/[0.045] px-3 text-sm font-medium whitespace-nowrap text-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.98] dark:hover:bg-accent/50"
            >
              <ArrowLeft className="size-3.5" />
              Back home
            </Link>
          </figcaption>
        </figure>
      </Panel>

      {/* The page is shorter than the viewport, so the rail carries on down to
          the footer rather than stopping and leaving the frame in mid-air. No
          band here: the footer opens with its own, and two adjacent bands read
          as a double border. */}
      <div aria-hidden className="flex-1 border-x border-line" />
    </div>
  );
}
