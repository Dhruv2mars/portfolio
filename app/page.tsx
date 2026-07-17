import { HomeIntro } from "@/components/home-intro";
import { HomeSelectedProjects } from "@/components/home-selected-projects";
import { HomeWritings } from "@/components/home-writings";

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <HomeSelectedProjects />
      <HomeWritings />
    </>
  );
}
