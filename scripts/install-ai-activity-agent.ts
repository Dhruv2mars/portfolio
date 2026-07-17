#!/usr/bin/env bun
/**
 * Install LaunchAgent for nightly AI Activity sync.
 * Reads secrets from ~/.config/portfolio-ai-activity/env (KEY=VALUE lines).
 */
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const HOME = homedir();
const REPO = resolve(import.meta.dirname, "..");
const STATE = join(HOME, ".config", "portfolio-ai-activity");
const ENV_FILE = join(STATE, "env");
const PLIST_SRC = join(
  REPO,
  "scripts/launchd/com.dhruv2mars.portfolio-ai-activity.plist",
);
const PLIST_DST = join(
  HOME,
  "Library/LaunchAgents/com.dhruv2mars.portfolio-ai-activity.plist",
);
const BUN = process.execPath.includes("bun")
  ? process.execPath
  : join(HOME, ".bun", "bin", "bun");
const LABEL = "com.dhruv2mars.portfolio-ai-activity";

function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

mkdirSync(STATE, { recursive: true });
mkdirSync(join(HOME, "Library/LaunchAgents"), { recursive: true });

if (!existsSync(ENV_FILE)) {
  writeFileSync(
    ENV_FILE,
    `# Portfolio AI Activity sync secrets (chmod 600)
AI_ACTIVITY_INGEST_URL=https://dhruv2mars.com/api/ai-activity/ingest
AI_ACTIVITY_INGEST_SECRET=replace-me
`,
  );
  chmodSync(ENV_FILE, 0o600);
  console.log(`Created ${ENV_FILE} — fill in the secret, then re-run.`);
  process.exit(1);
}

const env = loadEnvFile(ENV_FILE);
if (!env.AI_ACTIVITY_INGEST_SECRET || env.AI_ACTIVITY_INGEST_SECRET === "replace-me") {
  console.error(`Set AI_ACTIVITY_INGEST_SECRET in ${ENV_FILE}`);
  process.exit(1);
}

let plist = readFileSync(PLIST_SRC, "utf8")
  .replaceAll("__BUN_BIN__", BUN)
  .replaceAll("__REPO__", REPO)
  .replaceAll("__HOME__", HOME);

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Inject env keys into the plist EnvironmentVariables dict
const envEntries = Object.entries(env)
  .map(([k, v]) => `      <key>${escapeXml(k)}</key>\n      <string>${escapeXml(v)}</string>`)
  .join("\n");

const homeAnchor = `      <key>HOME</key>\n      <string>${HOME}</string>`;
if (!plist.includes(homeAnchor)) {
  console.error("Plist template missing HOME EnvironmentVariables anchor");
  process.exit(1);
}

const injected = `${homeAnchor}\n${envEntries}`;
plist = plist.replace(homeAnchor, injected);
if (!plist.includes("AI_ACTIVITY_INGEST_SECRET")) {
  console.error("Failed to inject secrets into LaunchAgent plist");
  process.exit(1);
}

writeFileSync(PLIST_DST, plist, { mode: 0o600 });
chmodSync(PLIST_DST, 0o600);

spawnSync("launchctl", ["bootout", `gui/${process.getuid?.() ?? 501}/${LABEL}`], {
  encoding: "utf8",
});
const boot = spawnSync(
  "launchctl",
  ["bootstrap", `gui/${process.getuid?.() ?? 501}`, PLIST_DST],
  { encoding: "utf8" },
);
if (boot.status !== 0) {
  // fallback older macOS
  spawnSync("launchctl", ["unload", PLIST_DST], { encoding: "utf8" });
  const load = spawnSync("launchctl", ["load", PLIST_DST], { encoding: "utf8" });
  if (load.status !== 0) {
    console.error(boot.stderr || load.stderr || "launchctl failed");
    process.exit(1);
  }
}

console.log(`Installed ${PLIST_DST}`);
console.log("Kickstart once:");
console.log(
  `  launchctl kickstart -k gui/${process.getuid?.() ?? 501}/${LABEL}`,
);
console.log(`Or: AI_ACTIVITY_FORCE=1 bun ${REPO}/scripts/sync-ai-activity.ts`);
