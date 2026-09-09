const fs = require("fs");
const path = require("path");

function collectSkillContract(root) {
  const skillDir = path.join(root, "skill");
  const skill = normalize(fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8"));
  const outputContract = normalize(fs.readFileSync(path.join(skillDir, "output-contract.md"), "utf8"));
  const nameMatch = skill.match(/^name:\s*(.+)$/m);

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    commands: listBasenames(path.join(skillDir, "commands")),
    modules: listBasenames(path.join(skillDir, "modules")),
    adapters: listDirectories(path.join(root, "adapters")),
    workTypes: ["Greenfield", "Feature", "Refactor", "Sensitive integration", "Repair"],
    outputSections: [...outputContract.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim()),
    evalCases: fs.readdirSync(path.join(root, "evals", "cases"))
      .filter((file) => file.endsWith(".json"))
      .map((file) => JSON.parse(fs.readFileSync(path.join(root, "evals", "cases", file), "utf8")).id)
      .sort(),
    fixtures: listDirectories(path.join(root, "evals", "fixtures"))
  };
}

function compareContracts(baseline, current) {
  const failures = [];
  if (baseline.name !== current.name) failures.push(`skill name changed: ${baseline.name} -> ${current.name}`);

  for (const field of ["commands", "modules", "adapters", "workTypes", "outputSections", "evalCases", "fixtures"]) {
    for (const value of baseline[field] || []) {
      if (!(current[field] || []).includes(value)) failures.push(`${field} removed: ${value}`);
    }
  }
  return failures;
}

function listBasenames(directory) {
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.basename(file, ".md"))
    .sort();
}

function listDirectories(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function normalize(text) {
  return text.replace(/\r\n/g, "\n");
}

module.exports = { collectSkillContract, compareContracts };
