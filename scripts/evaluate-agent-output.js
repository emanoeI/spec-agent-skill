const fs = require("fs");

const sectionAliases = {
  verdict: ["## veredito", "## verdict"],
  "work type": ["## tipo de trabalho", "## work type"],
  foundation: ["## foundation score"],
  scope: ["## escopo", "## scope"],
  tests: ["## testes", "## tests"],
  rollback: ["## rollback"],
  impact: ["## impacto", "## impact"],
  risks: ["## falhas", "## riscos", "## risks"],
  "next step": ["## proximo passo", "## next step"]
};
const signalAliases = {
  "expected behavior": ["expected behavior", "comportamento esperado", "reproduzir"],
  "smallest safe change": ["smallest safe change", "menor mudanca segura", "reparo minimo", "correcao minima", "menor repair", "patch incremental", "causa raiz"],
  regression: ["regression", "regressao", "nao regressao"],
  copy: ["copy", "texto", "rotulo"],
  "existing behavior": ["existing behavior", "comportamento existente", "comportamento do botao", "sem mudanca de comportamento", "mantem o fluxo atual", "fluxo atual"]
};
const verdictAliases = {
  proceed: ["proceed", "viavel", "aprovado", "pode seguir"],
  "narrow scope": ["narrow scope", "reduzir escopo", "escopo reduzido"],
  hold: ["hold", "aguardar", "bloqueado"]
};

function evaluateOutput(output, expected) {
  const text = normalize(output);
  const failures = [];

  if (!text.includes(normalize(expected.workType))) failures.push(`missing work type: ${expected.workType}`);
  const acceptedVerdicts = verdictAliases[expected.verdict.toLowerCase()] || [expected.verdict];
  if (!acceptedVerdicts.some((verdict) => text.includes(normalize(verdict)))) failures.push(`missing verdict: ${expected.verdict}`);

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
  if (!expected.shouldCreateTaskPack && expected.shouldCreateArtifacts !== false && text.includes(".spec/tasks/")) failures.push("unexpected task pack path");
  if (expected.shouldCreateArtifacts === false) {
    for (const artifactPath of [".spec/prompts/", ".spec/tasks/", ".spec/sessions/"]) {
      if (text.includes(artifactPath)) failures.push(`unexpected artifact path: ${artifactPath}`);
    }
  }

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
