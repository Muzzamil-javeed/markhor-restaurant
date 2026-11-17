import { execSync } from "node:child_process";
import { readFileSync, unlinkSync } from "node:fs";

const base = process.env.LH_BASE_URL ?? "http://127.0.0.1:3011";

function run(path, out) {
  execSync(
    `npx lighthouse "${base}${path}" --preset=desktop --only-categories=performance --only-categories=accessibility --only-categories=best-practices --only-categories=seo --chrome-flags="--headless --no-sandbox" --quiet --output=json --output-path=${out}`,
    { stdio: "inherit" },
  );
  const j = JSON.parse(readFileSync(out, "utf8"));
  const scores = {};
  for (const [k, v] of Object.entries(j.categories || {})) {
    scores[k] = Math.round((v.score || 0) * 100);
  }
  try {
    unlinkSync(out);
  } catch {
    /* ignore */
  }
  return scores;
}

const home = run("/", "./lh-home-tmp.json");
const menu = run("/menu", "./lh-menu-tmp.json");

console.log("HOME (desktop)", home);
console.log("MENU (desktop)", menu);

const failed = [];
for (const [label, scores] of [
  ["Home", home],
  ["Menu", menu],
]) {
  for (const [cat, score] of Object.entries(scores)) {
    if (score < 90) failed.push(`${label} ${cat}=${score}`);
  }
}

if (failed.length) {
  console.error("Below 90:", failed.join(", "));
  process.exit(1);
}

console.log("All four metrics ≥ 90 on Home and Menu.");
