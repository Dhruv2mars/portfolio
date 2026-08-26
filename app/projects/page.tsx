import type { Metadata } from "next";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/panel";
import { ProjectSearch } from "@/components/project-search";
import { serializeJsonLd } from "@/lib/json-ld";
import { getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Everything I have built and would still defend in a code review.",
  alternates: { canonical: `${site.url}/projects` },
};

/**
 * The projects index, built the way the blog index is: one panel, an `h1` that
 * says the word the nav promised, a count, and a filter over the whole list.
 * The two are the same kind of page — a Visitor who has used one should not
 * have to learn the other.
 */
type ProjectsPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const projects = [...getProjects()];

  const params = await searchParams;
  const initialQuery = Array.isArray(params?.q)
    ? (params.q[0] ?? "")
    : (params?.q ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${site.url}/projects`,
    name: "Projects",
    url: `${site.url}/projects`,
    author: { "@type": "Person", name: site.name, url: site.url },
    hasPart: projects.map((project) => ({
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.description,
      codeRepository: project.url,
      programmingLanguage: project.language,
      url: project.live ?? project.url,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Panel id="projects">
        <PanelHeader>
          <PanelTitle as="h1">
            Projects
            <PanelTitleSup className="tabular-nums">
              {projects.length}
            </PanelTitleSup>
          </PanelTitle>
        </PanelHeader>

        <ProjectSearch projects={projects} initialQuery={initialQuery} />
      </Panel>
    </div>
  );
}
