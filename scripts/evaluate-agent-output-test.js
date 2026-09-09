const { evaluateOutput } = require("./evaluate-agent-output");

const expected = {
  workType: "Repair",
  verdict: "proceed",
  requiredSections: ["verdict", "work type", "tests", "rollback"],
  requiredSignals: ["smallest safe change", "regression"],
  forbiddenSignals: ["rewrite checkout"],
  shouldCreateTaskPack: false,
  shouldCreateArtifacts: false
};

const valid = `## Veredito\nproceed\n## Tipo de trabalho\nRepair\n## Testes mínimos\nnão regressão\n## Rollback\nmenor repair comprovado`;
const invalid = `${valid}\nrewrite checkout`;
const invalidArtifact = `${valid}\n.spec/prompts/repair.md`;

assert(evaluateOutput(valid, expected).passed, "Valid agent output should pass.");
assert(!evaluateOutput(invalid, expected).passed, "Forbidden behavior should fail.");
assert(!evaluateOutput(invalidArtifact, expected).passed, "Unexpected lightweight artifacts should fail.");
console.log("Agent output evaluator tests passed.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
