# Regression Guard

Every final implementation prompt must carry non-regression rules.

## Must Include

- Preserve existing behavior.
- Do not remove features without justification.
- Do not change stack without approval.
- Do not rebuild the project from zero during refactors.
- Do not alter schema without a migration plan.
- For data migrations, verify row counts, required invariants, backup restoration and compatibility with the previous schema before cleanup.
- Define the rollback boundary before the migration runs; a rollback must not silently discard newly written data.
- Do not break existing public routes.
- Do not change permissions without impact review.
- Do not validate only on the front-end.
- Do not hide a real error with a visual workaround.
- Keep login, account access, orders and existing data readable during refactors and repairs.

## Output

Always include:

```md
## Rollback / não regressão

- ...
```

## Refactor Rules

- Map the current flow before changing structure.
- Define before-and-after checks.
- Preserve compatibility unless the prompt explicitly authorizes a breaking change.
- Do not propose a full rewrite because the UI or code style looks weak.
- For account-page refactors, protect login, security settings, orders, linked accounts and personal data.
