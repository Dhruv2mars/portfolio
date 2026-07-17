import type { Metadata } from "next";
import { SurfaceStub } from "@/components/surface-stub";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: site.description,
};

export default function HomePage() {
  return (
    <SurfaceStub
      title={site.name}
      lede="AI-pilled design engineer. Home will carry selected proof — Token activity, Projects, and Writing — in an Editorial composition."
      note="Stub surface. Full Home composition lands in a follow-up ticket."
    />
  );
}
