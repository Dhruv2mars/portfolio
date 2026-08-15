import { HomeIntro } from "@/components/home-intro";
import { HomeAiActivity } from "@/components/home-ai-activity";
import { HomeSelectedProjects } from "@/components/home-selected-projects";
import { HomeBlog } from "@/components/home-blog";
import { Field, Rule } from "@/components/ledger";
import { Reveal } from "@/components/reveal";
import { composeHomeContentSections } from "@/lib/home";
import { getSelectedProjects } from "@/lib/projects";
import { getPublishedPosts } from "@/lib/blog";

/** Pick up nightly Blob publishes without a redeploy. */
export const revalidate = 3600;

/**
 * Home. The fold must have an event (DESIGN.md §4 §FIX-1): at 1440×900 the
 * lifetime numeral AND the complete year grid are both fully visible without
 * scrolling, and the numeral is the largest element on screen.
 *
 * Spacing below is the 20px lattice. No eyeballed numbers.
 */
export default function HomePage() {
  const sections = composeHomeContentSections({
    selectedProjectCount: getSelectedProjects().length,
    publishedPostCount: getPublishedPosts().length,
  });

  const has = (id: string) => sections.includes(id as never);

  return (
    <div style={{ paddingTop: 100 }}>
      {has("intro") ? (
        <Reveal as="section">
          <Field>
            <HomeIntro />
          </Field>
        </Reveal>
      ) : null}

      {has("ai-activity") ? (
        <Reveal as="section" delay={60}>
          <Field className="mt-[60px]">
            <Rule />
            <div style={{ paddingTop: 20 }}>
              <HomeAiActivity />
            </div>
          </Field>
        </Reveal>
      ) : null}

      {has("selected-projects") ? (
        <Reveal as="section" delay={120}>
          <Field className="mt-[80px]">
            <Rule />
            <div style={{ paddingTop: 40 }}>
              <HomeSelectedProjects />
            </div>
          </Field>
        </Reveal>
      ) : null}

      {has("blog") ? (
        <Reveal as="section" delay={180}>
          <Field className="mt-[120px]">
            <HomeBlog />
          </Field>
        </Reveal>
      ) : null}

      <div style={{ height: 160 }} />
    </div>
  );
}
