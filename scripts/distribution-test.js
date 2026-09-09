const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { generateContext, documentContext, refineContext } = require("./lib/context-fixture");

const root = path.resolve(__dirname, "..");
const cliPath = path.join(root, "bin", "spec.js");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "spec-distribution-"));

try {
  testRepeatedAdapterInstalls();
  testStartAcrossProjectShapes();
  testDocumentRefineCheckCommands();
  testGeneratedSkillMirrors();
  testPackTarballInstall();
  console.log("Distribution tests passed.");
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function testRepeatedAdapterInstalls() {
  const projectDir = makeProject("repeated-adapters");
  writeFile(projectDir, "AGENTS.md", ["# Existing Agent Notes", "", "<!-- SPEC:START -->", "old spec block", "<!-- SPEC:END -->"].join("\n"));
  writeFile(projectDir, "CLAUDE.md", "# Existing Claude Notes\n");

  for (let index = 0; index < 3; index += 1) {
    runCli(projectDir, ["install", "--all"]);
  }

  const agents = read(projectDir, "AGENTS.md");
  const claude = read(projectDir, "CLAUDE.md");

  assert(agents.includes("# Existing Agent Notes"), "AGENTS.md lost existing content.");
  assert(agents.includes("Spec Score assessment"), "AGENTS.md block was not upgraded.");
  assert(count(agents, "<!-- SPEC:START -->") === 1, "AGENTS.md duplicated Spec block.");
  assert(count(claude, "<!-- SPEC:START -->") === 1, "CLAUDE.md duplicated Spec block.");
  assert(fs.existsSync(path.join(projectDir, ".cursor", "rules", "spec.mdc")), "Cursor adapter missing after repeated install.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "rules", "spec.md")), "Antigravity adapter missing after repeated install.");
}

function testStartAcrossProjectShapes() {
  testNextFinanceProject();
  testLaravelProject();
  testPythonProject();
  testEmptyProject();
}

function testNextFinanceProject() {
  const projectDir = makeProject("next-finance");
  writeFile(
    projectDir,
    "package.json",
    JSON.stringify({
      dependencies: {
        "@prisma/client": "1.0.0",
        next: "1.0.0",
        react: "1.0.0",
        zod: "1.0.0"
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
    ["model Company {", "  id String @id", "}", "model User {", "  id String @id", "}", "model Invoice {", "  id String @id", "}", "model Expense {", "  id String @id", "}"].join("\n")
  );
  fs.mkdirSync(path.join(projectDir, "src", "modules", "auth"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src", "modules", "invoices"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src", "modules", "expenses"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src", "modules", "audit"), { recursive: true });

  runStart(projectDir, [
    "LedgerLane",
    "SMB finance teams",
    "MVP",
    "Next.js + PostgreSQL",
    "Launch finance workflows",
    "Do not break tenant isolation or auditability",
    "Trustworthy and low-noise"
  ]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  const product = read(projectDir, ".spec/PRODUCT.md");
  const dataModel = read(projectDir, ".spec/DATA-MODEL.md");

  assert(context.includes("Domain hints: finance, multi-tenant, audit trail, permissions"), "Finance domain hints were not inferred.");
  assert(product.includes("Product Gaps To Clarify"), "PRODUCT.md missing gap review section.");
  assert(dataModel.includes("Invoice: draft, issued, paid, overdue, void, canceled"), "Invoice statuses were not suggested.");
}

function testLaravelProject() {
  const projectDir = makeProject("laravel-project");
  writeFile(projectDir, "composer.json", JSON.stringify({ require: { "laravel/framework": "^11.0" } }));
  writeFile(projectDir, "artisan", "");
  fs.mkdirSync(path.join(projectDir, "routes"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "database", "migrations"), { recursive: true });
  fs.mkdirSync(path.join(projectDir, "resources", "views"), { recursive: true });

  runStart(projectDir, ["Back office", "Ops", "production", "Laravel + MySQL", "Repair billing reports", "Do not break login", "Simple"]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  assert(context.includes("PHP, Laravel"), "Laravel stack was not detected.");
  assert(context.includes("routes directory found"), "Laravel routes signal missing.");
}

function testPythonProject() {
  const projectDir = makeProject("python-project");
  writeFile(projectDir, "pyproject.toml", "[project]\nname = \"ledger-api\"\n");
  fs.mkdirSync(path.join(projectDir, "src"), { recursive: true });

  runStart(projectDir, ["Ledger API", "Developers", "MVP", "Python", "Create API baseline", "Do not expose secrets", "Plain"]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  assert(context.includes("Python"), "Python stack was not detected.");
}

function testEmptyProject() {
  const projectDir = makeProject("empty-project");
  runStart(projectDir, ["New idea", "Founders", "Idea", "Unknown", "Explore MVP", "Do not overbuild", "Clean"]);

  const context = read(projectDir, ".spec/CONTEXT.md");
  assert(context.includes("Probable stack: Unknown"), "Empty project should keep unknown stack.");
  assert(fs.readdirSync(path.join(projectDir, ".spec", "sessions")).length >= 1, "Empty project did not create a session.");
}

function testGeneratedSkillMirrors() {
  const projectDir = makeProject("skill-mirrors");
  runCli(projectDir, ["install", "--codex"]);
  runCli(projectDir, ["install", "--claude"]);

  assert(fs.existsSync(path.join(projectDir, ".spec", "router.md")), "Installed .spec is missing router.md.");
  assert(fs.existsSync(path.join(projectDir, ".spec", "commands", "init.md")), "Installed .spec is missing agent commands.");
  assert(fs.existsSync(path.join(projectDir, ".spec", "modules", "work-classifier.md")), "Installed .spec is missing runtime modules.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "modules", "spec-score.md")), "Codex skill mirror missing spec-score module.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "commands", "init.md")), "Codex skill mirror missing init command.");
  assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "agents", "openai.yaml")), "Codex skill mirror missing OpenAI metadata.");
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "modules", "product-gap-review.md")), "Claude skill mirror missing product-gap-review module.");
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "commands", "init.md")), "Claude skill mirror missing init command.");
  assert(fs.existsSync(path.join(projectDir, ".claude", "skills", "spec", "agents", "openai.yaml")), "Claude skill mirror missing OpenAI metadata.");
}

function testDocumentRefineCheckCommands() {
  const projectDir = makeProject("document-refine-check");
  writeFile(projectDir, "package.json", JSON.stringify({ dependencies: { next: "1.0.0", react: "1.0.0" } }));
  fs.mkdirSync(path.join(projectDir, "src", "modules", "auth"), { recursive: true });

  runCli(projectDir, ["install", "--all"]);
  runStart(projectDir, ["Finance SaaS", "Small business owners", "MVP", "Next.js", "Track invoices", "Do not break auth", "Clean SaaS"]);
  documentContext(projectDir);
  refineContext(projectDir);
  const result = runCli(projectDir, ["check"]);
  const ciResult = runCli(projectDir, ["check", "--ci"]);

  assert(result.stdout.includes("Spec Check"), "check command did not produce output.");
  assert(ciResult.stdout.includes("Ready for a guarded Spec request."), "check --ci did not pass a prepared project.");
  assert(read(projectDir, ".spec/ARCHITECTURE.md").includes("Documented Project Shape"), "document command did not update architecture.");
  assert(read(projectDir, ".spec/RISKS.md").includes("Refined Risks"), "refine command did not update risks.");
}

function testPackTarballInstall() {
  const packResult = runNpm(root, ["pack", "--silent"]);
  assert(packResult.status === 0, `npm pack failed: ${packResult.error ? packResult.error.message : packResult.stderr || packResult.stdout}`);

  const tarballName = packResult.stdout.trim().split(/\r?\n/).pop();
  const tarballPath = path.join(root, tarballName);
  const projectDir = makeProject("tarball-install");

  try {
    const installResult = runNpm(projectDir, ["install", tarballPath, "--silent"]);
    assert(installResult.status === 0, `npm install tarball failed: ${installResult.error ? installResult.error.message : installResult.stderr || installResult.stdout}`);

    const binName = process.platform === "win32" ? "spec.cmd" : "spec";
    const installedBin = path.join(projectDir, "node_modules", ".bin", binName);
    const result = runCommand(projectDir, installedBin, ["install", "--all"]);

    assert(result.status === 0, `installed spec binary failed: ${result.error ? result.error.message : result.stderr || result.stdout}`);
    const checkResult = runCommand(projectDir, installedBin, ["check"]);
    assert(checkResult.status === 0, `installed spec check failed: ${checkResult.error ? checkResult.error.message : checkResult.stderr || checkResult.stdout}`);
    assert(fs.existsSync(path.join(projectDir, ".spec", "SKILL.md")), "Tarball-installed binary did not create .spec/SKILL.md.");
    assert(fs.existsSync(path.join(projectDir, ".spec", "router.md")), "Tarball-installed binary did not create .spec/router.md.");
    assert(fs.existsSync(path.join(projectDir, ".spec", "commands", "init.md")), "Tarball-installed binary did not create .spec/commands/init.md.");
    assert(fs.existsSync(path.join(projectDir, ".agents", "skills", "spec", "agents", "openai.yaml")), "Tarball-installed binary did not create skill OpenAI metadata.");
    assert(!fs.existsSync(path.join(projectDir, "node_modules", "spec-skill", "evals")), "Tarball unexpectedly included evals.");
    assert(!fs.existsSync(path.join(projectDir, "node_modules", "spec-skill", "examples")), "Tarball unexpectedly included examples.");
  } finally {
    fs.rmSync(tarballPath, { force: true });
  }
}

function runStart(projectDir, answers) {
  if (!fs.existsSync(path.join(projectDir, ".spec"))) {
    runCli(projectDir, ["install"]);
  }
  generateContext(projectDir, answers);
}

function runCli(cwd, args, input = "") {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    input,
    encoding: "utf8"
  });

  assert(result.status === 0, `CLI failed: ${result.stderr || result.stdout}`);
  return result;
}

function runNpm(cwd, args) {
  if (process.platform === "win32") {
    return spawnSync("cmd.exe", ["/c", "npm", ...args], { cwd, encoding: "utf8" });
  }

  return spawnSync("npm", args, { cwd, encoding: "utf8" });
}

function runCommand(cwd, command, args) {
  if (process.platform === "win32") {
    return spawnSync("cmd.exe", ["/c", command, ...args], { cwd, encoding: "utf8" });
  }

  return spawnSync(command, args, { cwd, encoding: "utf8" });
}

function makeProject(name) {
  const projectDir = path.join(tempRoot, name);
  fs.mkdirSync(projectDir, { recursive: true });
  return projectDir;
}

function writeFile(projectDir, relativePath, content) {
  const filePath = path.join(projectDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function read(projectDir, relativePath) {
  return fs.readFileSync(path.join(projectDir, relativePath), "utf8");
}

function count(text, pattern) {
  return (text.match(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
