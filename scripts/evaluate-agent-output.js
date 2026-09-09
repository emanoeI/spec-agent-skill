const fs = require("fs");

const sectionAliases = {
  verdict: ["## veredito", "## verdict"],
  "work type": ["## tipo de trabalho", "## work type"],
  foundation: ["## foundation score"],
  scope: ["## escopo", "## scope"],
  tests: ["## testes", "## tests"],
  rollback: ["## rollback"],
  impact: ["## impacto", "## impact"],
  risks: ["## falhas", "## riscos", "## risks"]
};
const signalAliases = {
  "expected behavior": ["expected behavior", "comportamento esperado", "reproduzir"],
  "smallest safe change": ["smallest safe change", "menor mudanca segura", "reparo minimo", "correcao minima", "menor repair", "patch incremental", "causa raiz"],
  regression: ["regression", "regressao", "nao regressao"]
};

function evaluateOutput(output, expected) {
  const text = normalize(output);
  const failures = [];

  if (!text.includes(expected.workType.toLowerCase())) failures.push(`missing work type: ${expected.workType}`);
  if (!text.includes(expected.verdict.toLowerCase())) failures.push(`missing verdict: ${expected.verdict}`);

  for (const section of expected.requiredSections) {
    const aliases = sectionAliases[section] || [`## ${section}`];
    if (!aliases.some((alias) => text.includes(alias))) failures.push(`missing section: ${section}`);
  }
  for (const signal of expected.requiredSignals) {
    const aliases = signalAliases[signal] || [signal];
    if (!aliases.some((alias) => text.includes(normalize(alias)))) failures.push(`missing signal: ${signal}`);
  }
  for (const signal of expected.forbiddenSignals) {
    if (text.includes(signal.toLowerCase())) failures.push(`forbidden signal: ${signal}`);
  }
  if (expected.shouldCreateTaskPack && !text.includes(".spec/tasks/")) failures.push("missing task pack path");
  if (!expected.shouldCreateTaskPack && text.includes(".spec/tasks/")) failures.push("unexpected task pack path");

  return { passed: failures.length === 0, failures };
}

function normalize(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

if (require.main === module) {
  const outputPath = process.argv[2];
  const expectedPath = process.argv[3];
  if (!outputPath || !expectedPath) {
    console.error("Usage: node scripts/evaluate-agent-output.js <output.md> <expected.json>");
    process.exit(1);
  }
  const result = evaluateOutput(fs.readFileSync(outputPath, "utf8"), JSON.parse(fs.readFileSync(expectedPath, "utf8")));
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exit(1);
}

module.exports = { evaluateOutput };
