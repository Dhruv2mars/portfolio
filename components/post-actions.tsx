"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChatIcon,
  CheckIcon,
  ChevronIcon,
  CopyIcon,
  DocumentIcon,
  LinkedinIcon,
  LinkIcon,
  ShareIcon,
  XIcon,
} from "@/components/icons";
import { Menu, MenuItem, MenuLink, MenuSeparator } from "@/components/menu";

export type PostNeighbour = { slug: string; title: string } | null;

/** Long enough to read, short enough that the button is a button again soon. */
const RESET_AFTER = 1600;

function useTransient(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = window.setTimeout(() => setOn(false), RESET_AFTER);
    return () => window.clearTimeout(timer);
  }, [on]);
  return [on, () => setOn(true)];
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Denied permission, or an insecure origin. The caller says nothing rather
    // than claiming a success that did not happen.
    return false;
  }
}

/**
 * Everything you can do to a post that is not reading it: take it with you,
 * pass it on, or move to the one either side.
 *
 * They live in one row above the title because they are about the document
 * rather than in it — putting them after the body would mean scrolling a
 * thousand words to share something you decided to share in the first
 * paragraph.
 */
export function PostActions({
  markdown,
  rawUrl,
  url,
  title,
  newer,
  older,
}: {
  /** The post as source, already assembled — see `postMarkdown`. */
  markdown: string;
  /** Absolute, because it is handed to a model that has to go and fetch it. */
  rawUrl: string;
  url: string;
  title: string;
  newer: PostNeighbour;
  older: PostNeighbour;
}) {
  const router = useRouter();
  const [copiedPage, markCopiedPage] = useTransient();
  const [copiedLink, markCopiedLink] = useTransient();
  // The server has no navigator, and a desktop browser has no share sheet, so
  // the item is drawn only where it leads somewhere. Read through
  // `useSyncExternalStore` rather than an effect: the value never changes, it
  // is simply unknown until hydration, which is exactly what a server snapshot
  // of `false` says.
  const canShare = useSyncExternalStore(
    () => () => {},
    () => "share" in navigator,
    () => false,
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // A menu, a search field or the palette already claimed this key.
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      const to =
        event.key === "ArrowLeft"
          ? newer
          : event.key === "ArrowRight"
            ? older
            : null;
      if (!to) return;
      event.preventDefault();
      router.push(`/blog/${to.slug}`);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [newer, older, router]);

  const prompt = `Read ${rawUrl}, I want to ask questions about it.`;

  return (
    <div className="flex items-center gap-1">
      <div className="inline-flex shrink-0 overflow-visible rounded-lg bg-accent-muted ring-1 ring-inset ring-line/70">
        <button
          type="button"
          onClick={async () => {
            if (await copy(markdown)) markCopiedPage();
          }}
          title="Copy this post as Markdown"
          className="post-action-button rounded-none px-2 text-[0.8125rem] leading-[1.5] font-medium"
        >
          {copiedPage ? <CheckIcon /> : <CopyIcon />}
          <span className="max-sm:sr-only">
            {copiedPage ? "Copied" : "Copy page"}
          </span>
        </button>

        <Menu
          label="More copy options"
          trigger={<ChevronIcon />}
          triggerVariant="compact"
          className="border-l border-line/70"
          triggerClassName="rounded-none px-1.5"
        >
          <MenuLink href={rawUrl}>
            <DocumentIcon />
            View as Markdown
          </MenuLink>
          <MenuSeparator />
          <MenuLink
            href={`https://chatgpt.com/?hint=search&q=${encodeURIComponent(prompt)}`}
          >
            <ChatIcon />
            Open in ChatGPT
          </MenuLink>
          <MenuLink href={`https://claude.ai/new?q=${encodeURIComponent(prompt)}`}>
            <ChatIcon />
            Open in Claude
          </MenuLink>
        </Menu>
      </div>

      <Menu
        label="Share this post"
        trigger={<ShareIcon />}
        triggerVariant="compact"
        triggerClassName="rounded-lg px-1.5"
      >
        <MenuItem
          onClick={async () => {
            if (await copy(url)) markCopiedLink();
          }}
        >
          {copiedLink ? <CheckIcon /> : <LinkIcon />}
          {copiedLink ? "Link copied" : "Copy link"}
        </MenuItem>
        {canShare ? (
          <MenuItem
            onClick={() => {
              // A cancelled share sheet rejects; that is the Visitor changing
              // their mind, not a failure to report.
              void navigator.share({ title, url }).catch(() => {});
            }}
          >
            <ShareIcon />
            Share via…
          </MenuItem>
        ) : null}
        <MenuSeparator />
        <MenuLink
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        >
          <XIcon />
          Share on X
        </MenuLink>
        <MenuLink
          href={`https://www.linkedin.com/sharing/share-offsite?url=${encodeURIComponent(url)}`}
        >
          <LinkedinIcon />
          Share on LinkedIn
        </MenuLink>
      </Menu>

      <Neighbour post={newer} direction="newer" />
      <Neighbour post={older} direction="older" />
    </div>
  );
}

/**
 * The arrows are named for where they land, not for their position in the
 * feed: "previous" in a list that runs newest-first is a coin toss, and the
 * label is the only thing telling the Visitor which way time runs.
 *
 * Missing neighbours stay out of the toolbar. A dead arrow is visual noise,
 * especially on a one-post blog, and a live arrow keeps its meaning obvious.
 */
function Neighbour({
  post,
  direction,
}: {
  post: PostNeighbour;
  direction: "newer" | "older";
}) {
  const Icon = direction === "newer" ? ArrowLeft : ArrowRight;
  const label =
    direction === "newer" ? "Newer post (←)" : "Older post (→)";

  if (!post) return null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`${label}: ${post.title}`}
      title={`${label} — ${post.title}`}
      className="post-action-button rounded-lg px-1.5"
    >
      <Icon />
    </Link>
  );
}
