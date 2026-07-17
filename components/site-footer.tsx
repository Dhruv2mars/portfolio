import { ContactLinks } from "@/components/contact-links";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__credit">{site.name}</p>
        <ContactLinks className="site-contact site-contact--footer" />
      </div>
    </footer>
  );
}
