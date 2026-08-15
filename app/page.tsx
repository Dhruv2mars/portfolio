import { ActivitySection } from "@/components/activity-section";
import { Masthead } from "@/components/masthead";
import { ProjectsSection } from "@/components/projects-section";

/** Matches the AI Activity blob's own cache window. */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Masthead />
      <ActivitySection />
      <ProjectsSection />
    </>
  );
}
