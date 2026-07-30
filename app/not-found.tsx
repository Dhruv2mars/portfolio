import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-16 pb-20 sm:pt-20">
      <p className="eyebrow mb-4">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="body-copy mt-4 max-w-[30rem]">
        That route does not exist. Head back home and try again.
      </p>
      <p className="mt-8">
        <Link href="/" className="link-underline text-[14px] font-medium">
          Home
        </Link>
      </p>
    </section>
  );
}
