import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/components/panel";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <Panel>
        <PanelHeader>
          <PanelTitle>
            Nothing lives here
            <PanelTitleSup className="font-mono tabular-nums">404</PanelTitleSup>
          </PanelTitle>
          <PanelDescription>
            The page you asked for either moved or never existed.
          </PanelDescription>
        </PanelHeader>

        <PanelContent>
          <Link
            href="/"
            className="link-underline extend-touch-target inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back home
          </Link>
        </PanelContent>
      </Panel>

      {/* The page is shorter than the viewport, so the rail carries on down to
          the footer rather than stopping and leaving the frame in mid-air. No
          band here: the footer opens with its own, and two adjacent bands read
          as a double border. */}
      <div aria-hidden className="flex-1 border-x border-line" />
    </div>
  );
}
