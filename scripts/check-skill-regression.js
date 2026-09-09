const fs = require("fs");
const path = require("path");
const { collectSkillContract, compareContracts } = require("./lib/skill-contract");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, "evals", "baselines", "skill-contract.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const current = collectSkillContract(root);
const failures = compareContracts(baseline, current);

if (failures.length > 0) {
  console.error("Skill contract regression detected:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error("\nIf the removals are intentional, run npm run eval:baseline:update and review the diff.");
  process.exit(1);
}

console.log("Skill contract regression check passed.");
