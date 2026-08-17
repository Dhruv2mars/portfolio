import { ActivitySection } from "@/components/activity-section";
import { Overview, SocialLinks } from "@/components/overview";
import { ProfileHeader } from "@/components/profile-header";
import { ProjectsSection } from "@/components/projects-section";
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
  return (
    <div className="[--separator-height:--spacing(8)] **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+var(--separator-height))]">
      <ProfileHeader />
      <Overview />
      <SocialLinks />

      <PanelDivider />
      <ActivitySection />

      <PanelDivider />
      <ProjectsSection />

      <PanelDivider className="screen-line-bottom" />
    </div>
  );
}
