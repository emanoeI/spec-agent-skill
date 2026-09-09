const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const casesDir = path.join(root, "evals", "cases");
const moduleFiles = fs
  .readdirSync(path.join(root, "skill", "modules"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => path.join("skill", "modules", file));
const skillText = readAll([
  "skill/SKILL.md",
  "skill/router.md",
  "skill/output-contract.md",
  ...moduleFiles
]).toLowerCase();
const routerText = fs.readFileSync(path.join(root, "skill", "router.md"), "utf8").toLowerCase();

const cases = fs
  .readdirSync(casesDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(casesDir, file), "utf8")));

let failures = 0;
const routerFailures = [];

for (const workType of ["Greenfield", "Feature", "Refactor", "Sensitive integration", "Repair"]) {
  if (!routerText.includes(`${workType.toLowerCase()}:`)) {
    routerFailures.push(`missing router work type: ${workType}`);
  }
}

for (const signal of ["auth", "payment", "upload", "rewrite", "schema change", "admin dashboard", "vague request"]) {
  if (!routerText.includes(signal)) {
    routerFailures.push(`missing router escalation signal: ${signal}`);
  }
}

if (routerFailures.length) {
  failures += 1;
  console.log("[fail] router-contract");
  for (const failure of routerFailures) {
    console.log(`  ${failure}`);
  }
}

for (const testCase of cases) {
  const missing = [];

  if (!skillText.includes(testCase.expectedType.toLowerCase())) {
    missing.push(`work type: ${testCase.expectedType}`);
  }

  if (!routerText.includes(testCase.expectedType.toLowerCase())) {
    missing.push(`router work type: ${testCase.expectedType}`);
  }

  for (const signal of testCase.requiredSignals) {
    if (!skillText.includes(signal.toLowerCase())) {
      missing.push(signal);
    }
  }

  if (missing.length) {
    failures += 1;
    console.log(`[fail] ${testCase.id}`);
    console.log(`  prompt: ${testCase.prompt}`);
    console.log(`  missing: ${missing.join(", ")}`);
  } else {
    console.log(`[pass] ${testCase.id}`);
  }
}

if (failures > 0) {
  console.error(`\nSpec evals failed: ${failures}/${cases.length}`);
  process.exit(1);
}

console.log(`\nSpec evals passed: ${cases.length}/${cases.length}`);

function readAll(files) {
  return files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
}
