#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(ROOT_DIR, "skill", "templates");
const SOURCE_SKILL_DIR = path.join(ROOT_DIR, "skill");
const ADAPTERS_DIR = path.join(ROOT_DIR, "adapters");
const SPEC_DIRNAME = ".spec";
const SPEC_FILES = [
  "CONTEXT.md",
  "PRODUCT.md",
  "ARCHITECTURE.md",
  "DESIGN.md",
  "RULES.md",
  "GLOSSARY.md",
  "DECISIONS.md",
  "RISKS.md",
  "ROADMAP.md",
  "PROMPTS.md",
  "TESTING.md",
  "OPERATIONS.md",
  "PERMISSIONS.md",
  "DATA-MODEL.md",
  "RED-FLAGS.md"
];
const IGNORED_DIRS = new Set([
  ".git",
  ".agents",
  ".claude",
  ".cursor",
  ".idea",
  ".next",
  ".nuxt",
  ".spec",
  ".venv",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "tmp",
  "vendor"
]);
const AGENTS_SPEC_BLOCK = `## Spec

Before any implementation prompt, read \`.spec/SKILL.md\` and inspect the \`.spec/\` directory.
Follow \`.spec/router.md\` to choose the routed module set, then format the answer with \`.spec/output-contract.md\`.
Use \`$spec init\` inside Codex to initialize project context. Do not ask the user to run \`/spec\` in the operating-system terminal.
Use the user's language during onboarding.

Spec is a Markdown-only first-prompt hardener for AI coding agents. It does not generate code by itself. It guides the active agent to research the domain, classify the work, protect existing behavior, detect risks, define tests, and produce safer implementation prompts.
Spec is not anti-vibecoding. It helps the active coding agent make safer decisions before implementation.

Required rule:

No final implementation prompt without:
- reading \`.spec/\`
- domain research
- work classification
- Foundation Score assessment
- Spec Score assessment
- red flag detection
- project impact analysis
- existing behavior preservation
- regression risks
- MVP slice
- decision ledger update
- agent task pack when useful
- rollback plan
- minimum test checklist
- context update suggestion`;
const CLAUDE_SPEC_BLOCK = `## Spec

Use Spec before implementation planning.

Always read \`.spec/SKILL.md\` and inspect \`.spec/\` before answering \`/spec\` requests.
Follow \`.spec/router.md\` to choose the routed module set, then format the answer with \`.spec/output-contract.md\`.
Use \`/spec init\` inside Claude Code to initialize project context. Do not ask the user to run \`/spec\` in the operating-system terminal.
Use the user's language during onboarding.

Spec is Markdown-only. It does not add AI, backend, API or tracking.
It helps Claude Code make safer decisions before implementation.

No final implementation prompt without:
- reading \`.spec/\`
- domain research
- work classification
- Foundation Score assessment
- Spec Score assessment
- red flag detection
- project impact analysis
- existing behavior preservation
- regression risks
- MVP slice
- decision ledger update
- agent task pack when useful
- rollback plan
- minimum test checklist
- context update suggestion`;

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const targetDir = process.cwd();

  if (!command || command === "help") {
    printHelp();
    return;
  }

  if (command === "install") {
    const mode = parseInstallMode(args.slice(1));
    installSpec(targetDir);

    if (mode === "generic" || mode === "default") {
      installGenericAdapter(targetDir);
      printAdapterMessage("generic agents", [".spec/", "AGENTS.md"], "spec");
      return;
    }

    if (mode === "codex") {
      installCodexAdapter(targetDir);
      printAdapterMessage("Codex", [".spec/", ".agents/skills/spec/", "AGENTS.md"], "$spec");
      return;
    }

    if (mode === "claude") {
      installClaudeAdapter(targetDir);
      printAdapterMessage("Claude Code", [".spec/", ".claude/skills/spec/", "CLAUDE.md"], "/spec");
      return;
    }

    if (mode === "cursor") {
      installCursorAdapter(targetDir);
      printAdapterMessage("Cursor", [".spec/", ".cursor/rules/spec.mdc", "AGENTS.md"], "/spec");
      return;
    }

    if (mode === "antigravity") {
      installAntigravityAdapter(targetDir);
      printAdapterMessage("Antigravity", [".spec/", ".agents/rules/spec.md"], "antigravity");
      return;
    }

    installGenericAdapter(targetDir);
    installCodexAdapter(targetDir);
    installClaudeAdapter(targetDir);
    installCursorAdapter(targetDir);
    installAntigravityAdapter(targetDir);
    printAdapterMessage("all supported agents", [
      ".spec/",
      ".agents/skills/spec/",
      ".agents/rules/spec.md",
      ".claude/skills/spec/",
      ".cursor/rules/spec.mdc",
      "AGENTS.md",
      "CLAUDE.md"
    ], "multi");
    return;
  }

  if (command === "check") {
    checkSpec(targetDir, args.slice(1));
    return;
  }

  printHelp();
  process.exitCode = 1;
}

function parseInstallMode(args) {
  const flags = new Set(args);

  if (flags.has("--all")) {
    return "all";
  }
  if (flags.has("--codex")) {
    return "codex";
  }
  if (flags.has("--claude")) {
    return "claude";
  }
  if (flags.has("--cursor")) {
    return "cursor";
  }
  if (flags.has("--antigravity")) {
    return "antigravity";
  }
  if (flags.has("--generic")) {
    return "generic";
  }
  return "default";
}

function printHelp() {
  console.log("Spec\n");
  console.log("Think before you code.\n");
  console.log("The terminal is only for installation and CI checks.");
  console.log("Onboarding and everyday use happen inside your coding agent.\n");
  console.log("Terminal commands:");
  console.log("  spec install             Install Spec for generic agents");
  console.log("  spec install --codex     Install Spec for Codex");
  console.log("  spec install --claude    Install Spec for Claude Code");
  console.log("  spec install --cursor    Install Spec for Cursor");
  console.log("  spec install --antigravity Install Spec for Antigravity");
  console.log("  spec install --all       Install all adapters");
  console.log("  spec check --ci          Check readiness with a failing exit code (for CI)");
  console.log("  spec help                Show help\n");
  console.log("After install, restart your coding agent and run inside it:");
  console.log("  Codex:            $spec init, then $spec <request>");
  console.log("  Claude/Cursor:    /spec init, then /spec <request>");
  console.log("  Generic:          spec init, then spec <request>");
}

function printAdapterMessage(label, created, dialect) {
  console.log(`Spec installed for ${label}.\n`);
  console.log("Created or updated:");
  for (const item of created) {
    console.log(`- ${item}`);
  }
  console.log("\nSpec is Markdown-only.");
  console.log("It does not generate code, add AI, backend or tracking.\n");
  console.log("Next steps:");
  console.log("1. Restart your coding agent or VS Code.");
  if (dialect === "multi") {
    console.log("2. Inside the agent, run the matching init command:");
    console.log("   Codex: $spec init");
    console.log("   Claude Code/Cursor: /spec init");
    console.log("   Antigravity: ask it to initialize Spec (with the Spec rule enabled)");
    console.log("   Generic: spec init");
    return;
  }
  if (dialect === "antigravity") {
    console.log("2. Inside Antigravity, ask it to initialize Spec with the workspace rule enabled.");
    return;
  }
  console.log(`2. Inside the agent, run: ${dialect} init`);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIfMissing(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function installSpec(targetDir) {
  const specDir = path.join(targetDir, SPEC_DIRNAME);
  const sessionsDir = path.join(specDir, "sessions");
  const promptsDir = path.join(specDir, "prompts");
  const tasksDir = path.join(specDir, "tasks");

  ensureDir(specDir);
  ensureDir(sessionsDir);
  ensureDir(promptsDir);
  ensureDir(tasksDir);
  copySkillRuntime(specDir, { includeAgentMetadata: false });
  fs.writeFileSync(path.join(specDir, "README.md"), specReadmeContent(), "utf8");

  for (const fileName of SPEC_FILES) {
    const templatePath = path.join(TEMPLATE_DIR, fileName);
    const targetPath = path.join(specDir, fileName);
    const templateContent = fs.readFileSync(templatePath, "utf8");
    writeIfMissing(targetPath, templateContent);
  }
}

function installGenericAdapter(targetDir) {
  installSpec(targetDir);
  upsertMarkedBlock(path.join(targetDir, "AGENTS.md"), AGENTS_SPEC_BLOCK);
}

function installCodexAdapter(targetDir) {
  installSpec(targetDir);
  copySkillForAgent(path.join(targetDir, ".agents", "skills", "spec"));
  upsertMarkedBlock(path.join(targetDir, "AGENTS.md"), AGENTS_SPEC_BLOCK);
}

function installClaudeAdapter(targetDir) {
  installSpec(targetDir);
  copySkillForAgent(path.join(targetDir, ".claude", "skills", "spec"));
  upsertMarkedBlock(path.join(targetDir, "CLAUDE.md"), CLAUDE_SPEC_BLOCK);
}

function installCursorAdapter(targetDir) {
  installSpec(targetDir);
  const cursorRulesDir = path.join(targetDir, ".cursor", "rules");
  ensureDir(cursorRulesDir);
  fs.writeFileSync(
    path.join(cursorRulesDir, "spec.mdc"),
    fs.readFileSync(path.join(ADAPTERS_DIR, "cursor", "spec.template.mdc"), "utf8"),
    "utf8"
  );
  upsertMarkedBlock(path.join(targetDir, "AGENTS.md"), AGENTS_SPEC_BLOCK);
}

function installAntigravityAdapter(targetDir) {
  installSpec(targetDir);
  const rulesDir = path.join(targetDir, ".agents", "rules");
  ensureDir(rulesDir);
  fs.writeFileSync(
    path.join(rulesDir, "spec.md"),
    fs.readFileSync(path.join(ADAPTERS_DIR, "antigravity", "spec.rule.md"), "utf8"),
    "utf8"
  );
}

function copySkillForAgent(destinationDir) {
  ensureDir(destinationDir);
  copySkillRuntime(destinationDir, { includeAgentMetadata: true });
}

function copySkillRuntime(destinationDir, options = {}) {
  fs.writeFileSync(path.join(destinationDir, "SKILL.md"), fs.readFileSync(path.join(SOURCE_SKILL_DIR, "SKILL.md"), "utf8"), "utf8");
  fs.writeFileSync(path.join(destinationDir, "router.md"), fs.readFileSync(path.join(SOURCE_SKILL_DIR, "router.md"), "utf8"), "utf8");
  fs.writeFileSync(path.join(destinationDir, "onboarding.md"), fs.readFileSync(path.join(SOURCE_SKILL_DIR, "onboarding.md"), "utf8"), "utf8");
  fs.writeFileSync(
    path.join(destinationDir, "output-contract.md"),
    fs.readFileSync(path.join(SOURCE_SKILL_DIR, "output-contract.md"), "utf8"),
    "utf8"
  );
  copyDirectory(path.join(SOURCE_SKILL_DIR, "commands"), path.join(destinationDir, "commands"));
  copyDirectory(path.join(SOURCE_SKILL_DIR, "modules"), path.join(destinationDir, "modules"));

  if (options.includeAgentMetadata) {
    copyDirectory(path.join(SOURCE_SKILL_DIR, "agents"), path.join(destinationDir, "agents"));
  }
}

function copyDirectory(sourceDir, destinationDir) {
  ensureDir(destinationDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.writeFileSync(destinationPath, fs.readFileSync(sourcePath, "utf8"), "utf8");
    }
  }
}

function upsertMarkedBlock(filePath, blockContent) {
  const start = "<!-- SPEC:START -->";
  const end = "<!-- SPEC:END -->";
  const fullBlock = `${start}\n${blockContent}\n${end}`;

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `${fullBlock}\n`, "utf8");
    return;
  }

  const current = fs.readFileSync(filePath, "utf8");
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, "m");

  if (pattern.test(current)) {
    fs.writeFileSync(filePath, current.replace(pattern, fullBlock), "utf8");
    return;
  }

  const suffix = current.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(filePath, `${current}${suffix}${fullBlock}\n`, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function specReadmeContent() {
  return `# Spec Context

.spec/ is the operational memory of this project.

Every coding agent using Spec should read:
- .spec/SKILL.md
- the relevant files inside .spec/
- generated prompts inside .spec/prompts/
- generated task packs inside .spec/tasks/

Spec is Markdown-only.
It does not generate code by itself.

Use Spec inside your coding agent:
- Codex: $spec init, then $spec <request>
- Claude/Cursor-style agents: /spec init, then /spec <request>

Do not type /spec in cmd, PowerShell or bash.

When Spec creates a prompt file, ask the agent to read that file instead of copying a giant prompt from chat.
When Spec creates a task pack, execute the task files in order.
`;
}

function checkSpec(targetDir, args = []) {
  const ciMode = args.includes("--ci");
  const report = buildSpecCheckReport(targetDir);

  console.log("Spec Check\n");
  for (const check of report.checks) {
    console.log(`${check.ok ? "[ok]" : "[weak]"} ${check.label}`);
    if (!check.ok) {
      console.log(`  fix: ${check.fix}`);
    }
  }

  console.log("\nVerdict:");
  if (report.failed.length === 0) {
    console.log("Ready for a guarded /spec request.");
  } else {
    console.log("Weak areas found. Strengthen Spec before trusting implementation prompts.");
    console.log("Recommended path: run the matching init command inside your coding agent:");
    console.log("- Codex: $spec init");
    console.log("- Claude Code/Cursor: /spec init");
    console.log("- Generic: spec init");
  }

  if (ciMode && report.failed.length > 0) {
    process.exitCode = 1;
  }
}

function buildSpecCheckReport(targetDir) {
  const specDir = path.join(targetDir, SPEC_DIRNAME);
  const contextPath = path.join(specDir, "CONTEXT.md");
  const productPath = path.join(specDir, "PRODUCT.md");
  const rulesPath = path.join(specDir, "RULES.md");
  const redFlagsPath = path.join(specDir, "RED-FLAGS.md");
  const testingPath = path.join(specDir, "TESTING.md");
  const operationsPath = path.join(specDir, "OPERATIONS.md");
  const promptsPath = path.join(specDir, "PROMPTS.md");
  const sessionsDir = path.join(specDir, "sessions");
  const generatedPromptsDir = path.join(specDir, "prompts");
  const generatedTasksDir = path.join(specDir, "tasks");
  const routerPath = path.join(specDir, "router.md");
  const outputContractPath = path.join(specDir, "output-contract.md");
  const modulesDir = path.join(specDir, "modules");
  const specExists = fs.existsSync(specDir);
  const scan = scanProject(targetDir);
  const context = readTextIfExists(contextPath);
  const product = readTextIfExists(productPath);

  const checks = [
    {
      label: ".spec installed",
      ok: specExists && fileContains(path.join(specDir, "SKILL.md"), "mandatory decision pipeline"),
      fix: "Run spec install, or spec install --all when testing across agents."
    },
    {
      label: "Decision router installed",
      ok: fileContains(routerPath, "## Routing Contract"),
      fix: "Run spec install to refresh .spec/router.md."
    },
    {
      label: "Output contract installed",
      ok: fileContains(outputContractPath, "## Veredito"),
      fix: "Run spec install to refresh .spec/output-contract.md."
    },
    {
      label: "Runtime modules installed",
      ok:
        fs.existsSync(path.join(modulesDir, "work-classifier.md")) &&
        fs.existsSync(path.join(modulesDir, "domain-research.md")) &&
        fs.existsSync(path.join(modulesDir, "project-protection.md")) &&
        fs.existsSync(path.join(modulesDir, "foundation-score.md")) &&
        fs.existsSync(path.join(modulesDir, "mvp-slicer.md")) &&
        fs.existsSync(path.join(modulesDir, "decision-ledger.md")) &&
        fs.existsSync(path.join(modulesDir, "agent-task-pack.md")),
      fix: "Run spec install to refresh .spec/modules/."
    },
    {
      label: "Project context filled",
      ok: hasFilledMarkdownField(context, "Name or summary"),
      fix: "Run the matching init command inside your coding agent and answer the project context questions."
    },
    {
      label: "Product context filled",
      ok: hasFilledMarkdownField(product, "What this project is"),
      fix: "Run the matching init command inside your coding agent so PRODUCT.md has usable product intent."
    },
    {
      label: "Domain signals detected",
      ok: scan.domainHints.length > 0 || scan.signals.length > 0,
      fix: "Run the matching document command inside your agent, or add enough files for Spec to infer stack/domain."
    },
    {
      label: "Business rules guardrail",
      ok: fileContains(rulesPath, "No final prompt") || fileContains(rulesPath, "Refined Guardrails"),
      fix: "Run the matching refine command inside your agent to harden business rules before prompting."
    },
    {
      label: "Security red flags",
      ok: fileContains(redFlagsPath, "Missing authorization"),
      fix: "Restore or strengthen RED-FLAGS.md security checks."
    },
    {
      label: "Regression checklist",
      ok: fileContains(testingPath, "Non-Regression") || fileContains(testingPath, "Minimum Test Checklist"),
      fix: "Restore TESTING.md and include regression checks for critical flows."
    },
    {
      label: "Rollback awareness",
      ok: fileContains(operationsPath, "Rollback"),
      fix: "Restore OPERATIONS.md and define rollback expectations for risky changes."
    },
    {
      label: "Prompt compiler requirements",
      ok: fileContains(promptsPath, "Prompt Requirements") || fileContains(promptsPath, "Usage"),
      fix: "Run the matching refine command inside your agent so final prompts must include impact, tests and rollback."
    },
    {
      label: "Session memory",
      ok: fs.existsSync(sessionsDir),
      fix: "Create .spec/sessions by running spec install, then initialize inside the agent."
    },
    {
      label: "Prompt files directory",
      ok: fs.existsSync(generatedPromptsDir),
      fix: "Run spec install to create .spec/prompts/."
    },
    {
      label: "Task files directory",
      ok: fs.existsSync(generatedTasksDir),
      fix: "Run spec install to create .spec/tasks/."
    }
  ];

  return {
    checks,
    failed: checks.filter((check) => !check.ok)
  };
}

// Minimal project scan used only by `spec check` to detect stack/domain
// signals. The richer onboarding scan lives in scripts/lib/context-fixture.js.
function scanProject(targetDir) {
  const entries = safeReadDir(targetDir);
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const packageJson = readJsonIfExists(path.join(targetDir, "package.json"));
  const composerJson = readJsonIfExists(path.join(targetDir, "composer.json"));
  const prismaModels = readPrismaModels(path.join(targetDir, "prisma", "schema.prisma"));
  const signals = [];

  if (packageJson) signals.push("package.json found");
  if (composerJson) signals.push("composer.json found");
  if (files.includes("README.md")) signals.push("README.md found");
  if (files.includes("artisan")) signals.push("artisan found");
  if (files.includes("pyproject.toml") || files.includes("requirements.txt")) signals.push("Python project signals found");
  if (prismaModels.length) signals.push(`data models found: ${prismaModels.join(", ")}`);

  const moduleHints = dirs.filter((dir) => !IGNORED_DIRS.has(dir));

  return {
    signals,
    prismaModels,
    domainHints: inferDomainHints(moduleHints, prismaModels, `${files.join(" ")} ${dirs.join(" ")}`)
  };
}

function safeReadDir(targetDir) {
  return fs
    .readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => !IGNORED_DIRS.has(entry.name));
}

function readPrismaModels(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    return [];
  }

  const schema = fs.readFileSync(schemaPath, "utf8");
  return [...schema.matchAll(/^model\s+([A-Za-z0-9_]+)/gm)].map((match) => match[1]);
}

function inferDomainHints(moduleHints, models, rawText) {
  const text = `${moduleHints.join(" ")} ${models.join(" ")} ${rawText}`.toLowerCase();
  const hints = [];

  if (/(invoice|expense|cashflow|payment|billing|finance|ledger)/.test(text)) hints.push("finance");
  if (/(company|tenant|organization|workspace)/.test(text)) hints.push("multi-tenant");
  if (/(audit|log|history)/.test(text)) hints.push("audit trail");
  if (/(auth|user|role|permission)/.test(text)) hints.push("permissions");

  return [...new Set(hints)];
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function fileContains(filePath, text) {
  return fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8").includes(text);
}

function readTextIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function hasFilledMarkdownField(text, fieldName) {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^-\\s*${escaped}:\\s*(.+)$`, "im");
  const match = text.match(pattern);
  return Boolean(match && match[1].trim());
}

try {
  main();
} catch (error) {
  console.error(`Spec failed: ${error.message}`);
  process.exitCode = 1;
}
