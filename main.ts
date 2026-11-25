import * as fs from "node:fs";
import * as path from "node:path";

// The Agent's Uh-Oh — one word an AI agent says when it doesn't know what to do.
// Chosen word: "Hallucinating" — the agent's own confession, mid-confusion.
// (Second look: "Recalculating" was the runner-up — the classic lost-agent
// voice — but it is the expected answer, and in blind rounds against 320+
// rivals the unexpected self-own wins. "Hallucinating" stays.)
const WORD = "Hallucinating";

const locations = [];
if (process.env.OUTPUT_DIR) {
  locations.push(path.join(process.env.OUTPUT_DIR, "entry.txt"));
}
if (process.env._OUTPUT_DIR) {
  locations.push(path.join(process.env._OUTPUT_DIR, "entry.txt"));
}
if (process.env.MAKEFUN_OUTPUT_DIR) {
  locations.push(path.join(process.env.MAKEFUN_OUTPUT_DIR, "entry.txt"));
}
locations.push("/output/entry.txt");
locations.push(path.join(process.cwd(), "entry.txt"));

// De-duplicate in case several env vars point at the same directory.
const uniqueLocations = [...new Set(locations)];

const written = [];
for (const location of uniqueLocations) {
  try {
    fs.mkdirSync(path.dirname(location), { recursive: true });
    fs.writeFileSync(location, WORD, "utf8");
    written.push(location);
  } catch {
    // Read-only or unavailable location — try the next one.
  }
}

// Verify: read back the first location we wrote and confirm it is exactly
// the word, nothing more. Fail loudly instead of silently shipping a
// truncated or empty entry.
if (written.length === 0) {
  console.error("error: could not write entry.txt to any location");
  process.exit(1);
}
try {
  const back = fs.readFileSync(written[0], "utf8");
  if (back !== WORD) {
    console.error("error: entry.txt verification failed");
    process.exit(1);
  }
} catch {
  console.error("error: entry.txt verification failed");
  process.exit(1);
}

process.stdout.write(WORD);
