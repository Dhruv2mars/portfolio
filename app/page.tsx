import { projects } from "@/lib/projects";

export default function Page() {
  return (
    <main className="container-narrow mx-auto px-6 py-12">
      <h1 className="mb-6">Dhruv Sharma</h1>

      <section className="space-y-4">
        <p>
          <strong>AI-first builder.</strong> <strong>Prototype junkie.</strong>{' '}
          <strong>Feedback addict.</strong> I turn half-baked ideas into real,
          usable products — fast. I build, break, and rebuild until the product
          earns its place. Speed is my language; iteration is my art.
        </p>

        <p>
          I’m <strong>@Dhruv2mars</strong> on{' '}
          <a href="https://x.com/Dhruv2mars" target="_blank" rel="noopener noreferrer">X</a>,{' '}
          <a href="https://github.com/Dhruv2mars" target="_blank" rel="noopener noreferrer">GitHub</a>, and{' '}
          <a href="http://linkedin.com/in/dhruv2mars" target="_blank" rel="noopener noreferrer">LinkedIn</a>. You can also{' '}
          <a href="mailto:Dhruv2mars@gmail.com" target="_blank" rel="noopener noreferrer">email me</a>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4">Projects</h2>
        <ul className="list-disc marker:text-gray-500 pl-5 space-y-2">
          {projects.map((p) => {
            const displayName = p.name
              ? p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase()
              : "";
            return (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {displayName}
                </a>{' '}
                — {p.description}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
