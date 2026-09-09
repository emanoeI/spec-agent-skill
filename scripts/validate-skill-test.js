const fs = require("fs");
const os = require("os");
const path = require("path");
const { validateSkill } = require("./validate-skill");

const root = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "spec-skill-validator-"));

try {
  assert(validateSkill(path.join(root, "skill")).length === 0, "Project skill should pass validation.");

  const invalidDir = path.join(tempRoot, "invalid-skill");
  fs.mkdirSync(invalidDir, { recursive: true });
  fs.writeFileSync(path.join(invalidDir, "SKILL.md"), "---\nname: Invalid Name\ndescription: short\nextra: value\n---\n\nTODO\n[Missing](./missing.md)\n", "utf8");

  const failures = validateSkill(invalidDir);
  for (const expected of ["kebab-case", "description", "Unsupported", "placeholders", "Broken local reference"]) {
    assert(failures.some((failure) => failure.includes(expected)), `Missing validator failure: ${expected}`);
  }

  console.log("Skill validator tests passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
