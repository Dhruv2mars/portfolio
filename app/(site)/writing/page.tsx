import type { Metadata } from "next";
import { SurfaceStub } from "@/components/surface-stub";

export const metadata: Metadata = {
  title: "Writing",
  description: "Long-form Writing that shows how Dhruv thinks and decides.",
};

export default function WritingPage() {
  return (
    <SurfaceStub
      title="Writing"
      lede="Long-form pieces that prove product sense. Index and MDX plumbing arrive next; this surface stays honest with no fake posts."
      note="Stub surface. Writing MDX platform lands in a follow-up ticket."
    />
  );
}
