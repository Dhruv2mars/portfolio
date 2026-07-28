"use client";

import { useEffect, useRef, useState } from "react";

const RESET_MS = 1400;

type CopyEmailProps = {
  mail: string;
  className?: string;
};

/**
 * Email, but useful — click copies instead of opening a mail client.
 * Reads like every other mono social; label swaps to confirm.
 */
export function CopyEmail({ mail, className }: CopyEmailProps) {
  const address = mail.replace(/^mailto:/, "");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <a
      href={mail}
      className={className}
      aria-label={`Copy email address ${address}`}
      aria-live="polite"
      onClick={(event) => {
        event.preventDefault();
        void navigator.clipboard
          .writeText(address)
          .then(() => {
            setCopied(true);
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), RESET_MS);
          })
          .catch(() => {
            window.location.href = mail;
          });
      }}
    >
      <span className="inline-block min-w-[3.4ch]">
        {copied ? "Copied" : "Email"}
      </span>
    </a>
  );
}
