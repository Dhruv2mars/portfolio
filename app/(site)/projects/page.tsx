import type { Metadata } from "next";
import { SurfaceStub } from "@/components/surface-stub";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work that proves shipping and taste.",
};

export default function ProjectsPage() {
  return (
    <SurfaceStub
      title="Projects"
      lede="An Editorial index of selected work — title, lede, link, and a still on every row. Catalog content lands next."
      note="Stub surface. Projects catalog lands in a follow-up ticket."
    />
  );
}
