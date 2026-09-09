# Spec Agent Review Brief

Use this document to review the Spec project from another coding agent.
The goal of the review is to check whether Spec is concrete, installable, agent-friendly and safe enough to help novice vibecoders avoid weak project foundations.

## Product Summary

Spec is a Markdown-only skill distributed through npm.
It installs local project memory and agent instructions so coding agents can turn rough requests into safer implementation prompts.

Spec does not generate code by itself.
It sits before implementation and acts as a product-owner plus senior-engineering decision pipeline.

Primary package:

```txt
spec-skill
```

Binary:

```txt
spec
```

Install command:

```bash
npx spec-skill install --all
```

After installation, users should restart their coding agent and use Spec inside the agent:

```txt
Codex: $spec init
Claude Code/Cursor: /spec init
Generic: spec init
```

The terminal is only for installation, diagnostics and CI checks.
Normal onboarding and Spec usage should happen inside the active coding agent.

## Core Promise

Spec should make vibecoding safer without becoming heavy.
It should help agents:

- read project memory before suggesting implementation
- research the domain before producing a final prompt
- classify work type
- detect weak foundations
- keep scope proportional to the problem
- protect existing behavior
- split broad requests into a safe Phase 1
- generate prompt files instead of long chat responses
- record decisions and memory updates

Mandatory rule:

```txt
No domain research, no final prompt.
```

## Installed Project Shape

Spec creates or updates these files and directories:

```txt
.spec/
.spec/SKILL.md
.spec/router.md
.spec/output-contract.md
.spec/onboarding.md
.spec/commands/
.spec/modules/
.spec/prompts/
.spec/tasks/
.spec/sessions/
AGENTS.md
CLAUDE.md
.agents/skills/spec/
.claude/skills/spec/
.cursor/rules/spec.mdc
```

The exact adapter output depends on the install flag:

```bash
spec install --codex
spec install --claude
spec install --cursor
spec install --generic
spec install --all
```

## Internal Pipeline

Every relevant Spec request should pass through this decision pipeline:

1. Input Layer
2. Context Loader
3. Decision Engine
4. Vibecoding Fit
5. Domain Research
6. Foundation Pass
7. Product Gap Pass
8. Protection Layer
9. Foundation Score
10. MVP Slicer
11. Spec Score
12. Decision Ledger
13. Prompt Compiler
14. Agent Task Pack
15. Memory Writer

The routing source of truth is:

```txt
skill/router.md
```

The public skill entrypoint is:

```txt
skill/SKILL.md
```

The response format is:

```txt
skill/output-contract.md
```

## Command Model

Spec intentionally keeps the public command surface small.

Inside agents:

```txt
init
document
refine
check
<request>
```

Examples:

```txt
$spec init
$spec document
$spec refine
$spec check
$spec build a finance SaaS
```

```txt
/spec init
/spec document
/spec refine
/spec check
/spec add Discord OAuth
```

Important behavior:

- Codex should use `$spec`.
- Claude Code and Cursor should use `/spec`.
- Generic agents can use `spec`.
- Spec should not tell users to type `/spec` in PowerShell, cmd or bash.
- The terminal exposes only `install`, `check --ci` and `help`. Onboarding (`init`), `document` and `refine` are agent-only commands.

## Important Modules

Core routing and safety modules:

```txt
skill/modules/work-classifier.md
skill/modules/vibecoding-fit.md
skill/modules/domain-research.md
skill/modules/foundation-score.md
skill/modules/mvp-slicer.md
skill/modules/spec-score.md
skill/modules/decision-ledger.md
skill/modules/prompt-compiler.md
skill/modules/agent-task-pack.md
skill/modules/memory-loop.md
```

Protection modules:

```txt
skill/modules/project-protection.md
skill/modules/regression-guard.md
skill/modules/risks.md
skill/modules/testing.md
skill/modules/red-flags.md
skill/modules/security.md
skill/modules/validation.md
```

Product and foundation modules:

```txt
skill/modules/architecture.md
skill/modules/product-gap-review.md
skill/modules/business-rules.md
skill/modules/acceptance-criteria.md
skill/modules/ux-ui.md
skill/modules/first-prompt-audit.md
```

## Expected Agent Behavior

When a user asks for a product or code change through Spec, the agent should:

1. Read `.spec/` first.
2. Run quick domain research through web access.
3. Classify the work as Greenfield, Feature, Refactor, Sensitive integration or Repair.
4. Detect foundation gaps and risky assumptions.
5. Keep the stack and architecture proportional to project size.
6. Produce a short chat answer using the output contract.
7. Create a prompt file in `.spec/prompts/`.
8. Create task files in `.spec/tasks/` when work is larger than one safe step.
9. Suggest updates to `.spec/sessions/`, `.spec/DECISIONS.md`, `.spec/RISKS.md` and `.spec/TESTING.md`.

The agent should not paste the full implementation prompt in chat when it can write files.

## Review Targets

When reviewing this repository, check these areas first:

- Installation flow: `npx spec-skill install --all` should create useful files without terminal onboarding.
- Agent dialects: Codex, Claude Code and Cursor should receive the correct command style.
- Routing: new modules must be referenced by `skill/router.md`.
- Output contract: responses should stay short and point to generated files.
- Safety: dangerous rewrites, auth, payments, uploads and permissions should trigger protection behavior.
- Proportionality: small internal tools should not receive unnecessarily complex architecture.
- Memory: important choices should be written to `.spec/DECISIONS.md` and sessions.
- Packaging: npm package should include runtime/docs/adapters, but not dev-only scripts or eval cases.

## Local Validation Commands

Use cmd on Windows if PowerShell blocks npm scripts:

```bash
cmd.exe /c npm run test:all
cmd.exe /c npm pack --dry-run
```

Individual checks:

```bash
npm run public:check
npm run eval
npm run smoke
npm run pack:check
npm run distribution:test
```

Expected result:

- public hygiene passes
- eval cases pass
- smoke tests pass
- pack check passes
- distribution test passes
- dry-run package includes runtime files, adapters, docs and templates

## Known Design Constraints

- Keep Spec Markdown-only.
- Do not add a backend, service, telemetry or hosted dependency.
- Keep CLI usage limited to install/check/help. Everything else runs inside the agent.
- Keep onboarding inside agents.
- Avoid a large command maze.
- Prefer fewer, stronger commands over many specialized commands.
- Preserve vibecoding speed while adding decision safety.

## Questions A Reviewer Should Answer

- Does Spec feel like a decision engine instead of a documentation folder?
- Would a novice vibecoder understand how to use it after install?
- Would a coding agent know exactly what to read and write?
- Does the Protection Layer block or slow down dangerous requests clearly?
- Does the MVP Slicer prevent broad greenfield prompts from becoming too large?
- Does the Foundation Score expose weak bases without creating a long report?
- Does the Agent Task Pack make implementation easier for agents?
- Are there stale docs, command mismatches or English/Portuguese inconsistencies that would confuse users?
