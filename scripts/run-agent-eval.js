const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { evaluateOutput } = require("./evaluate-agent-output");

const root = path.resolve(__dirname, "..");
const fixtureName = process.argv[2] || "repair-checkout";
const fixtureDir = path.join(root, "evals", "fixtures", fixtureName);
const inputPath = path.join(fixtureDir, "input.json");
const expectedPath = path.join(fixtureDir, "expected.json");

if (!fs.existsSync(inputPath) || !fs.existsSync(expectedPath)) {
  console.error(`Unknown eval fixture: ${fixtureName}`);
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const expected = JSON.parse(fs.readFileSync(expectedPath, "utf8"));
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `spec-agent-eval-${fixtureName}-`));
const outputPath = path.join(workspace, "agent-output.md");

try {
  run(process.execPath, [path.join(root, "bin", "spec.js"), "install", "--codex"], workspace);
  writeContext(workspace, input);

  const prompt = [
    `$spec ${input.request.replace(/^\/(?:spec)\s*/i, "")}`,
    "Use the installed Spec skill and the populated .spec context.",
    "Do not implement product code. Produce the normal Spec planning response and required Spec artifacts.",
    "Keep technical control names such as idempotency and server-side validation in English so they remain testable."
  ].join("\n");

  const result = run("codex", [
    "--ask-for-approval", "never",
    "exec",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox", "workspace-write",
    "--output-last-message", outputPath,
    "-C", workspace,
    prompt
  ], workspace, 300000);

  if (result.status !== 0 || !fs.existsSync(outputPath)) {
    throw new Error(result.stderr || result.stdout || "Codex did not produce an output file.");
  }

  const output = fs.readFileSync(outputPath, "utf8");
  const evaluation = evaluateOutput(output, expected);
  console.log(output.trim());
  console.log(`\nAgent eval ${evaluation.passed ? "passed" : "failed"}: ${fixtureName}`);
  evaluation.failures.forEach((failure) => console.log(`- ${failure}`));
  if (!evaluation.passed) process.exitCode = 1;
} finally {
  fs.rmSync(workspace, { recursive: true, force: true });
}

function writeContext(directory, input) {
  const context = [
    "# Context",
    "",
    `- Stage: ${input.context.stage}`,
    `- Probable stack: ${input.context.stack}`,
    `- Constraints: ${input.context.constraints.join("; ")}`,
    ""
  ].join("\n");
  fs.writeFileSync(path.join(directory, ".spec", "CONTEXT.md"), context, "utf8");
  fs.writeFileSync(path.join(directory, ".spec", "PRODUCT.md"), `# Product\n\n## Summary\n\n${input.request}\n`, "utf8");
}

function run(command, args, cwd, timeout = 30000) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", timeout });
  if (result.error) throw result.error;
  return result;
}
