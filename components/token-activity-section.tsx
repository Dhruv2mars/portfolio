"use client";

import { useState } from "react";
import { TokenActivity } from "@/components/token-activity";
import {
  buildTokenActivityViewModel,
  tokenActivityFixture,
  type TokenActivityRange,
} from "@/lib/token-activity";

type TokenActivitySectionProps = {
  initialRange?: TokenActivityRange;
};

/** Fixture-backed Token activity for Home (ADR-0004, ADR-0008). */
export function TokenActivitySection({
  initialRange = "daily",
}: TokenActivitySectionProps) {
  const [range, setRange] = useState<TokenActivityRange>(initialRange);
  const model = buildTokenActivityViewModel(tokenActivityFixture, range);

  return <TokenActivity model={model} onRangeChange={setRange} />;
}
