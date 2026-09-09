const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packageJsonPath = path.join(root, "package.json");

assert(fs.existsSync(packageJsonPath), "Missing package.json");

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const binPath = path.join(root, pkg.bin && pkg.bin.spec ? pkg.bin.spec : "");

assert(pkg.bin && pkg.bin.spec, "package.json is missing bin.spec");
assert(pkg.files.includes("CONTRIBUTING.md"), "package.json files should include CONTRIBUTING.md");
assert(pkg.files.includes("SECURITY.md"), "package.json files should include SECURITY.md");
assert(fs.existsSync(binPath), "bin.spec points to a missing file");
assert(fs.readFileSync(binPath, "utf8").startsWith("#!/usr/bin/env node"), "bin/spec.js is missing a shebang");
assert(fs.existsSync(path.join(root, "README.md")), "Missing README.md");
assert(fs.existsSync(path.join(root, "CONTRIBUTING.md")), "Missing CONTRIBUTING.md");
assert(fs.existsSync(path.join(root, "SECURITY.md")), "Missing SECURITY.md");
assert(fs.existsSync(path.join(root, "LICENSE")), "Missing LICENSE");
assert(fs.existsSync(path.join(root, "skill", "SKILL.md")), "Missing skill/SKILL.md");
assert(fs.existsSync(path.join(root, "skill", "agents", "openai.yaml")), "Missing skill/agents/openai.yaml");
assert(fs.existsSync(path.join(root, "skill", "commands", "init.md")), "Missing skill/commands/init.md");
assert(fs.existsSync(path.join(root, "adapters", "codex")), "Missing adapters/codex/");
assert(fs.existsSync(path.join(root, "adapters", "claude")), "Missing adapters/claude/");
assert(fs.existsSync(path.join(root, "adapters", "cursor")), "Missing adapters/cursor/");
assert(fs.existsSync(path.join(root, "docs", "npm.md")), "Missing docs/npm.md");

const skillPath = path.join(root, "skill", "SKILL.md");
const routerPath = path.join(root, "skill", "router.md");
const outputContractPath = path.join(root, "skill", "output-contract.md");
const openaiYamlPath = path.join(root, "skill", "agents", "openai.yaml");
const modulesDir = path.join(root, "skill", "modules");
const commandsDir = path.join(root, "skill", "commands");
const skill = fs.readFileSync(skillPath, "utf8");
const router = fs.readFileSync(routerPath, "utf8");
const outputContract = fs.readFileSync(outputContractPath, "utf8");
const openaiYaml = fs.readFileSync(openaiYamlPath, "utf8");
const initCommand = fs.readFileSync(path.join(root, "skill", "commands", "init.md"), "utf8");
const onboarding = fs.readFileSync(path.join(root, "skill", "onboarding.md"), "utf8");
const codexAdapter = fs.readFileSync(path.join(root, "adapters", "codex", "AGENTS.template.md"), "utf8");
const claudeAdapter = fs.readFileSync(path.join(root, "adapters", "claude", "CLAUDE.template.md"), "utf8");
const cursorAdapter = fs.readFileSync(path.join(root, "adapters", "cursor", "spec.template.mdc"), "utf8");
const docsText = readAll([
  "README.md",
  "docs/codex.md",
  "docs/claude-code.md",
  "docs/cursor.md",
  "docs/generic-agent.md",
  "docs/npm.md",
  "docs/publishing.md",
  "adapters/codex/README.md",
  "adapters/claude/README.md",
  "adapters/cursor/README.md",
  "adapters/generic/README.md"
]);
const moduleFiles = fs.readdirSync(modulesDir).filter((file) => file.endsWith(".md")).sort();
const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith(".md")).sort();
const vibecodingFit = fs.readFileSync(path.join(modulesDir, "vibecoding-fit.md"), "utf8");
const foundationScore = fs.readFileSync(path.join(modulesDir, "foundation-score.md"), "utf8");
const mvpSlicer = fs.readFileSync(path.join(modulesDir, "mvp-slicer.md"), "utf8");
const decisionLedger = fs.readFileSync(path.join(modulesDir, "decision-ledger.md"), "utf8");
const agentTaskPack = fs.readFileSync(path.join(modulesDir, "agent-task-pack.md"), "utf8");
const promptCompiler = fs.readFileSync(path.join(modulesDir, "prompt-compiler.md"), "utf8");
const domainResearch = fs.readFileSync(path.join(modulesDir, "domain-research.md"), "utf8");
const security = fs.readFileSync(path.join(modulesDir, "security.md"), "utf8");
const validation = fs.readFileSync(path.join(modulesDir, "validation.md"), "utf8");
const acceptanceCriteria = fs.readFileSync(path.join(modulesDir, "acceptance-criteria.md"), "utf8");
const productionBasics = fs.readFileSync(path.join(modulesDir, "production-basics.md"), "utf8");

assert(/^---\nname: spec\ndescription: .+\n---\n/.test(skill), "skill/SKILL.md must start with valid skill frontmatter.");

// Domain research must offer a degraded (no-web) mode, not only a hard stop.
assert(domainResearch.includes("When Web Access Is Not Available"), "domain-research must define a no-web degraded mode.");
assert(domainResearch.includes("model knowledge"), "domain-research degraded mode must label findings as model knowledge.");
assert(/hard-stop only/i.test(domainResearch), "domain-research must limit hard-stop to volatile/high-liability domains.");

// Security and validation must be signal->rule->failure, not a flat checklist.
assert(security.includes("Signal → Rule → Failure Mode"), "security must map signals to concrete rules and failure modes.");
assert(security.toLowerCase().includes("idor"), "security must call out IDOR / ownership checks.");
assert(validation.includes("Signal → Rule → Failure Mode"), "validation must map signals to concrete rules and failure modes.");

// Acceptance criteria must be request-specific, not generic categories.
assert(acceptanceCriteria.toLowerCase().includes("specific to this request"), "acceptance-criteria must require request-specific criteria.");

// Production basics module must exist, be routed, and cover the common failures.
assert(productionBasics.includes("Signal → Rule → Failure Mode"), "production-basics must map signals to rules and failure modes.");
for (const term of ["paginate", "idempotent", "N+1", "index"]) {
  assert(productionBasics.includes(term), `production-basics must cover: ${term}`);
}

// Prompt compiler must verify the generated prompt before writing the file.
assert(promptCompiler.includes("Self-Check Before Writing The File"), "prompt-compiler must self-check the generated prompt.");
assert(skill.includes("Read [`router.md`](./router.md) first."), "SKILL.md must point agents to router.md.");
assert(outputContract.includes("## Veredito"), "output-contract.md is missing the required response shape.");
assert(outputContract.includes("## Prompt gerado"), "output-contract.md must point to a generated prompt file.");
assert(outputContract.includes(".spec/prompts/"), "output-contract.md must mention .spec/prompts/.");
assert(!outputContract.includes("## Prompt melhorado"), "output-contract.md should not inline a full improved prompt.");
assert(router.includes("## Routing Contract"), "router.md is missing the routing contract.");
assert(router.includes("### Always Load"), "router.md is missing the always-load module set.");
assert(router.includes("### Load By Work Type"), "router.md is missing work-type routing.");
assert(router.includes("### Escalation Signals"), "router.md is missing escalation routing.");
assert(router.includes("modules/vibecoding-fit.md"), "router.md must always load vibecoding-fit.");
assert(router.includes("modules/foundation-score.md"), "router.md must always load foundation-score.");
assert(router.includes("modules/mvp-slicer.md"), "router.md must always load mvp-slicer.");
assert(router.includes("modules/decision-ledger.md"), "router.md must always load decision-ledger.");
assert(router.includes("modules/agent-task-pack.md"), "router.md must always load agent-task-pack.");
assert(outputContract.includes("## Escopo para vibecoding"), "output-contract.md must expose vibecoding scope.");
assert(outputContract.includes("## Foundation Score"), "output-contract.md must expose Foundation Score.");
assert(outputContract.includes(".spec/tasks/"), "output-contract.md must point to task files.");
assert(promptCompiler.includes("Agent Task Pack"), "prompt-compiler must include Agent Task Pack.");
assert(promptCompiler.includes("Decision Ledger updates"), "prompt-compiler must include Decision Ledger updates.");
assert(foundationScore.includes("Foundation Score: 0-10"), "foundation-score must define a scoring output.");
assert(foundationScore.includes("proceed | narrow scope | hold"), "foundation-score must define verdict states.");
assert(mvpSlicer.includes("Do not implement yet"), "mvp-slicer must defer non-critical work.");
assert(mvpSlicer.includes("smallest useful vertical slice"), "mvp-slicer must enforce a small Phase 1.");
assert(decisionLedger.includes(".spec/DECISIONS.md"), "decision-ledger must write to .spec/DECISIONS.md.");
assert(decisionLedger.includes("Status: proposed | accepted | revisited"), "decision-ledger must define decision states.");
assert(agentTaskPack.includes(".spec/tasks/"), "agent-task-pack must write to .spec/tasks/.");
assert(agentTaskPack.includes("Files Likely To Touch"), "agent-task-pack must define executable task fields.");
assert(vibecodingFit.includes("Vibecoding constraints"), "vibecoding-fit must require Vibecoding constraints.");
assert(vibecodingFit.includes("Phase 1 scope"), "vibecoding-fit must require Phase 1 scope.");
assert(vibecodingFit.includes("Do not implement yet"), "vibecoding-fit must defer non-critical work.");
assert(vibecodingFit.includes("fewer moving parts"), "vibecoding-fit must optimize for fewer moving parts.");
assert(vibecodingFit.includes("stack complexity proportional to product complexity"), "vibecoding-fit must enforce proportional stack choice.");
assert(vibecodingFit.includes("Avoid disproportionate architecture for small problems"), "vibecoding-fit must ban overpowered architecture for small problems.");
assert(outputContract.includes("adequada ao tamanho e risco do problema"), "output-contract must expose proportionality check.");
assert(openaiYaml.includes('display_name: "Spec"'), "openai.yaml is missing display_name.");
assert(openaiYaml.includes('short_description: "'), "openai.yaml is missing short_description.");
assert(openaiYaml.includes("default_prompt:"), "openai.yaml is missing default_prompt.");
assert(openaiYaml.includes("$spec"), "openai.yaml default_prompt must mention $spec.");
assert(openaiYaml.includes("allow_implicit_invocation: true"), "openai.yaml should allow implicit invocation.");
assert(skill.includes(".spec/prompts/"), "SKILL.md must require prompt files in .spec/prompts/.");
assert(router.includes(".spec/prompts/"), "router.md must route prompt generation to .spec/prompts/.");
assert(initCommand.includes("Ask one question at a time"), "init command must ask one question at a time.");
assert(initCommand.includes("Never dump all onboarding questions at once"), "init command must ban dumping all onboarding questions.");
assert(initCommand.includes("Mark exactly one option with `(Recomendado)`"), "init command must mark exactly one recommended option.");
assert(initCommand.includes("Base the recommendation on repository signals"), "init command must base recommendations on signals.");
assert(onboarding.includes("Do not ask all questions at once"), "onboarding must be progressive.");
assert(onboarding.includes("Default to 3 questions maximum"), "onboarding must limit initial question count.");
assert(onboarding.includes("(Recomendado)"), "onboarding examples must include a recommended option.");
assert(onboarding.includes("Do not always recommend the first option"), "onboarding must avoid first-option bias.");
assert(!onboarding.includes("Ask at most 7 questions."), "onboarding should not encourage a 7-question form.");
assert(codexAdapter.includes(".spec/router.md"), "Codex adapter must route through .spec/router.md.");
assert(claudeAdapter.includes(".spec/router.md"), "Claude adapter must route through .spec/router.md.");
assert(cursorAdapter.includes(".spec/router.md"), "Cursor adapter must route through .spec/router.md.");
assert(codexAdapter.includes("$spec init"), "Codex adapter must use agent-side init.");
assert(claudeAdapter.includes("/spec init"), "Claude adapter must use agent-side init.");
assert(cursorAdapter.includes("/spec init"), "Cursor adapter must use agent-side init.");
assert(!claudeAdapter.includes("$spec"), "Claude adapter must not recommend $spec.");
assert(!cursorAdapter.includes("$spec"), "Cursor adapter must not recommend $spec.");
assert(!docsText.includes("spec start"), "Docs should not recommend terminal onboarding with spec start.");
assert(!codexAdapter.includes("spec start"), "Codex adapter should not recommend terminal onboarding.");
assert(!claudeAdapter.includes("spec start"), "Claude adapter should not recommend terminal onboarding.");
assert(!cursorAdapter.includes("spec start"), "Cursor adapter should not recommend terminal onboarding.");
assert(fs.readFileSync(path.join(root, "docs", "claude-code.md"), "utf8").includes("/spec init"), "Claude docs must use slash command init.");
assert(!fs.readFileSync(path.join(root, "docs", "claude-code.md"), "utf8").includes("$spec"), "Claude docs must not recommend $spec.");
assert(fs.readFileSync(path.join(root, "docs", "cursor.md"), "utf8").includes("/spec init"), "Cursor docs must use slash command init.");
assert(!fs.readFileSync(path.join(root, "docs", "cursor.md"), "utf8").includes("$spec"), "Cursor docs must not recommend $spec.");

for (const file of moduleFiles) {
  assert(router.includes(`modules/${file}`), `router.md does not route module: ${file}`);
}

for (const file of commandFiles) {
  assert(router.includes(`commands/${file}`) || skill.includes(`commands/${file}`), `Command is not routed from SKILL.md/router.md: ${file}`);
}

console.log("Pack check passed.");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readAll(files) {
  return files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
}
