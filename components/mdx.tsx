import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSanitize from "rehype-sanitize";
import { highlight } from "sugar-high";
import React from "react";
import { isSafeHref } from "@/lib/mdx-links";

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";

  if (!isSafeHref(href)) {
    return <span>{props.children}</span>;
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
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
  const { alt = "", className, ...rest } = props;
  return <Image alt={alt} className={`rounded-md ${className ?? ""}`} {...rest} />;
}

function Code({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const codeHTML = highlight(String(children));
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function textFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return textFromChildren(child.props.children);
      }
      return "";
    })
    .join("");
}

function slugify(str: unknown): string {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  function Heading({ children }: { children?: React.ReactNode }) {
    const slug = slugify(textFromChildren(children));
    return React.createElement(
      `h${level}`,
      { id: slug },
      React.createElement("a", {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: "anchor",
        "aria-hidden": true,
        tabIndex: -1,
      }),
      children,
    );
  }
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
};

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        ...props.options,
        mdxOptions: {
          ...props.options?.mdxOptions,
          rehypePlugins: [
            ...(props.options?.mdxOptions?.rehypePlugins ?? []),
            rehypeSanitize,
          ],
        },
      }}
    />
  );
}
