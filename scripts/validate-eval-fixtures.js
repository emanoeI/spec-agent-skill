const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const fixturesDir = path.join(root, "evals", "fixtures");
const caseIds = new Set(
  fs.readdirSync(path.join(root, "evals", "cases"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(root, "evals", "cases", file), "utf8")).id)
);
const failures = [];
const workTypes = new Set();

for (const entry of fs.readdirSync(fixturesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const fixtureDir = path.join(fixturesDir, entry.name);
  const input = readJson(path.join(fixtureDir, "input.json"), entry.name);
  const expected = readJson(path.join(fixtureDir, "expected.json"), entry.name);
  if (!input || !expected) continue;

  if (!caseIds.has(input.sourceCase)) failures.push(`${entry.name}: unknown sourceCase ${input.sourceCase}`);
  if (!input.request || !input.context || !Array.isArray(input.context.constraints)) failures.push(`${entry.name}: incomplete input fixture`);
  if (!expected.workType || !expected.verdict) failures.push(`${entry.name}: expected work type and verdict are required`);
  if (!Array.isArray(expected.requiredSections) || expected.requiredSections.length === 0) failures.push(`${entry.name}: requiredSections must not be empty`);
  if (!Array.isArray(expected.requiredSignals) || expected.requiredSignals.length === 0) failures.push(`${entry.name}: requiredSignals must not be empty`);
  if (!Array.isArray(expected.forbiddenSignals)) failures.push(`${entry.name}: forbiddenSignals must be an array`);
  if (typeof expected.shouldCreateTaskPack !== "boolean") failures.push(`${entry.name}: shouldCreateTaskPack must be boolean`);
  workTypes.add(expected.workType);
}

for (const workType of ["Greenfield", "Feature", "Refactor", "Sensitive integration", "Repair"]) {
  if (!workTypes.has(workType)) failures.push(`Missing fixture for work type: ${workType}`);
}

if (failures.length > 0) {
  console.error("Eval fixture validation failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Eval fixture validation passed: ${workTypes.size} work types covered.`);

function readJson(filePath, fixtureName) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${fixtureName}: missing ${path.basename(filePath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${fixtureName}: invalid ${path.basename(filePath)} (${error.message})`);
    return null;
  }
}
