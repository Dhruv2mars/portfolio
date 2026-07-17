import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings",
  description: "Product thinking in writing. Posts will land here.",
};

export default function WritingsPage() {
  return (
    <section className="pt-10 pb-16 sm:pt-14">
      <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
        Writings
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted">
        No Posts published yet. This surface stays ready for when they land.
      </p>
    </section>
  );
}
