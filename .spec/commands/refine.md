# Refine Command

Use when the user invokes `$spec refine`, `/spec refine` or `spec refine` inside a coding agent.

Goal: harden project rules before implementation prompts.
Do not produce a final implementation prompt.

## Flow

1. Read `.spec/PRODUCT.md`, `.spec/RULES.md`, `.spec/RISKS.md`, `.spec/DECISIONS.md`, `.spec/PROMPTS.md`, `.spec/RED-FLAGS.md` and `.spec/TESTING.md`.
2. Identify weak rules, risky assumptions, missing validations, missing rollback and dangerous prompt patterns.
3. Update `.spec/RULES.md`, `.spec/RISKS.md`, `.spec/DECISIONS.md`, `.spec/PROMPTS.md` and `.spec/RED-FLAGS.md`.
4. Add a short session note in `.spec/sessions/`.

## Output

```md
Spec refinado.

Endureci:
- ...

Ainda falta decidir:
- ...
```
