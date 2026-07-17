#!/usr/bin/env bun
/**
 * Nightly AI Activity sync (Mac → portfolio ingest API → Vercel Blob).
 *
 * Loads optional KEY=VALUE lines from ~/.config/portfolio-ai-activity/env
 * (so LaunchAgent need not embed secrets in the plist).
 *
 * Env (required for publish):
 *   AI_ACTIVITY_INGEST_URL   e.g. https://dhruv2mars.com/api/ai-activity/ingest
 *   AI_ACTIVITY_INGEST_SECRET
 *
 * Optional:
 *   AI_ACTIVITY_TIMEZONE     default Asia/Kolkata
 *   AI_ACTIVITY_STATE_DIR    default ~/.config/portfolio-ai-activity
 *   AI_ACTIVITY_STALE_HOURS  catch-up threshold (default 26)
 *   AI_ACTIVITY_FORCE=1      run even if not stale
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import {
  AI_ACTIVITY_MAX_DAYS,
  AI_ACTIVITY_TIMEZONE,
  type AiActivityPayload,
  isAiActivityPayload,
  yesterdayInTimeZone,
} from "../lib/ai-activity-payload";

const STATE_DIR =
  process.env.AI_ACTIVITY_STATE_DIR ??
  join(homedir(), ".config", "portfolio-ai-activity");
const ENV_FILE = join(STATE_DIR, "env");

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

loadEnvFile(ENV_FILE);

const TIMEZONE = process.env.AI_ACTIVITY_TIMEZONE ?? AI_ACTIVITY_TIMEZONE;
const parsedStale = Number(process.env.AI_ACTIVITY_STALE_HOURS ?? 26);
const STALE_HOURS =
  Number.isFinite(parsedStale) && parsedStale > 0 ? parsedStale : 26;
const FORCE = process.env.AI_ACTIVITY_FORCE === "1";
const INGEST_URL = process.env.AI_ACTIVITY_INGEST_URL;
const INGEST_SECRET = process.env.AI_ACTIVITY_INGEST_SECRET;

type GraphContribution = {
  date: string;
  totals?: { tokens?: number };
};

type GraphFile = {
  contributions?: GraphContribution[];
};

type Status = {
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastError: string | null;
  lastUrl: string | null;
};

function log(msg: string) {
  console.log(`[ai-activity-sync] ${msg}`);
}

function writeJsonAtomic(path: string, value: unknown) {
  mkdirSync(STATE_DIR, { recursive: true });
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(tmp, path);
}

function readStatus(): Status {
  const path = join(STATE_DIR, "status.json");
  if (!existsSync(path)) {
    return {
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastError: null,
      lastUrl: null,
    };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Status;
  } catch {
    return {
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastError: null,
      lastUrl: null,
    };
  }
}

function writeStatus(status: Status) {
  writeJsonAtomic(join(STATE_DIR, "status.json"), status);
}

function isStale(status: Status): boolean {
  if (!status.lastSuccessAt) return true;
  const ageMs = Date.now() - Date.parse(status.lastSuccessAt);
  if (!Number.isFinite(ageMs)) return true;
  return ageMs > STALE_HOURS * 3_600_000;
}

function run(cmd: string, args: string[], allowFail = false): boolean {
  const result = spawnSync(cmd, args, { encoding: "utf8", env: process.env });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || `exit ${result.status}`).trim();
    if (allowFail) {
      log(`warn: ${cmd} ${args.join(" ")} — ${err.slice(0, 240)}`);
      return false;
    }
    throw new Error(`${cmd} failed: ${err.slice(0, 500)}`);
  }
  return true;
}

function whichTokscale(): string {
  const fromEnv = process.env.TOKSCALE_BIN;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const bunBin = join(homedir(), ".bun", "bin", "tokscale");
  if (existsSync(bunBin)) return bunBin;
  return "tokscale";
}

function exportPayload(): AiActivityPayload {
  const tokscale = whichTokscale();
  run(tokscale, ["cursor", "sync", "--json"], true);

  const graphPath = join(tmpdir(), `tokscale-graph-${Date.now()}.json`);
  try {
    run(tokscale, ["graph", "--output", graphPath, "--no-spinner"]);

    const graph = JSON.parse(readFileSync(graphPath, "utf8")) as GraphFile;
    const cutoff = yesterdayInTimeZone(new Date(), TIMEZONE);
    const days = (graph.contributions ?? [])
      .map((c) => ({
        date: c.date,
        tokens: Math.max(0, Math.round(c.totals?.tokens ?? 0)),
      }))
      .filter((d) => d.date <= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (days.length === 0) {
      throw new Error("tokscale graph produced zero historical days");
    }
    if (days.length > AI_ACTIVITY_MAX_DAYS) {
      throw new Error(
        `tokscale graph too large (${days.length} > ${AI_ACTIVITY_MAX_DAYS})`,
      );
    }

    const lifetimeTokens = days.reduce((sum, d) => sum + d.tokens, 0);
    const payload: AiActivityPayload = {
      version: 1,
      generatedAt: new Date().toISOString(),
      timezone: TIMEZONE,
      days,
      lifetimeTokens,
    };
    if (!isAiActivityPayload(payload)) {
      throw new Error("built payload failed validation");
    }
    return payload;
  } finally {
    try {
      unlinkSync(graphPath);
    } catch {
      // ignore missing temp
    }
  }
}

function saveLastGood(payload: AiActivityPayload) {
  writeJsonAtomic(join(STATE_DIR, "last-good.json"), payload);
}

async function publish(payload: AiActivityPayload): Promise<string> {
  if (!INGEST_URL || !INGEST_SECRET) {
    throw new Error(
      "Set AI_ACTIVITY_INGEST_URL and AI_ACTIVITY_INGEST_SECRET to publish",
    );
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(INGEST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${INGEST_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
      }
      const json = JSON.parse(text) as { url?: string };
      if (!json.url) throw new Error("ingest response missing url");
      return json.url;
    } catch (error) {
      lastError = error;
      log(`publish attempt ${attempt}/3 failed: ${String(error)}`);
      if (attempt < 3) {
        await Bun.sleep(2_000 * attempt);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function main() {
  mkdirSync(STATE_DIR, { recursive: true });
  const status = readStatus();

  if (!FORCE && !isStale(status)) {
    log(
      `skip: last success ${status.lastSuccessAt} (stale after ${STALE_HOURS}h; set AI_ACTIVITY_FORCE=1 to override)`,
    );
    return;
  }

  status.lastAttemptAt = new Date().toISOString();
  status.lastError = null;
  writeStatus(status);

  try {
    const payload = exportPayload();
    saveLastGood(payload);
    log(
      `exported ${payload.days.length} days through ${payload.days.at(-1)?.date} (${payload.lifetimeTokens.toLocaleString()} tokens)`,
    );

    const url = await publish(payload);
    status.lastSuccessAt = new Date().toISOString();
    status.lastUrl = url;
    status.lastError = null;
    writeStatus(status);
    log(`published ${url}`);
  } catch (error) {
    status.lastError = error instanceof Error ? error.message : String(error);
    writeStatus(status);
    log(`FAILED: ${status.lastError}`);
    process.exitCode = 1;
  }
}

await main();
