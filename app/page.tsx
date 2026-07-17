import { HomeIntro } from "@/components/home-intro";
import { HomeAiActivity } from "@/components/home-ai-activity";
import { HomeSelectedProjects } from "@/components/home-selected-projects";
import { HomeWritings } from "@/components/home-writings";
import { composeHomeContentSections } from "@/lib/home";
import { getSelectedProjects } from "@/lib/projects";
import { getPublishedPosts } from "@/lib/writings";

export default function HomePage() {
  const sections = composeHomeContentSections({
    selectedProjectCount: getSelectedProjects().length,
    publishedPostCount: getPublishedPosts().length,
  });

  return (
    <div className="pb-16 sm:pb-20">
      {sections.map((section) => {
        switch (section) {
          case "intro":
            return <HomeIntro key={section} />;
          case "ai-activity":
            return <HomeAiActivity key={section} />;
          case "selected-projects":
            return <HomeSelectedProjects key={section} />;
          case "writings":
            return <HomeWritings key={section} />;
          default: {
            const _exhaustive: never = section;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
}
