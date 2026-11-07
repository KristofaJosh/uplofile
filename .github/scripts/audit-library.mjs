// Fails when a known advisory reaches the published library's runtime deps.
// `pnpm audit` is workspace-wide and ignores --filter, so we read its JSON
// and keep only advisories whose dependency path starts at packages/uplofile.
// Usage: pnpm audit --prod --json | node .github/scripts/audit-library.mjs
import { readFileSync } from "node:fs";

const ROOT = "packages__uplofile";
const FAIL_ON = new Set(["moderate", "high", "critical"]);

const report = JSON.parse(readFileSync(0, "utf8"));
const hits = Object.values(report.advisories ?? {}).flatMap((advisory) => {
  const paths = advisory.findings
    .flatMap((finding) => finding.paths)
    .filter((path) => path.startsWith(ROOT));
  return paths.length ? [{ advisory, path: paths[0] }] : [];
});

for (const { advisory, path } of hits) {
  console.log(
    `${advisory.severity}\t${advisory.module_name}\t${advisory.url}\n\t${path}`,
  );
}

const blocking = hits.filter(({ advisory }) => FAIL_ON.has(advisory.severity));
console.log(
  `${hits.length} advisories reach the library, ${blocking.length} at moderate or above.`,
);
process.exit(blocking.length ? 1 : 0);
