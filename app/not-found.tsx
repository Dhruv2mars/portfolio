import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-14 pb-20 sm:pt-16">
      <p className="meta-copy mb-4">404</p>
      <h1 className="display-title">Page not found</h1>
      <p className="body-copy mt-5 max-w-[32rem]">
        That route does not exist. Head back home and try again.
      </p>
      <p className="mt-8">
        <Link href="/" className="link-editorial text-[14px] font-medium">
          Home
        </Link>
      </p>
    </section>
  );
}
