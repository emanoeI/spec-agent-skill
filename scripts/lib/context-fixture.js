// Test-only helper.
//
// This module generates a populated `.spec/` context the way the deprecated
// interactive `spec start` / `spec document` / `spec refine` terminal commands
// used to. Those commands were removed from the public CLI: the only terminal
// entry points are `install`, `help` and `check --ci`. Onboarding, documenting
// and refining now happen inside the coding agent.
//
// The generation logic still has value as a test fixture, so it lives here and
// is called directly by the smoke and distribution tests instead of shelling
// out to the binary.

const fs = require("fs");
const path = require("path");

const SPEC_DIRNAME = ".spec";
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

const QUESTION_KEYS = ["project", "audience", "stage", "stack", "goal", "constraints", "ux"];

// Build a populated .spec/ context from onboarding answers, mimicking the old
// interactive `spec start`. `answers` is an array in QUESTION_KEYS order.
function generateContext(targetDir, answers) {
  const answerMap = {};
  QUESTION_KEYS.forEach((key, index) => {
    answerMap[key] = (answers[index] || "").trim() || "Not provided yet.";
  });

  const scan = scanProject(targetDir);
  writeContextFiles(targetDir, answerMap, scan);
}

// Mimics the old `spec document`: re-scan the repo and update memory files.
function documentContext(targetDir) {
  const specDir = path.join(targetDir, SPEC_DIRNAME);
  const scan = scanProject(targetDir);
  const timestamp = new Date().toISOString();

  upsertSection(
    path.join(specDir, "CONTEXT.md"),
    "Project Scan",
    [
      "- Probable stack: " + scan.probableStack.join(", "),
      "- Signals: " + (scan.signals.length ? scan.signals.join("; ") : "No strong signals found."),
      "- Existing modules: " + (scan.moduleHints.length ? scan.moduleHints.join(", ") : "No clear modules detected."),
      "- Data models: " + (scan.prismaModels.length ? scan.prismaModels.join(", ") : "No schema models detected."),
      "- Domain hints: " + (scan.domainHints.length ? scan.domainHints.join(", ") : "No domain hints detected."),
      "- Key files: " + (scan.files.length ? scan.files.join(", ") : "None detected."),
      "- Key directories: " + (scan.directories.length ? scan.directories.join(", ") : "None detected."),
      "- Last documented: " + timestamp
    ].join("\n")
  );

  upsertSection(
    path.join(specDir, "ARCHITECTURE.md"),
    "Documented Project Shape",
    [
      "- Stack detected: " + scan.probableStack.join(", "),
      "- Modules detected: " + (scan.moduleHints.length ? scan.moduleHints.join(", ") : "No clear modules detected."),
      "- Models detected: " + (scan.prismaModels.length ? scan.prismaModels.join(", ") : "No schema models detected."),
      "- Service boundaries: " + suggestServiceBoundaries(scan),
      "- Client responsibility: collect input, show friendly validation messages and handle loading, empty and error states.",
      "- Server responsibility: enforce authorization, validation, tenant/data boundaries, status transitions, audit logs and persistence."
    ].join("\n")
  );

  upsertSection(
    path.join(specDir, "DATA-MODEL.md"),
    "Documented Data Signals",
    [
      "- Core entities: " + (scan.prismaModels.length ? scan.prismaModels.join(", ") : "Map entities before implementation."),
      "- Official statuses: " + suggestStatuses(scan),
      "- Sensitive fields: " + suggestSensitiveFields(scan),
      "- Required relationships: " + suggestRelationships(scan),
      "- Protected data: " + suggestProtectedData(scan)
    ].join("\n")
  );
}

// Mimics the old `spec refine`: harden rules, risks, decisions and prompts.
function refineContext(targetDir) {
  const specDir = path.join(targetDir, SPEC_DIRNAME);
  const scan = scanProject(targetDir);
  const timestamp = new Date().toISOString();

  appendUniqueLines(path.join(specDir, "RULES.md"), [
    "## Refined Guardrails",
    "- No final implementation prompt without domain research, work classification, Spec Score, impact, tests and rollback.",
    "- Never rely on front-end validation alone.",
    "- For existing projects, preserve current behavior before changing structure.",
    "- For sensitive flows, require server-side validation, authorization, logs and error handling."
  ]);

  appendUniqueLines(path.join(specDir, "RISKS.md"), [
    "## Refined Risks",
    "- Weak business rules can turn a good prompt into unsafe code.",
    "- Missing authorization can expose user-owned or tenant-owned data.",
    "- Broad refactors can break working flows without clear rollback.",
    "- Missing statuses can create inconsistent lifecycle behavior."
  ]);

  upsertSection(
    path.join(specDir, "DECISIONS.md"),
    "Refinement Notes",
    [
      "- " + timestamp + ": Spec refinement completed.",
      "- Domain hints reviewed: " + (scan.domainHints.length ? scan.domainHints.join(", ") : "No domain hints detected."),
      "- Modules reviewed: " + (scan.moduleHints.length ? scan.moduleHints.join(", ") : "No clear modules detected.")
    ].join("\n")
  );

  upsertSection(
    path.join(specDir, "PROMPTS.md"),
    "Prompt Requirements",
    [
      "- Include context, work type, domain research, product gaps, project impact and rollback.",
      "- Include server-side validation and authorization where data changes.",
      "- Include minimum tests and memory update.",
      "- Hold or narrow dangerous requests instead of obeying broad rewrites."
    ].join("\n")
  );
}

function scanProject(targetDir) {
  const entries = safeReadDir(targetDir);
  const names = entries.map((entry) => entry.name);
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const packageJson = readJsonIfExists(path.join(targetDir, "package.json"));
  const composerJson = readJsonIfExists(path.join(targetDir, "composer.json"));
  const prismaSchemaPath = path.join(targetDir, "prisma", "schema.prisma");
  const prismaModels = readPrismaModels(prismaSchemaPath);
  const nestedDirs = collectProjectDirs(targetDir, 3);
  const signals = [];
  const stack = [];

  if (packageJson) {
    signals.push("package.json found");
    addUnique(stack, "Node.js");
    detectJavaScriptStack(targetDir, packageJson, dirs, stack, signals);
  }

  if (composerJson) {
    signals.push("composer.json found");
    addUnique(stack, "PHP");
    detectPhpStack(composerJson, names, dirs, stack, signals);
  }

  if (files.includes("README.md")) {
    signals.push("README.md found");
  }
  if (files.includes("artisan")) {
    signals.push("artisan found");
    addUnique(stack, "Laravel");
  }
  if (files.includes("pyproject.toml") || files.includes("requirements.txt")) {
    signals.push("Python project signals found");
    addUnique(stack, "Python");
  }
  if (fs.existsSync(prismaSchemaPath)) {
    signals.push("Prisma schema found");
    addUnique(stack, "Prisma");
  }
  if (prismaModels.length) {
    signals.push(`data models found: ${prismaModels.join(", ")}`);
  }

  const moduleHints = findModuleHints(dirs, nestedDirs).slice(0, 16);

  return {
    probableStack: stack.length ? stack : ["Unknown"],
    hasSpec: names.includes(".spec"),
    signals,
    moduleHints,
    prismaModels,
    domainHints: inferDomainHints(moduleHints, prismaModels, `${files.join(" ")} ${dirs.join(" ")}`),
    files: files
      .filter((file) =>
        [
          "README.md",
          "package.json",
          "composer.json",
          "artisan",
          "vite.config.js",
          "vite.config.ts",
          "pyproject.toml",
          "requirements.txt",
          "tsconfig.json"
        ].includes(file)
      )
      .sort(),
    directories: dirs
      .filter((dir) =>
        ["app", "components", "database", "migrations", "prisma", "resources", "routes", "src", "storage", "views"].includes(dir)
      )
      .sort()
  };
}

function safeReadDir(targetDir) {
  return fs
    .readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => !IGNORED_DIRS.has(entry.name));
}

function collectProjectDirs(targetDir, maxDepth, currentDepth = 0, relativeBase = "") {
  if (currentDepth >= maxDepth) {
    return [];
  }

  const dirs = [];

  for (const entry of safeReadDir(targetDir)) {
    if (!entry.isDirectory()) {
      continue;
    }

    const relativePath = path.join(relativeBase, entry.name);
    const normalized = relativePath.replace(/\\/g, "/");

    if (normalized === "storage/logs" || normalized.includes("/storage/logs")) {
      continue;
    }

    dirs.push(normalized);
    dirs.push(...collectProjectDirs(path.join(targetDir, entry.name), maxDepth, currentDepth + 1, relativePath));
  }

  return dirs;
}

function findModuleHints(rootDirs, nestedDirs) {
  const hints = new Set(rootDirs.filter((dir) => !IGNORED_DIRS.has(dir)));

  for (const dir of nestedDirs) {
    const parts = dir.split("/");
    const last = parts[parts.length - 1];

    if (last === "modules") {
      continue;
    }

    if (parts.includes("modules") || parts.includes("features") || parts.includes("domains")) {
      hints.add(last);
      continue;
    }

    if (["auth", "billing", "cashflow", "dashboard", "expenses", "invoices", "orders", "payments", "users", "audit"].includes(last)) {
      hints.add(last);
    }
  }

  return [...hints];
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

  if (/(invoice|expense|cashflow|payment|billing|finance|ledger)/.test(text)) {
    hints.push("finance");
  }
  if (/(company|tenant|organization|workspace)/.test(text)) {
    hints.push("multi-tenant");
  }
  if (/(audit|log|history)/.test(text)) {
    hints.push("audit trail");
  }
  if (/(auth|user|role|permission)/.test(text)) {
    hints.push("permissions");
  }

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

function detectJavaScriptStack(targetDir, packageJson, dirs, stack, signals) {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  if (deps.react) addUnique(stack, "React");
  if (deps.next) addUnique(stack, "Next.js");
  if (deps.vue) addUnique(stack, "Vue");
  if (deps.nuxt) addUnique(stack, "Nuxt");
  if (deps.svelte) addUnique(stack, "Svelte");
  if (deps.express) addUnique(stack, "Express");
  if (deps.typescript || fs.existsSync(path.join(targetDir, "tsconfig.json"))) addUnique(stack, "TypeScript");
  if (deps.vite || dirs.includes("src")) signals.push("frontend app signals found");
}

function detectPhpStack(composerJson, names, dirs, stack, signals) {
  const deps = {
    ...composerJson.require,
    ...composerJson["require-dev"]
  };

  if (deps["laravel/framework"] || names.includes("artisan")) addUnique(stack, "Laravel");
  if (deps["symfony/framework-bundle"]) addUnique(stack, "Symfony");
  if (dirs.includes("routes")) signals.push("routes directory found");
  if (dirs.includes("database") || dirs.includes("migrations")) signals.push("database or migrations directory found");
  if (dirs.includes("resources") || dirs.includes("views")) signals.push("views/resources directory found");
}

function addUnique(list, value) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function writeContextFiles(targetDir, answers, scan) {
  const specDir = path.join(targetDir, SPEC_DIRNAME);
  const timestamp = new Date().toISOString();
  const dateStamp = timestamp.slice(0, 10);
  const sessionSlug = slugify(answers.goal || answers.project || "initial-context");
  const sessionPath = path.join(specDir, "sessions", `${dateStamp}-${sessionSlug}.md`);

  fs.mkdirSync(path.join(specDir, "sessions"), { recursive: true });

  fs.writeFileSync(
    path.join(specDir, "CONTEXT.md"),
    `# Context

## Project
- Name or summary: ${answers.project}
- Audience: ${answers.audience}
- Stage: ${answers.stage}
- Current stack: ${answers.stack}
- Main goal or current pain: ${answers.goal}

## Constraints
- Must not break or happen: ${answers.constraints}
- UX/UI direction: ${answers.ux}

## Project Scan
- Probable stack: ${scan.probableStack.join(", ")}
- Existing .spec/: ${scan.hasSpec ? "yes" : "no"}
- Signals: ${scan.signals.length ? scan.signals.join("; ") : "No strong signals found."}
- Existing modules: ${scan.moduleHints.length ? scan.moduleHints.join(", ") : "No clear modules detected."}
- Data models: ${scan.prismaModels.length ? scan.prismaModels.join(", ") : "No schema models detected."}
- Domain hints: ${scan.domainHints.length ? scan.domainHints.join(", ") : "No domain hints detected."}
- Key files: ${scan.files.length ? scan.files.join(", ") : "None detected."}
- Key directories: ${scan.directories.length ? scan.directories.join(", ") : "None detected."}
- Work type hints: ${suggestWorkTypes(answers.stage, answers.goal)}

## Updated
- Last onboarding run: ${timestamp}
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "PRODUCT.md"),
    `# Product

## Summary
- What this project is: ${answers.project}
- Who it serves: ${answers.audience}
- Main goal or current pain: ${answers.goal}

## Stage
- Current stage: ${answers.stage}

## Core Flows
- Primary flow: ${suggestPrimaryFlow(answers.goal, scan)}
- Secondary flow: ${suggestSecondaryFlow(scan)}
- Admin or support flow: ${suggestAdminFlow(scan)}

## Product Gaps To Clarify
- Undefined rule: ${suggestProductGap(scan)}
- Missing status: ${suggestMissingStatus(scan)}
- Risky exception: ${suggestRiskyException(scan)}

## Scope Notes
- Keep delivery aligned with the current stack unless a change is justified.
- Prefer a thin MVP with clear business value.
- Protect existing behavior called out in CONTEXT.md.
- If the request becomes a refactor, preserve current behavior before redesigning.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "ARCHITECTURE.md"),
    `# Architecture

## Current Baseline
- Declared stack: ${answers.stack}
- Probable stack from scan: ${scan.probableStack.join(", ")}

## Existing Signals
- ${scan.signals.length ? scan.signals.join("\n- ") : "No strong architecture signals found yet."}

## Existing Areas
- ${scan.moduleHints.length ? scan.moduleHints.join("\n- ") : "No clear modules detected."}

## Data Model Signals
- ${scan.prismaModels.length ? scan.prismaModels.join("\n- ") : "No schema models detected."}

## Foundation Pass
- Suggested structure: keep product modules under the current app/source tree and isolate domain logic from UI.
- Client responsibility: collect input, show friendly validation messages and handle loading, empty and error states.
- Server responsibility: enforce authorization, tenant isolation, data validation, status transitions, audit logs and persistence.
- Service boundaries: ${suggestServiceBoundaries(scan)}

## Guidance
- Reuse current conventions before adding new layers.
- Avoid overengineering for the current stage: ${answers.stage}
- Add server-side validation, logs and tests when relevant.
- Do not rewrite the project from zero when an incremental change is enough.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "DESIGN.md"),
    `# Design

## Direction
- Visual and UX direction: ${answers.ux}

## Product Notes
- Target users: ${answers.audience}
- Main goal or pain: ${answers.goal}

## Guardrails
- Keep language non-technical when writing UI copy.
- Prefer a clear primary action and obvious empty/error states.
- Do not ship generic, cluttered vibecoding UI.
- Preserve trusted flows before polishing visual details.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "RULES.md"),
    `# Rules

## Non-Negotiables
- Must not break or happen: ${answers.constraints}
- Every /spec response must read the current .spec/ context first.
- Prefer short, technical and actionable answers.
- Never rely on front-end validation alone.
- No final prompt without domain research, work classification, impact analysis, rollback and minimum tests.

## Delivery Rules
- Respect the current project stage: ${answers.stage}
- Keep scope aligned with the main goal or pain: ${answers.goal}
- Reuse the current stack unless a strong reason is stated.
- Preserve behavior before refactoring structure.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "RISKS.md"),
    `# Risks

## Current Risks
- Missing detail can weaken first prompts if future /spec requests ignore this context.
- Existing constraints may be violated if changes skip server-side validation or permission checks.
- Current stack assumptions may be wrong if the repository scan was incomplete.
- A refactor request could break behavior if it is treated like a greenfield rewrite.

## Watch List
- Constraint to protect: ${answers.constraints}
- UX direction to preserve: ${answers.ux}
- Areas to review before changes: ${scan.moduleHints.length ? scan.moduleHints.join(", ") : "Map the existing project areas first."}
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "TESTING.md"),
    `# Testing

## Current Baseline
- Protect this behavior: ${answers.constraints}
- Current stage: ${answers.stage}
- Main goal or pain: ${answers.goal}

## Minimum Test Checklist
- Verify the core happy path still works.
- Verify user permissions still block the wrong access.
- Verify existing data remains readable after changes.
- Verify error states stay clear and actionable.

## Non-Regression
- Keep the current critical flow working before and after changes.
- Do not change behavior silently during refactors.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "DECISIONS.md"),
    `# Decisions

## Current Decisions
- ${timestamp}: Spec onboarding completed.
- ${timestamp}: Primary audience recorded as ${answers.audience}.
- ${timestamp}: Current stage recorded as ${answers.stage}.
- ${timestamp}: Current stack recorded as ${answers.stack}.
- ${timestamp}: Main goal or pain recorded as ${answers.goal}.

## Decision Ledger Format

Use this format for important choices:

\`\`\`md
## Decision: <title>

Date: YYYY-MM-DD
Status: proposed | accepted | revisited

### Context
<What forced this decision?>

### Decision
<What was chosen?>

### Why
<Why this is the safest useful choice now?>

### Tradeoffs
<What this makes easier and what it postpones?>

### Revisit If
<Signals that should trigger a new decision>
\`\`\`
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "OPERATIONS.md"),
    `# Operations

## Deployment Notes
- Stage: ${answers.stage}
- Protect from breakage: ${answers.constraints}

## Rollback Basics
- Prefer incremental delivery over full rewrites.
- Keep rollback steps visible before schema, auth or permission changes.
- Do not ship risky changes without a restore path.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "PERMISSIONS.md"),
    `# Permissions

## Current Notes
- Target users: ${answers.audience}
- Protect this behavior: ${answers.constraints}

## Review Checklist
- Who can view each resource?
- Who can create, update or delete data?
- What must stay blocked for unauthorized users?
- Which sensitive actions need extra confirmation or audit?

## Inferred Permission Boundaries
- Tenant isolation: ${scan.domainHints.includes("multi-tenant") ? "required for company-scoped records." : "review if multiple accounts or organizations exist."}
- Sensitive actions: ${suggestSensitiveActions(scan)}
- Audit expectation: ${scan.domainHints.includes("audit trail") ? "audit sensitive changes." : "add audit rules when financial, auth or permission changes appear."}
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "DATA-MODEL.md"),
    `# Data Model

## Current Notes
- Project summary: ${answers.project}
- Main goal or pain: ${answers.goal}

## Review Checklist
- Core entities: ${scan.prismaModels.length ? scan.prismaModels.join(", ") : "Map entities before implementation."}
- Official statuses: ${suggestStatuses(scan)}
- Sensitive fields: ${suggestSensitiveFields(scan)}
- Required relationships: ${suggestRelationships(scan)}
- Data that must not be lost during refactors: ${suggestProtectedData(scan)}
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "ROADMAP.md"),
    `# Roadmap

## Next
- Turn the main goal or pain into a concrete scoped feature list.
- Identify must-have business rules and acceptance criteria.
- Create session notes in .spec/sessions/ for important /spec requests.
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "PROMPTS.md"),
    `# Prompts

## Usage
- Ask inside the agent: $spec <what you want to build or change>
- Slash-command agents may use: /spec <what you want to build or change>
- Expect: short verdict, work type, domain research, risks, impact, improved prompt, tests and memory update.

## Current Focus
- Main goal or current pain: ${answers.goal}
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(specDir, "RED-FLAGS.md"),
    `# Red Flags

## Watch List
- Weak authentication
- Missing authorization
- Resource access by ID without permission checks
- Front-end-only validation
- Payload without limits
- Unsafe uploads
- Undefined statuses
- Business rules inside views
- Duplicated business rules
- Missing history or audit trail
- Refactor without behavior preservation
- OAuth without error flow
- Payments without idempotency
- Financial changes without logs
- Destructive deletion without confirmation
- Exposed sensitive data
- Technical copy shown to end users
- Hardcoded dashboard data
- Generic UI without a real flow
- Missing empty and error states
`,
    "utf8"
  );

  fs.writeFileSync(
    sessionPath,
    `# Session: Initial context

Date: ${dateStamp}

## Request

Initial Spec onboarding for ${answers.project}.

## Work type

${classifyInitialWorkType(answers.stage)}

## Decisions

- Project recorded as ${answers.project}.
- Stage recorded as ${answers.stage}.
- Current stack recorded as ${answers.stack}.
- Main goal or pain recorded as ${answers.goal}.

## Risks

- ${answers.constraints}
- Scan assumptions may need review before sensitive changes.

## Rules added

- Read .spec/ before every /spec request.
- No final prompt without domain research, impact review and tests.

## Prompt generated

- Initial onboarding only. No implementation prompt generated yet.

## Follow-up

- Use /spec for the next feature, refactor or repair request.
- Update .spec files when new rules, risks or decisions appear.
`,
    "utf8"
  );
}

function upsertSection(filePath, heading, content) {
  const section = `## ${heading}\n${content}\n`;
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : `# ${heading}\n\n`;
  const pattern = new RegExp(`## ${escapeRegExp(heading)}\\n[\\s\\S]*?(?=\\n## |$)`, "m");

  if (pattern.test(existing)) {
    fs.writeFileSync(filePath, existing.replace(pattern, section.trimEnd()), "utf8");
    return;
  }

  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(filePath, `${existing}${separator}${section}`, "utf8");
}

function appendUniqueLines(filePath, lines) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const additions = lines.filter((line) => !existing.includes(line));

  if (!additions.length) {
    return;
  }

  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(filePath, `${existing}${separator}${additions.join("\n")}\n`, "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function classifyInitialWorkType(stage) {
  const normalized = String(stage || "").toLowerCase();
  if (normalized.includes("refactor")) return "Refactor";
  if (normalized.includes("production")) return "Feature";
  return "Greenfield";
}

function suggestWorkTypes(stage, goal) {
  const text = `${stage} ${goal}`.toLowerCase();
  const suggestions = [];

  if (text.includes("oauth") || text.includes("payment") || text.includes("upload") || text.includes("auth")) {
    suggestions.push("Sensitive integration");
  }
  if (text.includes("bug") || text.includes("repair") || text.includes("fix") || text.includes("broken")) {
    suggestions.push("Repair");
  }
  suggestions.push(classifyInitialWorkType(stage));

  return [...new Set(suggestions)].join(", ");
}

function suggestPrimaryFlow(goal, scan) {
  const goalText = String(goal || "").toLowerCase();

  if (scan.domainHints.includes("finance")) {
    if (goalText.includes("invoice")) {
      return "Create, review and track invoices with server-side validation and audit trail.";
    }
    return "Capture financial records, review cash flow and protect company-scoped data.";
  }

  return "Map the main user journey before implementation.";
}

function suggestSecondaryFlow(scan) {
  if (scan.moduleHints.includes("expenses")) {
    return "Capture, categorize and review expenses with permission checks.";
  }
  if (scan.moduleHints.includes("audit")) {
    return "Review sensitive activity and audit history.";
  }
  return "Identify the second most important user flow during the first /spec session.";
}

function suggestAdminFlow(scan) {
  if (scan.domainHints.includes("permissions")) {
    return "Manage users, roles and access boundaries without cross-tenant leakage.";
  }
  return "Define admin/support responsibilities if the product needs operational review.";
}

function suggestProductGap(scan) {
  if (scan.domainHints.includes("finance")) {
    return "Define who can approve, edit, delete or export financial records.";
  }
  if (scan.domainHints.includes("permissions")) {
    return "Define roles and ownership boundaries.";
  }
  return "Identify the first business rule that cannot be guessed safely.";
}

function suggestMissingStatus(scan) {
  const models = scan.prismaModels.join(" ").toLowerCase();

  if (models.includes("invoice")) {
    return "Invoice statuses such as draft, issued, paid, overdue, void and canceled.";
  }
  if (models.includes("expense")) {
    return "Expense statuses such as draft, submitted, approved, rejected and reimbursed.";
  }
  return "List official statuses for entities with lifecycle transitions.";
}

function suggestRiskyException(scan) {
  if (scan.domainHints.includes("finance")) {
    return "Editing or deleting financial records after reports, invoices or audit logs depend on them.";
  }
  if (scan.domainHints.includes("multi-tenant")) {
    return "User accessing records from another tenant through guessed IDs.";
  }
  return "Define the exception that would cause data loss, permission leakage or user confusion.";
}

function suggestServiceBoundaries(scan) {
  const modules = scan.moduleHints;
  const boundaries = [];

  if (modules.includes("auth")) boundaries.push("auth owns sessions, roles and tenant access");
  if (modules.includes("invoices")) boundaries.push("invoices owns invoice lifecycle and totals");
  if (modules.includes("expenses")) boundaries.push("expenses owns expense capture and approval");
  if (modules.includes("cashflow")) boundaries.push("cashflow reads financial records for summaries, not source-of-truth writes");
  if (modules.includes("audit")) boundaries.push("audit records sensitive changes across modules");

  return boundaries.length ? boundaries.join("; ") : "define module boundaries before adding services.";
}

function suggestSensitiveActions(scan) {
  if (scan.domainHints.includes("finance")) {
    return "creating, editing, deleting, exporting and approving financial records.";
  }
  if (scan.domainHints.includes("permissions")) {
    return "changing roles, ownership and access rules.";
  }
  return "identify actions that need confirmation, audit or extra authorization.";
}

function suggestStatuses(scan) {
  const suggestions = [];
  const models = scan.prismaModels.join(" ").toLowerCase();

  if (models.includes("invoice")) suggestions.push("Invoice: draft, issued, paid, overdue, void, canceled");
  if (models.includes("expense")) suggestions.push("Expense: draft, submitted, approved, rejected, reimbursed");

  return suggestions.length ? suggestions.join("; ") : "Define official statuses for lifecycle entities.";
}

function suggestSensitiveFields(scan) {
  if (scan.domainHints.includes("finance")) {
    return "amounts, totals, company identifiers, user roles, audit metadata and exported financial data.";
  }
  return "Mark personal, financial, auth and permission fields before implementation.";
}

function suggestRelationships(scan) {
  const models = scan.prismaModels;
  const relationships = [];

  if (models.includes("Company") && models.includes("User")) relationships.push("Company has many users");
  if (models.includes("Company") && models.includes("Invoice")) relationships.push("Company has many invoices");
  if (models.includes("Company") && models.includes("Expense")) relationships.push("Company has many expenses");

  return relationships.length ? relationships.join("; ") : "Define ownership relationships and tenant boundaries.";
}

function suggestProtectedData(scan) {
  if (scan.domainHints.includes("finance")) {
    return "financial totals, invoice history, expense history, tenant ownership, user roles and audit records.";
  }
  return "existing records, ownership fields, permissions and audit history.";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "initial-context";
}

module.exports = {
  QUESTION_KEYS,
  generateContext,
  documentContext,
  refineContext,
  scanProject
};
