import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-14 pb-20 sm:pt-20">
      <p className="section-title mb-4">404</p>
      <h1 className="display-title">Page not found</h1>
      <p className="body-copy mt-5 max-w-[32rem]">
        That route does not exist. Head back home and try again.
      </p>
      <p className="mt-8 font-mono text-[12px] tracking-[-0.01em]">
        <Link
          href="/"
          className="inline-flex min-h-8 items-center text-muted no-underline underline-offset-[3px] decoration-current/0 transition-[color,text-decoration-color] duration-150 ease-[var(--ease-out-quad)] hover:text-foreground hover:underline hover:decoration-current/40"
        >
          ← Home
        </Link>
      </p>
      <p className="meta-copy mt-6">
        or press ⌘K to go anywhere from here
      </p>
    </section>
  );
}
