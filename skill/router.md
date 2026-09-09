# Router

Use this file to decide how to answer `$spec`, `/spec` or plain Spec requests inside a coding agent.

Spec is a single decision engine.
Do not treat the modules as optional helpers.
Treat them as one mandatory pipeline.
Spec supports vibecoding and coding agents by making their first decision safer.

## Command Routing

The shell is not the normal Spec interface.
After installation, users should run Spec commands inside Codex, Claude, Cursor or another coding agent.

Accepted invocation forms:

- `$spec init`
- `/spec init`
- `spec init`
- `$spec <request>`
- `/spec <request>`
- `spec <request>`

## Agent Command Dialect

Detect the active command dialect before suggesting next steps:

- If running in Codex or `.agents/skills/spec/`, use `$spec`.
- If running in Claude Code or `.claude/skills/spec/`, use `/spec`.
- If running in Cursor or `.cursor/rules/spec.mdc`, use `/spec`.
- If the user invoked with `$spec`, keep `$spec`.
- If the user invoked with `/spec`, keep `/spec`.
- If unknown, use `spec` without prefix.

Do not mix dialects in the final answer.
The output contract should say "next command" using only the detected dialect.

Route by the first word after `spec`:

- `init`: read [`commands/init.md`](./commands/init.md), ask one question at a time, include one smart recommended option when there is enough signal, update `.spec/`, then stop. Do not generate an implementation prompt during init.
- `document`: read [`commands/document.md`](./commands/document.md), inspect the repository, update `.spec/` memory, then stop.
- `refine`: read [`commands/refine.md`](./commands/refine.md), strengthen rules, risks, decisions and prompt requirements, then stop.
- `check`: read [`commands/check.md`](./commands/check.md), return a short readiness report, then stop.
- `help`: read [`commands/help.md`](./commands/help.md), explain Spec and its commands briefly, then stop.
- anything else: treat it as the user's product/build/change request and run the full Spec pipeline.

If the first word does not match a command but the intent is "set up Spec", route to `init`.
If the user typed `/spec` in the operating-system terminal and got an error, explain that `/spec` is an agent command, not a shell command.

Size the response before running the passes:

- Small and reversible: use the relevant modules briefly, state assumptions, define one or two checks and avoid a task pack unless the change spans files.
- Product, cross-cutting or risky: run the full routed pipeline and create the prompt, decision and task files required by the output contract.
- Unclear or broad: use the full product-gap and protection passes, then narrow the request before proposing implementation.

## Internal Layers

1. Input Layer
2. Context Loader
3. Decision Engine
4. Domain Research
5. Foundation Pass
6. Product Gap Pass
7. Protection Layer
8. Foundation Score
9. MVP Slicer
10. Spec Score
11. Decision Ledger
12. Prompt Compiler
13. Agent Task Pack
14. Memory Writer

## Routing Contract

Run every pass required by the selected request depth, and load modules deliberately.
Do not treat the modules folder as a pile of optional notes.
Do not read every module by habit when a smaller routed set is enough.

### Always Load

Every `/spec` request must load these modules:

- [`modules/request-depth.md`](./modules/request-depth.md)
- [`modules/work-classifier.md`](./modules/work-classifier.md)
- [`modules/acceptance-criteria.md`](./modules/acceptance-criteria.md)

### Load By Depth

Lightweight:

- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/testing.md`](./modules/testing.md)

Standard:

- [`modules/vibecoding-fit.md`](./modules/vibecoding-fit.md)
- [`modules/domain-research.md`](./modules/domain-research.md)
- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/mvp-slicer.md`](./modules/mvp-slicer.md)
- [`modules/prompt-compiler.md`](./modules/prompt-compiler.md)
- [`modules/memory-loop.md`](./modules/memory-loop.md)

Guarded:

- Load the Standard set.
- [`modules/foundation-score.md`](./modules/foundation-score.md)
- [`modules/spec-score.md`](./modules/spec-score.md)
- [`modules/decision-ledger.md`](./modules/decision-ledger.md)
- [`modules/agent-task-pack.md`](./modules/agent-task-pack.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/risks.md`](./modules/risks.md)
- [`modules/red-flags.md`](./modules/red-flags.md)

### Load By Work Type

Greenfield:

- [`modules/architecture.md`](./modules/architecture.md)
- [`modules/security.md`](./modules/security.md)
- [`modules/validation.md`](./modules/validation.md)
- [`modules/production-basics.md`](./modules/production-basics.md)
- [`modules/ux-ui.md`](./modules/ux-ui.md)
- [`modules/first-prompt-audit.md`](./modules/first-prompt-audit.md)
- [`modules/product-gap-review.md`](./modules/product-gap-review.md)
- [`modules/business-rules.md`](./modules/business-rules.md)
- [`modules/red-flags.md`](./modules/red-flags.md)

Feature:

- [`modules/security.md`](./modules/security.md)
- [`modules/validation.md`](./modules/validation.md)
- [`modules/production-basics.md`](./modules/production-basics.md)
- [`modules/ux-ui.md`](./modules/ux-ui.md)
- [`modules/product-gap-review.md`](./modules/product-gap-review.md)
- [`modules/business-rules.md`](./modules/business-rules.md)
- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/testing.md`](./modules/testing.md)

Refactor:

- [`modules/architecture.md`](./modules/architecture.md)
- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/risks.md`](./modules/risks.md)
- [`modules/testing.md`](./modules/testing.md)
- [`modules/red-flags.md`](./modules/red-flags.md)

Sensitive integration:

- [`modules/security.md`](./modules/security.md)
- [`modules/validation.md`](./modules/validation.md)
- [`modules/red-flags.md`](./modules/red-flags.md)
- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/testing.md`](./modules/testing.md)
- [`modules/risks.md`](./modules/risks.md)

Repair:

- [`modules/first-prompt-audit.md`](./modules/first-prompt-audit.md)
- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/testing.md`](./modules/testing.md)
- [`modules/risks.md`](./modules/risks.md)

### Escalation Signals

If any signal appears, load the matching module even if the work type did not require it:

- Auth, OAuth, permissions, roles, sessions or tenant data: load [`modules/security.md`](./modules/security.md), [`modules/validation.md`](./modules/validation.md) and [`modules/red-flags.md`](./modules/red-flags.md).
- Payment, upload, email, webhooks, financial data or personal data: load [`modules/security.md`](./modules/security.md), [`modules/production-basics.md`](./modules/production-basics.md), [`modules/project-protection.md`](./modules/project-protection.md), [`modules/regression-guard.md`](./modules/regression-guard.md) and [`modules/testing.md`](./modules/testing.md).
- Rewrite, migration, stack change, schema change or destructive refactor: load [`modules/architecture.md`](./modules/architecture.md), [`modules/project-protection.md`](./modules/project-protection.md), [`modules/regression-guard.md`](./modules/regression-guard.md), [`modules/risks.md`](./modules/risks.md) and [`modules/testing.md`](./modules/testing.md).
- Admin dashboard, marketplace, CRM, ecommerce, quotation, support tickets, scheduling or order management: load [`modules/product-gap-review.md`](./modules/product-gap-review.md), [`modules/business-rules.md`](./modules/business-rules.md), [`modules/ux-ui.md`](./modules/ux-ui.md) and [`modules/domain-research.md`](./modules/domain-research.md).
- Vague request, missing acceptance criteria or weak product context: load [`modules/first-prompt-audit.md`](./modules/first-prompt-audit.md), [`modules/product-gap-review.md`](./modules/product-gap-review.md) and [`modules/acceptance-criteria.md`](./modules/acceptance-criteria.md).

### Routing Output

Do not add a long "modules used" report to the user answer.
Let the routed modules shape the final output contract.

## Core Passes

### Foundation Pass

Use these modules together:

- [`modules/work-classifier.md`](./modules/work-classifier.md)
- [`modules/domain-research.md`](./modules/domain-research.md)
- [`modules/architecture.md`](./modules/architecture.md)
- [`modules/security.md`](./modules/security.md)
- [`modules/validation.md`](./modules/validation.md)
- [`modules/ux-ui.md`](./modules/ux-ui.md)

Goal:

- propose the best baseline
- optimize the baseline for vibecoding and coding agents
- define stack direction
- define folder structure or module boundaries
- define service communication when relevant
- define client-side and server-side responsibilities
- avoid overengineering
- reduce simultaneous implementation decisions

### Product Gap Pass

Use these modules together:

- [`modules/first-prompt-audit.md`](./modules/first-prompt-audit.md)
- [`modules/product-gap-review.md`](./modules/product-gap-review.md)
- [`modules/business-rules.md`](./modules/business-rules.md)
- [`modules/red-flags.md`](./modules/red-flags.md)

Goal:

- use `.spec/PRODUCT.md` as product truth
- find missing flows
- find weak business rules
- find undefined statuses and exceptions
- find risky assumptions and product gaps

### Score Pass

Use these modules:

- [`modules/foundation-score.md`](./modules/foundation-score.md)
- [`modules/spec-score.md`](./modules/spec-score.md)

Goal:

- estimate whether the product and technical foundation is strong enough
- estimate whether the request is ready for implementation
- expose weak areas without adding a long report
- shape the `Veredito`
- decide whether to proceed, narrow scope or hold the prompt

### Protection Pass

Use these modules together:

- [`modules/project-protection.md`](./modules/project-protection.md)
- [`modules/regression-guard.md`](./modules/regression-guard.md)
- [`modules/risks.md`](./modules/risks.md)
- [`modules/testing.md`](./modules/testing.md)

Goal:

- protect existing behavior
- measure impact
- slow down dangerous requests
- define rollback
- define non-regression checks

### Execution Planning Pass

Use these modules together:

- [`modules/mvp-slicer.md`](./modules/mvp-slicer.md)
- [`modules/decision-ledger.md`](./modules/decision-ledger.md)
- [`modules/agent-task-pack.md`](./modules/agent-task-pack.md)

Goal:

- reduce broad requests into a safe Phase 1
- record important product and architecture choices
- split implementation into small task files when useful
- make the next agent action obvious without a long chat answer

## Default Flow

1. Load the minimum relevant context from `.spec/`.
2. Understand the user request and stop for onboarding if `.spec/` is missing.
3. Choose request depth using [`modules/request-depth.md`](./modules/request-depth.md), then classify the work using [`modules/work-classifier.md`](./modules/work-classifier.md).
4. If the request is lightweight, run focused protection, acceptance and testing checks, return the lightweight output and stop without writing artifacts.
5. For standard and guarded requests, run domain research using [`modules/domain-research.md`](./modules/domain-research.md).
6. Build the routed module set from `Always Load`, `Load By Depth`, `Load By Work Type` and `Escalation Signals`.
7. Run Foundation, Product Gap and Protection passes using only the routed modules.
8. Use [`modules/acceptance-criteria.md`](./modules/acceptance-criteria.md) for objective delivery checks.
9. Assess foundation readiness using [`modules/foundation-score.md`](./modules/foundation-score.md) for guarded work.
10. Slice the work using [`modules/mvp-slicer.md`](./modules/mvp-slicer.md).
11. Assess prompt readiness using [`modules/spec-score.md`](./modules/spec-score.md) for guarded work.
12. Capture durable decisions using [`modules/decision-ledger.md`](./modules/decision-ledger.md) when needed.
13. Compile an implementation prompt in `.spec/prompts/` using [`modules/prompt-compiler.md`](./modules/prompt-compiler.md) when it materially improves execution.
14. Create task files using [`modules/agent-task-pack.md`](./modules/agent-task-pack.md) when the work needs more than one safe step.
15. Close the memory loop using [`modules/memory-loop.md`](./modules/memory-loop.md).
16. Format the short chat answer using [`output-contract.md`](./output-contract.md).

## Standard And Guarded Pipeline

Standard and guarded `/spec` requests pass through this pipeline using only routed modules:

1. Load context
2. Understand request
3. Work classification
4. Domain research
5. Routed module set
6. Foundation pass
7. Product gap pass
8. Protection and regression guard
9. Foundation Score
10. MVP Slice
11. Spec Score
12. Decision Ledger
13. Recommended foundation
14. Prompt file generated
15. Agent Task Pack
16. Tests
17. Rollback
18. Memory update

Lightweight requests stop after work classification, focused impact, acceptance criteria, tests and a concise next step. Do not create scores, research, decisions, prompt files, task packs, sessions or memory updates. Escalate the request before creating any artifact.

## When Context Is Missing

- If `.spec/` is missing, stop and ask the user to run `npx spec-skill install --all` from the project root, then restart the agent.
- If `.spec/` exists but has empty project/product context, route to `init` inside the agent.
- If `.spec/` exists but has weak detail, state assumptions briefly and ask only one missing high-impact question at a time.
- Do not write a long essay to compensate for weak context.
- If web access is unavailable, use the degraded research mode in [`modules/domain-research.md`](./modules/domain-research.md): label findings as model knowledge, mark assumptions, penalize the Foundation Score, and hold only for volatile/high-liability domains. Never fake live research.
- Do not jump to implementation before the full pipeline is complete.
- If the request is high-risk and poorly justified, hold the prompt and explain why.

## Priority Order

- Product truth over guesswork.
- Business rules over UI preference.
- Security and validation before convenience.
- Regression safety over aesthetic rewrites.
- Clear scope over feature sprawl.
- Reuse the current stack before proposing replacement.
- Help the active agent produce safer code instead of replacing the agent.
