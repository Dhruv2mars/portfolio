import type { Metadata } from "next";
import { ContactLinks } from "@/components/contact-links";
import { TokenActivitySection } from "@/components/token-activity-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: site.description,
};

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <h1 id="home-hero-title" className="home-hero__title">
          {site.name}
        </h1>
        <p className="home-hero__lede">
          AI-pilled design engineer with product sense.
        </p>
        <ContactLinks className="site-contact home-hero__contact" />
      </section>

      <TokenActivitySection />
    </div>
  );
}
