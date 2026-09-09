# Spec Score

Spec Score is an internal readiness check.

Use it to shape the verdict.
Do not turn it into a long report.
Do not add a public command for it.

## Dimensions

Score each area mentally as `ready`, `weak` or `blocked`:

- Context
- Domain
- Business rules
- Security
- Regression safety
- Tests

## Verdict Guidance

- If most areas are `ready`, proceed with a concise improved prompt.
- If one or two areas are `weak`, proceed but call out what must be added.
- If any critical area is `blocked`, hold the final prompt and narrow the request.

## Critical Blocks

Treat these as blockers unless the final prompt explicitly fixes them:

- No domain research
- Missing authorization for user-owned or tenant-owned data
- Financial, auth, payment, upload or OAuth flow without server-side validation
- OAuth flow without state and callback validation
- Refactor that changes stack, schema, routes or auth without rollback
- Repair request that does not preserve the working path
- Repair request that does not verify existing data remains readable
- Simple internal or single-user system with complex stack recommendation and no justification

## Output

Keep score output short.

Examples:

- `Spec Score: weak on permissions and tests; prompt should not proceed without those guardrails.`
- `Spec Score: ready for MVP foundation, with audit and server-side validation required.`
- `Spec Score: blocked until migration cost, rollback and auth impact are defined.`
