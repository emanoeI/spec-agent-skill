const { compareContracts } = require("./lib/skill-contract");

const baseline = {
  name: "spec",
  commands: ["init", "check"],
  modules: ["security"],
  adapters: ["codex"],
  workTypes: ["Feature"],
  outputSections: ["Veredito"],
  evalCases: ["feature"],
  fixtures: ["feature"]
};
const additive = Object.fromEntries(Object.entries(baseline).map(([key, value]) => [key, Array.isArray(value) ? [...value, "new"] : value]));
const breaking = { ...baseline, commands: ["init"] };

assert(compareContracts(baseline, additive).length === 0, "Additive contract changes should pass.");
assert(compareContracts(baseline, breaking).includes("commands removed: check"), "Removed contract behavior should fail.");
console.log("Skill regression tests passed.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
