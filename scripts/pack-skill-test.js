const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const result = spawnSync(process.execPath, [path.join(__dirname, "pack-skill.js")], { cwd: root, encoding: "utf8" });

assert(result.status === 0, result.stderr || result.stdout);

const outputDir = path.join(root, "dist", "spec");
const manifest = JSON.parse(fs.readFileSync(path.join(outputDir, "manifest.json"), "utf8"));

assert(fs.existsSync(path.join(outputDir, "SKILL.md")), "Bundle is missing root SKILL.md.");
assert(fs.existsSync(path.join(outputDir, "agents", "openai.yaml")), "Bundle is missing OpenAI metadata.");
assert(manifest.name === "spec", "Bundle manifest has the wrong skill name.");
assert(manifest.files.some((file) => file.path === "router.md"), "Bundle manifest is missing router.md.");

for (const forbidden of ["README.md", "package.json", "evals", "docs", "adapters", "bin"]) {
  assert(!fs.existsSync(path.join(outputDir, forbidden)), `Bundle contains repository-only content: ${forbidden}`);
}

console.log("Skill bundle tests passed.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
