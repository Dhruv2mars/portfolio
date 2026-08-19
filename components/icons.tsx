import type { SVGProps } from "react";

/**
 * Two families, deliberately. UI glyphs are drawn stroked on a 16px grid at a
 * single weight; brand marks are the official filled outlines on a 24px grid,
 * because a redrawn logo is a wrong logo.
 */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

function BrandIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* UI                                                                          */
/* -------------------------------------------------------------------------- */

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 11 11 5" />
      <path d="M6 5h5v5" />
    </Icon>
  );
}

export function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 8H4" />
      <path d="M7 5 4 8l3 3" />
    </Icon>
  );
}

export function ArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 12V4" />
      <path d="M5 7l3-3 3 3" />
    </Icon>
  );
}

export function Sun(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.2M8 13.3v1.2M14.5 8h-1.2M2.7 8H1.5M12.6 3.4l-.85.85M4.25 11.75l-.85.85M12.6 12.6l-.85-.85M4.25 4.25l-.85-.85" />
    </Icon>
  );
}

export function Moon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z" />
    </Icon>
  );
}

export function Rss(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 3a10 10 0 0 1 10 10" />
      <path d="M3 7.5A5.5 5.5 0 0 1 8.5 13" />
      <circle cx="3.6" cy="12.4" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** External destination marker on a row. */
export function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6.75 9.25a2.5 2.5 0 0 0 3.66.25l2-2a2.5 2.5 0 0 0-3.54-3.54l-1.1 1.1" />
      <path d="M9.25 6.75a2.5 2.5 0 0 0-3.66-.25l-2 2a2.5 2.5 0 0 0 3.54 3.54l1.1-1.1" />
    </Icon>
  );
}

/** Stands in for an end date that has not happened. */
export function InfinityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 8s-.9-2.4-2.6-2.4a2.4 2.4 0 0 0 0 4.8C7.1 10.4 8 8 8 8s.9-2.4 2.6-2.4a2.4 2.4 0 0 1 0 4.8C8.9 10.4 8 8 8 8Z" />
    </Icon>
  );
}

/** The default tile glyph for a row with no icon of its own. */
export function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 1.9 13.6 5v6L8 14.1 2.4 11V5Z" />
      <path d="M2.4 5 8 8.1 13.6 5" />
      <path d="M8 8.1v6" />
    </Icon>
  );
}

export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M13 6.5c0 3.5-3.66 6.94-4.6 7.73a.62.62 0 0 1-.8 0C6.66 13.44 3 10 3 6.5a5 5 0 0 1 10 0" />
      <circle cx="8" cy="6.5" r="2" />
    </Icon>
  );
}

/**
 * A clock face whose hands are drawn from an actual time — see `handsPath`.
 * Without one it renders no hands rather than a wrong pair, which is the only
 * honest thing an unset clock can show.
 */
export function ClockIcon({
  hands,
  ...props
}: SVGProps<SVGSVGElement> & { hands?: string }) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="6.5" />
      <path d={hands} />
    </Icon>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="7.25" cy="7.25" r="4.75" />
      <path d="m10.75 10.75 3 3" />
    </Icon>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5v-1a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5V9A1.5 1.5 0 0 0 4 10.5h1" />
    </Icon>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m3.5 8.5 3 3 6-7" />
    </Icon>
  );
}

/* -------------------------------------------------------------------------- */
/* Project kinds                                                               */
/*                                                                             */
/* One glyph per kind of thing a project is, so the gutter tile carries a fact  */
/* about the row rather than repeating the brand mark eight times.             */
/* -------------------------------------------------------------------------- */

export function TerminalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="1.9" y="2.9" width="12.2" height="10.2" rx="1.6" />
      <path d="m5 6.5 2 1.75L5 10" />
      <path d="M8.75 10.25h2.5" />
    </Icon>
  );
}

export function QueueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 1.9 14.1 5 8 8.1 1.9 5Z" />
      <path d="m1.9 8 6.1 3.1L14.1 8" />
      <path d="m1.9 11 6.1 3.1L14.1 11" />
    </Icon>
  );
}

export function DeviceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="4.4" y="1.9" width="7.2" height="12.2" rx="1.6" />
      <path d="M7 12.4h2" />
    </Icon>
  );
}

export function ServerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="1.9" y="2.4" width="12.2" height="4.6" rx="1.4" />
      <rect x="1.9" y="9" width="12.2" height="4.6" rx="1.4" />
      <path d="M4.4 4.7h.01M4.4 11.3h.01" />
    </Icon>
  );
}

export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M9 1.9H4.5a1.6 1.6 0 0 0-1.6 1.6v9a1.6 1.6 0 0 0 1.6 1.6h7a1.6 1.6 0 0 0 1.6-1.6V6Z" />
      <path d="M9 1.9V6h4.1" />
      <path d="M5.75 9.25h4.5M5.75 11.5h3" />
    </Icon>
  );
}

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="1.4" />
      <path d="M8 2.4v11.2M2.4 8h11.2" />
    </Icon>
  );
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M13.6 9.4a1.6 1.6 0 0 1-1.6 1.6H5.6L2.4 14.1V4a1.6 1.6 0 0 1 1.6-1.6h8a1.6 1.6 0 0 1 1.6 1.6Z" />
    </Icon>
  );
}

export function WindowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="1.9" y="2.9" width="12.2" height="10.2" rx="1.6" />
      <path d="M1.9 6.2h12.2" />
      <path d="M4.3 4.55h.01M6.3 4.55h.01" />
    </Icon>
  );
}

/* -------------------------------------------------------------------------- */
/* Brands                                                                      */
/* -------------------------------------------------------------------------- */

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </BrandIcon>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </BrandIcon>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </BrandIcon>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
      <path d="m2.4 4.6 5.05 3.6a1 1 0 0 0 1.1 0l5.05-3.6" />
    </Icon>
  );
}

/** Every social link resolves to exactly one of these. */
export const SOCIAL_ICONS = {
  X: XIcon,
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Email: MailIcon,
} as const;
