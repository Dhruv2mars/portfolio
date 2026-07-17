import { HomeIntro } from "@/components/home-intro";
import { HomeAiActivity } from "@/components/home-ai-activity";
import { HomeSelectedProjects } from "@/components/home-selected-projects";
import { HomeWritings } from "@/components/home-writings";

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <HomeAiActivity />
      <HomeSelectedProjects />
      <HomeWritings />
    </>
  );
}
