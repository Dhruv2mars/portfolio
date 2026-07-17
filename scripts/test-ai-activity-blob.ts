import { put, list } from "@vercel/blob";
import { readFileSync } from "node:fs";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("missing BLOB_READ_WRITE_TOKEN");

const fallback = JSON.parse(
  readFileSync("data/ai-activity.fallback.json", "utf8"),
);
const payload = {
  ...fallback,
  generatedAt: new Date().toISOString(),
};

const blob = await put("ai-activity/latest.json", JSON.stringify(payload), {
  access: "public",
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: "application/json",
  token,
  cacheControlMaxAge: 60,
});
console.log("PUBLISH_OK", blob.url);
console.log("days", payload.days.length, "lifetime", payload.lifetimeTokens);

const listed = await list({ prefix: "ai-activity/", token, limit: 10 });
const match = listed.blobs.find((b) => b.pathname === "ai-activity/latest.json");
console.log("LIST_OK", Boolean(match?.url));

const res = await fetch(blob.url, { cache: "no-store" });
console.log("FETCH_STATUS", res.status);
const json = (await res.json()) as {
  version?: number;
  days?: unknown[];
  timezone?: string;
};
console.log(
  "FETCH_DAYS",
  json.days?.length,
  "version",
  json.version,
  "tz",
  json.timezone,
);
if (json.version !== 1 || !Array.isArray(json.days) || json.days.length < 1) {
  throw new Error("invalid payload roundtrip");
}
console.log("BLOB_ROUNDTRIP_PASS");
console.log(`BLOB_URL=${blob.url}`);
