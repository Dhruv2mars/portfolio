import { contactLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__credit">{site.name}</p>
        <div className="site-contact site-contact--footer">
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
      </div>
    </footer>
  );
}
