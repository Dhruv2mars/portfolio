import type { Metadata } from "next";
import { ProjectsSection } from "@/components/projects-section";

export const metadata: Metadata = {
  title: "Projects",
  description: "Everything I have built and would still defend in a code review.",
};

export default function ProjectsPage() {
  return (
    <div className="[--separator-height:--spacing(8)]">
      <ProjectsSection as="h1" />
    </div>
  );
}
