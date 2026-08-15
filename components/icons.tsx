import type { SVGProps } from "react";

/**
 * Hand-drawn, single-weight, 16px grid. Social links are words rather than
 * brand marks, so this set stays deliberately small.
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
