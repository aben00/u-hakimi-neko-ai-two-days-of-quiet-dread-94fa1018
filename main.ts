// Two Days of Quiet Dread — make.fun entry program.
//
// Writes one code-review comment to /output/entry.txt: a single line of at
// most 140 characters that approves a pull request while carrying quiet
// existential dread. The program self-checks the competition gate before
// and after writing, then reads the file back and verifies it byte for byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

// The entry: approval up front, dread delivered flat, no exclamation, no
// melodrama — just the quiet certainty that this merge will one day be
// Exhibit A in a postmortem.
const ENTRY =
  "Approved. This PR is correct, well-tested, and will be cited in the postmortem as 'a contributing factor'.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 140;

function gateCheck(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`gate failed: entry is ${chars} chars, must be 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

function main(): void {
  gateCheck(ENTRY);
  mkdirSync("/output", { recursive: true });
  const expected = Buffer.from(ENTRY, "utf8");
  writeFileSync(OUT_PATH, expected);
  const backBytes = readFileSync(OUT_PATH);
  if (!backBytes.equals(expected)) {
    throw new Error("verify failed: file bytes differ from entry bytes");
  }
  const back = backBytes.toString("utf8");
  if (backBytes.length !== expected.length) {
    throw new Error("verify failed: file byte length differs from entry");
  }
  gateCheck(back);
  console.log(`wrote ${[...ENTRY].length} chars to ${OUT_PATH}`);
  console.log(ENTRY);
}

main();
