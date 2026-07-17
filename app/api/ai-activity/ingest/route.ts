import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  parseAiActivityPayload,
  payloadDaysWithinHistory,
} from "@/lib/ai-activity-payload";
import { publishAiActivityPayload } from "@/lib/ai-activity-store";

export const runtime = "nodejs";

function secretsEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

function authorize(req: Request): boolean {
  const expected = process.env.AI_ACTIVITY_INGEST_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return secretsEqual(header.slice("Bearer ".length), expected);
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = parseAiActivityPayload(body);
  if (!payload || !payloadDaysWithinHistory(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const { url } = await publishAiActivityPayload(payload);
    return NextResponse.json({
      ok: true,
      url,
      days: payload.days.length,
      lifetimeTokens: payload.lifetimeTokens,
      generatedAt: payload.generatedAt,
    });
  } catch (error) {
    console.error("AI Activity ingest failed", error);
    return NextResponse.json(
      { error: "Publish failed" },
      { status: 500 },
    );
  }
}
