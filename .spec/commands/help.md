# Help Command

Use when the user invokes `$spec help`, `/spec help` or `spec help` inside a coding agent.

Goal: explain what Spec is and how to use it, without running the full pipeline.
Keep it short. Do not generate an implementation prompt.

## What To Say

Explain, in the user's language:

- Spec is a decision pipeline that hardens the first prompt before code is written. It does not generate code.
- The terminal is only for install: `npx spec-skill install --all`. Everything else runs inside this agent.
- Available agent commands (use the active dialect — `$spec` in Codex, `/spec` in Claude Code/Cursor, `spec` in generic):
  - `init` — create initial `.spec/` project memory from a short conversation.
  - `document` — inspect the repository and update `.spec/` memory.
  - `refine` — harden rules, risks, decisions and prompt requirements.
  - `check` — review whether Spec context is strong enough before implementation.
  - `<request>` — run the full pipeline and produce a safer implementation prompt in `.spec/prompts/`.

## Rules

- Resolve the command dialect from `router.md` before showing examples.
- Do not tell the user to type `/spec` or `$spec` in the operating-system terminal.
- Do not list terminal commands other than `npx spec-skill install`.
- Keep the answer to a short list. No long essay.
