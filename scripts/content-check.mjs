import { promises as fs } from "node:fs";
import path from "node:path";

const root = new URL("../", import.meta.url);
const contentDirectories = ["src/content/services", "src/content/case-studies", "src/content/insights"];
const failures = [];
const warnings = [];
const placeholderPatterns = [
  /\b(lorem ipsum|dummy text|insert copy here)\b/i,
  /\b(100% satisfaction|guaranteed results)\b/i,
];

async function markdownFiles(relativeDirectory) {
  const directory = new URL(`${relativeDirectory}/`, root);
  const names = await fs.readdir(directory);
  return names.filter((name) => name.endsWith(".md")).map((name) => new URL(name, directory));
}

for (const directory of contentDirectories) {
  for (const file of await markdownFiles(directory)) {
    const source = await fs.readFile(file, "utf8");
    const relative = path.relative(new URL(".", root).pathname, file.pathname);
    for (const pattern of placeholderPatterns) {
      if (pattern.test(source)) failures.push(`${relative}: contains prohibited placeholder or unsupported guarantee`);
    }
    if (!/^---\n[\s\S]+?\n---/m.test(source)) failures.push(`${relative}: missing YAML frontmatter`);
    if (!/\ndraft:\s+(true|false)\s*(?:\n|$)/.test(source)) failures.push(`${relative}: missing explicit draft status`);
    if (directory.endsWith("case-studies")) {
      const metricBlock = source.match(/\napprovedMetrics:\s*\n([\s\S]*?)\ndraft:/)?.[1] ?? "";
      if (metricBlock.trim() && metricBlock.trim() !== "[]") {
        const valueCount = (metricBlock.match(/^\s*-\s+value:/gm) ?? []).length;
        const evidenceCount = (metricBlock.match(/^\s+evidence:\s*\S+/gm) ?? []).length;
        const periodCount = (metricBlock.match(/^\s+period:\s*\S+/gm) ?? []).length;
        if (evidenceCount < valueCount || periodCount < valueCount) failures.push(`${relative}: every approved metric needs evidence and a measurement period`);
      }
    }
  }
}

const settings = JSON.parse(await fs.readFile(new URL("src/data/site.json", root), "utf8"));
for (const field of ["contactEmail", "ssmNumber"]) {
  if (!settings[field]) warnings.push(`site.json: ${field} is still empty and must be confirmed before public launch`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`Content checks passed with ${warnings.length} launch warning(s).`);
