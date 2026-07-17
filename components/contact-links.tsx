import { contactLinks } from "@/lib/site";

type ContactLinksProps = {
  className?: string;
};

export function ContactLinks({ className }: ContactLinksProps) {
  return (
    <div className={className ?? "site-contact"}>
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="site-contact__link"
          {...(link.href.startsWith("mailto:")
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
