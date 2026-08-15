import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="reveal pt-14 sm:pt-20">
      <p className="font-mono text-2xs text-dim">404</p>
      <h1 className="mt-4 text-2xl font-medium tracking-tight">
        Nothing lives here.
      </h1>
      <p className="mt-3 max-w-[52ch] text-base text-muted">
        The page you asked for either moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-1.5 font-mono text-2xs text-dim transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        back home
      </Link>
    </section>
  );
}
