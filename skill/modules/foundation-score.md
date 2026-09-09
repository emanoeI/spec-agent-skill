# Foundation Score

Use this pass to measure whether the project foundation is strong enough for the requested work.
This is separate from Spec Score.
Spec Score evaluates the prompt readiness.
Foundation Score evaluates the product and technical base.

## Required Output

Keep it short:

```md
Foundation Score: 0-10
Verdict: proceed | narrow scope | hold
Weakest areas:
- ...
- ...
```

## Scoring Areas

Assess these areas before compiling the prompt:

- Product flow clarity: main user journey, success state and failure state are known.
- Business rules: ownership, limits, statuses, exceptions and approvals are explicit.
- Data model: core entities, relationships, sensitive fields and lifecycle rules are defined.
- Auth and permissions: roles, access boundaries and protected actions are clear.
- Validation: server-side validation, client-side feedback and payload limits are defined.
- Security: sensitive data, logs, abuse paths and integration risks are addressed.
- Architecture fit: stack, folders and boundaries match the size and risk of the problem.
- Regression safety: existing behavior, rollback and non-regression checks are named.
- Tests: minimum useful checks are clear enough for a coding agent to implement.

## Verdict Rules

- 8-10: proceed with a bounded implementation prompt.
- 6-7: proceed only with a smaller Phase 1 and explicit assumptions.
- 4-5: narrow scope and ask one high-impact question before implementation.
- 0-3: hold the implementation prompt until the foundation gap is resolved.

## Rules

- Do not hide a weak foundation behind confident wording.
- Do not improve the score by inventing business rules without marking them as assumptions.
- For sensitive integrations, payment, auth, upload, financial data or permissions, cap the score at 6 if server-side validation and rollback are not defined.
- For refactors, cap the score at 6 if existing behavior and rollback are not defined.
- For small internal tools, do not penalize the score for avoiding a complex stack.
- Use this score to shape scope and stop conditions.
