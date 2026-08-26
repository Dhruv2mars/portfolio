/*
 * Reproduce lib/wordmark-dots.ts from the engine in tools/dither.js.
 *
 *   bun tools/gen-dots.mjs > lib/wordmark-dots.ts
 *   bun tools/gen-dots.mjs --preset '{"stroke":18}' > lib/wordmark-dots.ts
 *   bun tools/gen-dots.mjs --preview      # ASCII proof it still reads
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Dither = require("./dither.js");

const argv = process.argv.slice(2);
const presetAt = argv.indexOf("--preset");
const preset = presetAt === -1 ? {} : JSON.parse(argv[presetAt + 1]);
const result = Dither.build(preset);

if (argv.includes("--preview")) {
  const cols = 150;
  const rows = 26;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(" "));
  for (let i = 0; i < result.dots.length; i += 2) {
    const x = Math.min(cols - 1, Math.floor((result.dots[i] / result.box.width) * cols));
    const y = Math.min(rows - 1, Math.floor((result.dots[i + 1] / result.box.height) * rows));
    grid[y][x] = "#";
  }
  console.error(grid.map((r) => r.join("")).join("\n"));
  console.error(`\n${result.dots.length / 2} dots · ${JSON.stringify(result.preset)}`);
} else {
  process.stdout.write(Dither.toModule(result));
}
