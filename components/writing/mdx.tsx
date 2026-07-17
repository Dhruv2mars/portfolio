import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { highlight } from "sugar-high";

function Table({
  data,
}: {
  data: { headers: string[]; rows: string[][] };
}) {
  return (
    <table>
      <thead>
        <tr>
          {data.headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CustomLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string },
) {
  const href = props.href ?? "";

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: React.ComponentProps<typeof Image>) {
  return <Image {...props} alt={props.alt ?? ""} className="writing-image" />;
}

function Code({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const codeHTML = highlight(String(children));
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createHeading(level: number) {
  const Heading = ({ children }: { children?: React.ReactNode }) => {
    const slug = slugify(String(children));
    return React.createElement(
      `h${level}`,
      { id: slug },
      React.createElement("a", {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: "writing-anchor",
      }),
      children,
    );
  };

  Heading.displayName = `Heading${level}`;
  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
};

export function WritingMDX({
  source,
  components: extra,
}: {
  source: string;
  components?: Record<string, React.ComponentType>;
}) {
  return (
    <MDXRemote
      source={source}
      components={{ ...components, ...(extra ?? {}) }}
    />
  );
}
