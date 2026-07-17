import fallbackPayload from "@/data/ai-activity.fallback.json";
import {
  type AiActivityPayload,
  isAiActivityPayload,
  AI_ACTIVITY_TIMEZONE,
} from "@/lib/ai-activity-payload";
import { materializeAiActivity, type AiActivity } from "@/lib/ai-activity";
import { fetchPublishedAiActivityPayload } from "@/lib/ai-activity-store";

function payloadFromFallback(): AiActivityPayload {
  if (isAiActivityPayload(fallbackPayload)) return fallbackPayload;
  throw new Error(
    "data/ai-activity.fallback.json is missing or invalid — fix the seed file",
  );
}

/**
 * Load published (or fallback) history. Today’s live projection is applied
 * client-side so ISR cache does not freeze the day-fraction.
 */
export async function getAiActivityPayload(): Promise<{
  payload: AiActivityPayload;
  source: AiActivity["source"];
}> {
  const published = await fetchPublishedAiActivityPayload();
  if (published) return { payload: published, source: "blob" };
  return { payload: payloadFromFallback(), source: "fallback" };
}

/** @deprecated Prefer getAiActivityPayload + client materialize for live today. */
export async function getAiActivity(now = new Date()): Promise<AiActivity> {
  const { payload, source } = await getAiActivityPayload();
  return materializeAiActivity(payload, now, source);
}

export { AI_ACTIVITY_TIMEZONE };
