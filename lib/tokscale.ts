import {
  AI_ACTIVITY_MAX_DAYS,
  AI_ACTIVITY_TIMEZONE,
  type AiActivityPayload,
  parseAiActivityPayload,
} from "@/lib/ai-activity-payload";

/**
 * The read side of `tokscale-sync`.
 *
 * The CLI meters every local agent session and publishes daily aggregates —
 * totals only, never a prompt or a transcript — to a Cloudflare Worker whose
 * read route is unauthenticated. That route is the record this site draws, and
 * it is the freshest one: the blob is yesterday's copy of the same numbers, and
 * the fixture is a snapshot of the day it was checked in.
 */
const DEFAULT_TOKSCALE_API =
  "https://tokscale-sync-api.dhruv-sharma10102005.workers.dev";

function tokscaleEndpoint(): string {
  const base = process.env.TOKSCALE_API_URL?.trim() || DEFAULT_TOKSCALE_API;
  return `${base.replace(/\/+$/, "")}/v1/daily`;
}

/**
 * Narrow the Worker response to the two fields this site publishes.
 *
 * The rows carry a cost and a message count as well; neither is drawn here and
 * neither is worth shipping to a browser, so they are dropped at the boundary
 * rather than filtered downstream. Rows are sparse — a date the meter never saw
 * is a day nothing ran — and the newest row is today, so an over-long history is
 * cut from the front.
 */
export function daysFromTokscaleResponse(
  value: unknown,
): { date: string; tokens: number }[] | null {
  if (!value || typeof value !== "object") return null;
  const raw = (value as { days?: unknown }).days;
  if (!Array.isArray(raw)) return null;

  const days: { date: string; tokens: number }[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return null;
    const { date, tokens } = entry as { date?: unknown; tokens?: unknown };
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return null;
    }
    if (typeof tokens !== "number" || !Number.isFinite(tokens) || tokens < 0) {
      return null;
    }
    days.push({ date, tokens });
  }
  if (days.length === 0) return null;

  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return days.slice(-AI_ACTIVITY_MAX_DAYS);
}

export function payloadFromTokscaleResponse(
  value: unknown,
  generatedAt: string,
): AiActivityPayload | null {
  const days = daysFromTokscaleResponse(value);
  if (!days) return null;

  return parseAiActivityPayload({
    version: 1,
    generatedAt,
    timezone: AI_ACTIVITY_TIMEZONE,
    days,
    // The Worker publishes the window it holds, so the lifetime total is that
    // window's sum rather than a number it reports separately.
    lifetimeTokens: days.reduce((sum, day) => sum + day.tokens, 0),
  });
}

export async function fetchTokscaleAiActivityPayload(): Promise<AiActivityPayload | null> {
  const url = tokscaleEndpoint();
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[ai-activity] tokscale fetch HTTP ${res.status} for ${url}`);
      return null;
    }
    const payload = payloadFromTokscaleResponse(
      await res.json(),
      new Date().toISOString(),
    );
    if (!payload) {
      console.warn("[ai-activity] tokscale payload failed validation");
      return null;
    }
    return payload;
  } catch (error) {
    console.warn("[ai-activity] tokscale fetch failed", error);
    return null;
  }
}
