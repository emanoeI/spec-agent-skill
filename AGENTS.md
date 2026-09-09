<!-- SPEC:START -->
## Spec

Before any implementation prompt, read `.spec/SKILL.md` and inspect the `.spec/` directory.
Follow `.spec/router.md` to choose the routed module set, then format the answer with `.spec/output-contract.md`.
Use `$spec init` inside Codex to initialize project context. Do not ask the user to run `/spec` in the operating-system terminal.
Use the user's language during onboarding.

Spec is a Markdown-only first-prompt hardener for AI coding agents. It does not generate code by itself. It guides the active agent to research the domain, classify the work, protect existing behavior, detect risks, define tests, and produce safer implementation prompts.
Spec is not anti-vibecoding. It helps the active coding agent make safer decisions before implementation.

Required rule:

No final implementation prompt without:
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
<!-- SPEC:END -->
