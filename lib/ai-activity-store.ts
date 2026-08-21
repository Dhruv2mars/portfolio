import { put } from "@vercel/blob";
import fallbackPayload from "@/data/ai-activity.fallback.json";
import {
  AI_ACTIVITY_BLOB_PATH,
  type AiActivityPayload,
  parseAiActivityPayload,
} from "@/lib/ai-activity-payload";
import type { AiActivitySource } from "@/lib/ai-activity";
import { fetchTokscaleAiActivityPayload } from "@/lib/tokscale";

export async function publishAiActivityPayload(
  payload: AiActivityPayload,
): Promise<{ url: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const blob = await put(AI_ACTIVITY_BLOB_PATH, JSON.stringify(payload), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
    cacheControlMaxAge: 3600,
  });

  return { url: blob.url };
}

function payloadFromFallback(): AiActivityPayload {
  const parsed = parseAiActivityPayload(fallbackPayload);
  if (!parsed) {
    throw new Error(
      "data/ai-activity.fallback.json is missing or invalid — fix the seed file",
    );
  }
  return parsed;
}

export async function fetchPublishedAiActivityPayload(): Promise<AiActivityPayload | null> {
  const url = process.env.AI_ACTIVITY_BLOB_URL;
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[ai-activity] blob fetch HTTP ${res.status} for ${url}`);
      return null;
    }
    const json: unknown = await res.json();
    const parsed = parseAiActivityPayload(json);
    if (!parsed) {
      console.warn("[ai-activity] blob payload failed validation");
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn("[ai-activity] blob fetch failed", error);
    return null;
  }
}

/**
 * Load published (or fallback) history. Today’s live projection is applied
 * client-side so ISR cache does not freeze the day-fraction.
 *
 * Source order is tokscale → blob → fixture, freshest first. The Worker is the
 * meter's own read route and holds today; the blob is last night's copy of the
 * same numbers and is what answers when the Worker is unreachable; the fixture
 * is the day it was checked in, and exists so the page never has a hole in it.
 * Every step down is a step backward in time, never a step into invented data.
 */
export async function getAiActivityPayload(): Promise<{
  payload: AiActivityPayload;
  source: AiActivitySource;
}> {
  const live = await fetchTokscaleAiActivityPayload();
  if (live) return { payload: live, source: "tokscale" };

  const published = await fetchPublishedAiActivityPayload();
  if (published) return { payload: published, source: "blob" };

  return { payload: payloadFromFallback(), source: "fallback" };
}
