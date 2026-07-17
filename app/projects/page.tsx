import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Shipped work as proof. The full editorial list lands here.",
};

export default function ProjectsPage() {
  return (
    <section className="pt-10 pb-16 sm:pt-14">
      <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground sm:text-[2rem]">
        Projects
      </h1>
      <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-muted">
        Project index coming next. Selected work will list here as outbound
        links.
      </p>
    </section>
  );
}
