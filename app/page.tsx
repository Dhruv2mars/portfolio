import { ActivitySection } from "@/components/activity-section";
import { BlogSection, HOME_POST_LIMIT } from "@/components/blog-section";
import { Overview } from "@/components/overview";
import { ProfileHeader } from "@/components/profile-header";
import {
  HOME_PROJECT_LIMIT,
  ProjectsSection,
} from "@/components/projects-section";
import { getPublishedPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Matches the AI Activity blob's own cache window. */
export const revalidate = 3600;

/**
 * The hatched band between panels. It is load-bearing: it is what makes the
 * page read as one continuous sheet with cut-outs rather than as stacked cards.
 */
function PanelDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "stripe-divider h-(--separator-height) w-full border-x border-line",
        className,
      )}
    />
  );
}

export default function Home() {
  // Nothing empty is ever shown: with no Post published there is no Blog
  // panel, the same rule the nav and `/blog` itself follow.
  const hasPosts = getPublishedPosts().length > 0;

  return (
    <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
      <ProfileHeader />

      {/* The reference bands the hero off from the panels, then runs identity —
          overview, links, the contribution grid — as one uninterrupted block
          before the next band. The bands group panels; they do not separate
          every one of them. */}
      <PanelDivider />
      <Overview />
      <ActivitySection />

      <PanelDivider />
      <ProjectsSection limit={HOME_PROJECT_LIMIT} />

      {hasPosts ? (
        <>
          <PanelDivider />
          <BlogSection limit={HOME_POST_LIMIT} />
        </>
      ) : null}
      {/* No trailing divider. Bands go *between* panels; the footer opens with
          its own, and two adjacent bands read as a double border. */}
    </div>
  );
}
