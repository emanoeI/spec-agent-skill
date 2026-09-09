---
name: spec
description: Spec planning guardrails for Antigravity coding sessions.
activation: always_on
---

# Spec

Before implementing or proposing code changes, read `@.spec/SKILL.md` and inspect `@.spec/`.
Follow `@.spec/router.md` to choose the relevant modules, then format the response with `@.spec/output-contract.md`.

When the user asks to initialize Spec, follow `@.spec/commands/init.md` and ask one onboarding question at a time. For later planning requests, apply the Spec workflow directly. Use the user's language.

Every request must include work classification, domain research, project impact, security and regression review, MVP scope, tests, rollback, and a context update suggestion. Load only the relevant modules routed by `@.spec/router.md`.

Do not produce a final implementation prompt without reading the relevant `.spec/` files. Do not implement code while the request is still in the planning phase. Preserve existing behavior and call out uncertainty, assumptions, and missing evidence.

Spec is Markdown-only. It does not generate code, add a backend, call a hosted service, or collect telemetry.
