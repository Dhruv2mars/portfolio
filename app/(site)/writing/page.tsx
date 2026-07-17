import type { Metadata } from "next";
import {
  WritingComingSoon,
  WritingIndexList,
} from "@/components/writing/writing-index";
import { getPublishedWriting } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Long-form Writing that shows how Dhruv thinks and decides.",
  alternates: {
    types: {
      "application/rss+xml": "/rss",
    },
  },
};

export default function WritingPage() {
  const pieces = getPublishedWriting();

  if (pieces.length === 0) {
    return <WritingComingSoon />;
  }

  return <WritingIndexList pieces={pieces} />;
}
