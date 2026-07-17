import { list, put } from "@vercel/blob";
import {
  AI_ACTIVITY_BLOB_PATH,
  type AiActivityPayload,
  isAiActivityPayload,
} from "@/lib/ai-activity-payload";

export async function publishAiActivityPayload(
  payload: AiActivityPayload,
): Promise<{ url: string }> {
  if (!isAiActivityPayload(payload)) {
    throw new Error("Invalid AI Activity payload");
  }
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

async function resolveBlobUrl(token?: string): Promise<string | null> {
  if (process.env.AI_ACTIVITY_BLOB_URL) {
    return process.env.AI_ACTIVITY_BLOB_URL;
  }
  if (process.env.NEXT_PUBLIC_AI_ACTIVITY_BLOB_URL) {
    return process.env.NEXT_PUBLIC_AI_ACTIVITY_BLOB_URL;
  }
  if (!token) return null;

  try {
    const { blobs } = await list({
      prefix: "ai-activity/",
      token,
      limit: 20,
    });
    const match = blobs.find((b) => b.pathname === AI_ACTIVITY_BLOB_PATH);
    return match?.url ?? null;
  } catch {
    return null;
  }
}

export async function fetchPublishedAiActivityPayload(): Promise<AiActivityPayload | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const url = await resolveBlobUrl(token);
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return isAiActivityPayload(json) ? json : null;
  } catch {
    return null;
  }
}
