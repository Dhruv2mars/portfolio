import { put, list } from "@vercel/blob";
import { readFileSync } from "node:fs";
import { isAiActivityPayload } from "../lib/ai-activity-payload";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("missing BLOB_READ_WRITE_TOKEN");

const fallback: unknown = JSON.parse(
  readFileSync("data/ai-activity.fallback.json", "utf8"),
);
if (!isAiActivityPayload(fallback)) {
  throw new Error("fallback payload failed validation");
}

const payload = {
  ...fallback,
  generatedAt: new Date().toISOString(),
};
if (!isAiActivityPayload(payload)) {
  throw new Error("test payload failed validation");
}

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
const json: unknown = await res.json();
if (!isAiActivityPayload(json)) {
  throw new Error("invalid payload roundtrip");
}
console.log(
  "FETCH_DAYS",
  json.days.length,
  "version",
  json.version,
  "tz",
  json.timezone,
);
console.log("BLOB_ROUNDTRIP_PASS");
console.log(`BLOB_URL=${blob.url}`);
