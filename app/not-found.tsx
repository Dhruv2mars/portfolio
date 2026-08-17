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
    <div className="[--separator-height:--spacing(8)]">
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

      <div
        aria-hidden
        className="stripe-divider screen-line-bottom h-(--separator-height) w-full border-x border-line"
      />
    </div>
  );
}
