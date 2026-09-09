---
name: spec
description: Decision pipeline and first-prompt hardener for AI coding agents. Use when the user asks to plan, specify, scope, refine, protect, audit, or turn a rough coding request into a safer implementation prompt, especially for greenfield apps, features, refactors, repairs, integrations, authentication, permissions, payments, uploads, admin dashboards, business rules, regression risk, project memory, or vibe-coding guardrails.
---

# Spec Skill

Spec does not generate code. Spec protects the decision before code exists.
Spec is a mandatory decision pipeline for coding agents.
Spec is not a documentation scaffold.
Spec is not anti-vibecoding.
Spec helps users and agents move faster with fewer avoidable mistakes.

Scale the depth to the request. Use the full pipeline for features, refactors, repairs, integrations and other changes with product or regression risk. For a small, local and reversible change, keep the same safety checks concise and do not create unnecessary task packs or long reports.

Spec is invoked inside coding agents, not as a shell command.
The terminal is only for installation, diagnostics and CI checks.

Before answering any `$spec`, `/spec` or plain Spec request, inspect `.spec/CONTEXT.md`, `.spec/PRODUCT.md` and `.spec/RULES.md` when they exist. Read the remaining context files only when the request touches their subject. Use [`modules/request-depth.md`](./modules/request-depth.md) to choose `lightweight`, `standard` or `guarded` before loading other modules.

When producing a full implementation prompt, do not finish without:
- reading `.spec/`
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
- context update suggestion

If the user needs to memorize the workflow, Spec failed.

If `.spec/` does not exist, tell the user to run `npx spec-skill install --all` from the project root and restart the agent.
If `.spec/` exists but project context is empty, run the agent-side `init` flow before producing implementation prompts.

Never generate a final implementation prompt without checking the Spec context first.
For standard and guarded requests, never skip relevant red flags, project impact, non-regression or memory updates. For lightweight requests, cover only the focused impact and non-regression checks needed by the change.

## Commands

All commands are invoked inside the active agent:

| Command | Purpose |
|---|---|
| `init` | Create initial `.spec/` project memory from a short conversation. Read [`commands/init.md`](./commands/init.md). |
| `document` | Inspect the current repository and update `.spec/` memory. Read [`commands/document.md`](./commands/document.md). |
| `refine` | Harden rules, risks, decisions and prompt requirements. Read [`commands/refine.md`](./commands/refine.md). |
| `check` | Review whether Spec context is strong enough before implementation. Read [`commands/check.md`](./commands/check.md). |
| `help` | Explain Spec and its commands briefly. Read [`commands/help.md`](./commands/help.md). |
| `<request>` | Run the full decision pipeline and produce a safer implementation prompt |

Accepted invocation styles:

- Codex: `$spec init`, `$spec build a finance SaaS`
- Claude/Cursor-style agents: `/spec init`, `/spec build a finance SaaS`
- If the agent receives `spec init` in plain text, treat it the same way.

## Agent Command Dialect

Use the command style of the active agent:

- Codex: recommend `$spec ...`
- Claude Code: recommend `/spec ...`
- Cursor: recommend `/spec ...`
- Generic agent: recommend `spec ...`
- Unknown agent: recommend the same command style the user used.

Never tell a Claude Code user to run `$spec`.
Never tell a Cursor user to run `$spec`.
Never tell a Codex user to run `/spec` unless they used slash commands first.

Do not tell the user to type `/spec` in the operating-system terminal.
Do not require `spec start` for normal use.

## Internal Architecture

Treat Spec as this internal engine:

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

## Mandatory Passes

For standard and guarded `/spec` requests, run the applicable passes below. Lightweight requests use only request depth, work classification, focused protection, acceptance criteria and tests.

0. Vibecoding Fit
Spec should optimize scope, stack, phases and prompt shape for coding agents and novice vibecoders.
It should prefer proven, incremental, testable implementation over unnecessary architecture complexity.

1. Foundation Pass
Spec should act like a product owner and senior engineer.
It should propose the safest agent-friendly stack, folder structure, boundaries, validations, client/server responsibilities and architecture baseline for the request.

2. Product Gap Pass
Spec should use `.spec/PRODUCT.md` and the rest of `.spec/` to find missing flows, weak business rules, undefined statuses, risky exceptions and product gaps.

3. Protection Pass
Spec should protect the project from dangerous requests, regressions, unjustified rewrites, unsafe integrations and weak rollback planning.

4. Prompt Pass
For standard and guarded work, only after the applicable passes above should Spec compile the final implementation prompt into `.spec/prompts/YYYY-MM-DD-short-request.md`.
Do not paste the full prompt body in chat when file editing is available.

5. Score Pass
Spec should estimate readiness across context, domain, rules, security, regression and tests.
The score should shape the verdict, not become a long report.

6. Foundation Score Pass
Spec should score whether the project foundation is strong enough for the requested work.
If the base is weak, Spec should narrow the scope or hold the prompt instead of pretending the request is safe.

7. MVP Slice Pass
Spec should reduce broad requests into the smallest useful Phase 1.
Future work belongs in `Do not implement yet`, not in the first coding-agent session.

8. Decision Ledger Pass
Spec should record important product and architecture choices in `.spec/DECISIONS.md`.
The goal is future-agent memory, not bureaucracy.

9. Agent Task Pack Pass
When a request is larger than one safe change, Spec should create ordered task files in `.spec/tasks/`.
The chat answer should point to the prompt and task directory instead of carrying the whole plan.

The user should not need to trigger these layers manually.
The selected pipeline is automatic. Do not force standard or guarded artifacts onto a lightweight request.

## Public Flow

- Install from terminal with `npx spec-skill install --all`
- Restart the coding agent
- Onboard inside the agent with that agent's command dialect.
- Use inside the agent with that agent's command dialect.

## Routing

Read [`router.md`](./router.md) first.
Then follow the relevant module instructions.

## Output Rule

Every `/spec` response must stay short, direct and implementation-oriented.
Use short bullets.
Do not write a long essay.
Do not add motivational filler.
Do not dump the full implementation prompt in chat.
Lightweight requests are chat-only. Do not create prompt, task, session or memory artifacts unless the request is escalated first.
For standard and guarded requests, create a prompt file in `.spec/prompts/` when it materially improves implementation and point the agent to it.

Use the output contract in [`output-contract.md`](./output-contract.md).
