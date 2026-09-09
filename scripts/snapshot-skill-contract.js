const fs = require("fs");
const path = require("path");
const { collectSkillContract } = require("./lib/skill-contract");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, "evals", "baselines", "skill-contract.json");
fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
fs.writeFileSync(baselinePath, `${JSON.stringify(collectSkillContract(root), null, 2)}\n`, "utf8");
console.log(`Skill contract baseline updated: ${baselinePath}`);
