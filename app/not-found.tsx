import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-10 pb-16 sm:pt-14">
      <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
        Page not found
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted">
        That route does not exist. Head back home and try again.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Home
        </Link>
      </p>
    </section>
  );
}
