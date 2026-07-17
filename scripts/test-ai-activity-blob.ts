import { readFileSync } from "node:fs";
import { parseAiActivityPayload } from "../lib/ai-activity-payload";
import { publishAiActivityPayload } from "../lib/ai-activity-store";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("missing BLOB_READ_WRITE_TOKEN");

const fallback = parseAiActivityPayload(
  JSON.parse(readFileSync("data/ai-activity.fallback.json", "utf8")),
);
if (!fallback) throw new Error("fallback payload failed validation");

const payload = parseAiActivityPayload({
  ...fallback,
  generatedAt: new Date().toISOString(),
});
if (!payload) throw new Error("test payload failed validation");

const { url } = await publishAiActivityPayload(payload);
console.log("PUBLISH_OK", url);
console.log("days", payload.days.length, "lifetime", payload.lifetimeTokens);

const res = await fetch(url, { cache: "no-store" });
console.log("FETCH_STATUS", res.status);
const json = parseAiActivityPayload(await res.json());
if (!json) throw new Error("invalid payload roundtrip");
console.log(
  "FETCH_DAYS",
  json.days.length,
  "version",
  json.version,
  "tz",
  json.timezone,
);
console.log("BLOB_ROUNDTRIP_PASS");
console.log(`BLOB_URL=${url}`);
