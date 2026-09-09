const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { generateContext, documentContext, refineContext } = require("./lib/context-fixture");

const repoRoot = path.resolve(__dirname, "..");
const cliPath = path.join(repoRoot, "bin", "spec.js");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "spec-smoke-"));
const requiredFiles = [
  ".spec/README.md",
  ".spec/SKILL.md",
  ".spec/prompts",
  ".spec/tasks",
  ".spec/router.md",
  ".spec/output-contract.md",
  ".spec/onboarding.md",
  ".spec/commands/init.md",
  ".spec/commands/document.md",
  ".spec/commands/refine.md",
  ".spec/commands/check.md",
  ".spec/modules/work-classifier.md",
  ".spec/modules/domain-research.md",
  ".spec/modules/project-protection.md",
  ".spec/modules/foundation-score.md",
  ".spec/modules/mvp-slicer.md",
  ".spec/modules/decision-ledger.md",
  ".spec/modules/agent-task-pack.md",
  ".spec/CONTEXT.md",
  ".spec/PRODUCT.md",
  ".spec/ARCHITECTURE.md",
  ".spec/DESIGN.md",
  ".spec/RULES.md",
  ".spec/GLOSSARY.md",
  ".spec/DECISIONS.md",
  ".spec/RISKS.md",
  ".spec/ROADMAP.md",
  ".spec/PROMPTS.md",
  ".spec/TESTING.md",
  ".spec/OPERATIONS.md",
  ".spec/PERMISSIONS.md",
  ".spec/DATA-MODEL.md",
  ".spec/RED-FLAGS.md",
  ".spec/sessions"
];

try {
  testInstall();
  testAdapters();
  testContextFixture();
  testDocumentRefineCheck();
  testIgnoreRules();
  console.log("Smoke tests passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function testInstall() {
  const projectDir = makeProject("install-case");
  runCli(projectDir, ["install"]);

  for (const file of requiredFiles) {
    assert(fs.existsSync(path.join(projectDir, file)), `Missing expected file after install: ${file}`);
  }

  const skill = read(projectDir, ".spec/SKILL.md");
  assert(skill.startsWith("---\nname: spec\n"), "Installed SKILL.md is missing skill frontmatter.");

  // Plain `spec install` (no flag) installs the generic adapter and AGENTS.md.
  assert(fs.existsSync(path.join(projectDir, "AGENTS.md")), "AGENTS.md missing after plain install.");

  const help = runCli(projectDir, ["help"]);
  assert(help.stdout.includes("spec install"), "help should document the install command.");
  assert(!help.stdout.includes("spec start"), "help should not mention removed terminal onboarding.");
  assert(!help.stdout.includes("spec doctor"), "help should not mention the removed doctor command.");

  // Removed terminal commands should fall through to help with a failing code.
  for (const removed of ["start", "document", "refine", "doctor"]) {
    const result = runCliRaw(projectDir, [removed]);
    assert(result.status === 1, `Removed command '${removed}' should exit non-zero.`);
  }
}

function testAdapters() {
  const projectDir = makeProject("adapters-case");

  runCli(projectDir, ["install", "--codex"]);
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "SKILL.md")), "Codex adapter missing.");
  assert(fs.existsSync(path.join(projectDir, "AGENTS.md")), "AGENTS.md missing after Codex install.");
  assert(read(projectDir, path.join(".agents", "skills", "spec", "SKILL.md")).startsWith("---\nname: spec\n"), "Codex skill mirror is missing frontmatter.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "agents", "openai.yaml")), "Codex skill mirror missing OpenAI metadata.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "commands", "init.md")), "Codex skill mirror missing init command.");

  runCli(projectDir, ["install", "--claude"]);
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "SKILL.md")), "Claude adapter missing.");
  assert(fs.existsSync(path.join(projectDir, "CLAUDE.md")), "CLAUDE.md missing after Claude install.");
  assert(read(projectDir, path.join(".claude", "skills", "spec", "SKILL.md")).startsWith("---\nname: spec\n"), "Claude skill mirror is missing frontmatter.");
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "agents", "openai.yaml")), "Claude skill mirror missing OpenAI metadata.");
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "commands", "init.md")), "Claude skill mirror missing init command.");

  runCli(projectDir, ["install", "--cursor"]);
  assert(fs.existsSync(path.join(projectDir, ".cursor", "rules", "spec.mdc")), "Cursor rule missing.");

  runCli(projectDir, ["install", "--antigravity"]);
  assert(fs.existsSync(path.join(projectDir, ".agents", "rules", "spec.md")), "Antigravity rule missing.");
  assert(read(projectDir, path.join(".agents", "rules", "spec.md")).includes(".spec/router.md"), "Antigravity rule is missing router instruction.");

  runCli(projectDir, ["install", "--all"]);
  runCli(projectDir, ["install", "--all"]);

  const agents = read(projectDir, "AGENTS.md");
  const claude = read(projectDir, "CLAUDE.md");

  assert(countOccurrences(agents, "<!-- SPEC:START -->") === 1, "AGENTS.md duplicated the Spec block.");
  assert(agents.includes(".spec/router.md"), "AGENTS.md is missing router instruction.");
  assert(agents.includes("$spec init"), "AGENTS.md is missing agent-side init instruction.");
  assert(!agents.includes("spec start"), "AGENTS.md should not recommend terminal onboarding.");
  assert(countOccurrences(claude, "<!-- SPEC:START -->") === 1, "CLAUDE.md duplicated the Spec block.");
  assert(claude.includes(".spec/router.md"), "CLAUDE.md is missing router instruction.");
  assert(claude.includes("/spec init"), "CLAUDE.md is missing agent-side init instruction.");
  assert(!claude.includes("$spec"), "CLAUDE.md should not recommend Codex $spec commands.");
  assert(!claude.includes("spec start"), "CLAUDE.md should not recommend terminal onboarding.");

  assert(fs.existsSync(path.join(projectDir, ".agents", "rules", "spec.md")), "Antigravity rule missing after all-adapter install.");
}

function testContextFixture() {
  const projectDir = makeProject("start-case");
  writeFile(
    projectDir,
    "package.json",
    JSON.stringify({
      dependencies: {
        "@prisma/client": "1.0.0",
        next: "1.0.0",
        react: "1.0.0"
      },
      devDependencies: {
        typescript: "1.0.0"
      }
    })
  );
  writeFile(projectDir, "tsconfig.json", "{}");
  writeFile(
    projectDir,
    path.join("prisma", "schema.prisma"),
    ["model Company {", "  id String @id", "}", "model Invoice {", "  id String @id", "}"].join("\n")
  );
  fs.mkdirSync(path.join(projectDir, "src", "modules", "auth"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src", "modules", "invoices"), { recursive: true });

  runCli(projectDir, ["install"]);
  generateContext(projectDir, [
    "Legacy internal tool",
    "Ops team",
    "refactor",
    "PHP + Blade",
    "Fix a fragile dashboard flow",
    "Do not break login or reports",
    "Simple and clear"
  ]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  const testing = read(projectDir, ".spec/TESTING.md");
  const sessionsDir = path.join(projectDir, ".spec", "sessions");
  const sessionFiles = fs.readdirSync(sessionsDir);

  assert(context.includes("Legacy internal tool"), "CONTEXT.md was not populated by the fixture.");
  assert(context.includes("Work type hints"), "CONTEXT.md is missing work type hints.");
  assert(context.includes("Data models: Company, Invoice"), "CONTEXT.md is missing detected data models.");
  assert(context.includes("Domain hints: finance"), "CONTEXT.md is missing inferred domain hints.");
  assert(testing.includes("Do not break login or reports"), "TESTING.md is missing onboarding data.");
  assert(sessionFiles.length >= 1, "fixture did not create an initial session file.");
}

function testDocumentRefineCheck() {
  const projectDir = makeProject("document-refine-check");
  writeFile(
    projectDir,
    "package.json",
    JSON.stringify({
      dependencies: {
        next: "1.0.0",
        react: "1.0.0"
      },
      devDependencies: {
        typescript: "1.0.0"
      }
    })
  );
  writeFile(projectDir, "tsconfig.json", "{}");
  fs.mkdirSync(path.join(projectDir, "src", "modules", "auth"), { recursive: true });

  runCli(projectDir, ["install"]);
  generateContext(projectDir, ["Finance SaaS", "Small business owners", "MVP", "Next.js", "Track invoices", "Do not break auth", "Clean SaaS"]);
  documentContext(projectDir);
  refineContext(projectDir);
  const check = runCli(projectDir, ["check"]);
  const ciCheck = runCli(projectDir, ["check", "--ci"]);

  const weakProjectDir = makeProject("check-ci-missing-spec");
  const weakCheck = runCliRaw(weakProjectDir, ["check", "--ci"]);

  const architecture = read(projectDir, ".spec/ARCHITECTURE.md");
  const rules = read(projectDir, ".spec/RULES.md");
  const prompts = read(projectDir, ".spec/PROMPTS.md");

  assert(architecture.includes("Documented Project Shape"), "document did not update ARCHITECTURE.md.");
  assert(rules.includes("Refined Guardrails"), "refine did not update RULES.md.");
  assert(prompts.includes("Prompt Requirements"), "refine did not update PROMPTS.md.");
  assert(check.stdout.includes("Spec Check"), "check command did not run.");
  assert(ciCheck.stdout.includes("Ready for a guarded /spec request."), "check --ci did not pass a prepared project.");
  assert(weakCheck.status === 1, "check --ci should fail when Spec is not installed.");
  assert(!fs.existsSync(path.join(weakProjectDir, ".spec")), "check --ci should not install Spec as a side effect.");
}

function testIgnoreRules() {
  const projectDir = makeProject("ignore-case");

  for (const dir of ["node_modules", ".git", "vendor", "dist", "build", ".venv", "src"]) {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  }
  fs.writeFileSync(path.join(projectDir, "README.md"), "# Demo\n", "utf8");

  runCli(projectDir, ["install"]);
  generateContext(projectDir, ["Demo app", "Customers", "MVP", "Node.js", "Ship onboarding", "Do not break auth", "Practical"]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  assert(!context.includes("node_modules"), "Ignored directories leaked into context scan.");
  assert(!context.includes("vendor"), "Ignored directories leaked into context scan.");
  assert(!context.includes(".venv"), "Ignored directories leaked into context scan.");
}

function makeProject(name) {
  const projectDir = path.join(tempRoot, name);
  fs.mkdirSync(projectDir, { recursive: true });
  return projectDir;
}

function runCli(cwd, args, input = "") {
  const result = runCliRaw(cwd, args, input);

  assert(result.status === 0, `CLI failed: ${result.stderr || result.stdout}`);
  return result;
}

function runCliRaw(cwd, args, input = "") {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    input,
    encoding: "utf8"
  });
}

function read(projectDir, relativePath) {
  return fs.readFileSync(path.join(projectDir, relativePath), "utf8");
}

function writeFile(projectDir, relativePath, content) {
  const filePath = path.join(projectDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function countOccurrences(text, pattern) {
  return (text.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
