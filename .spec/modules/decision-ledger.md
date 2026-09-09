# Decision Ledger

Use this pass to keep important product and architecture decisions visible over time.
Spec should leave a project memory trail that future agents can trust.

## Required File

Record important decisions in:

```txt
.spec/DECISIONS.md
```

## Decision Format

```md
## Decision: <title>

Date: YYYY-MM-DD
Status: proposed | accepted | revisited

### Context
<What forced this decision?>

### Decision
<What was chosen?>

### Why
<Why this is the safest useful choice now?>

### Tradeoffs
<What this makes easier and what it postpones?>

### Revisit If
<Signals that should trigger a new decision>
```

## Decisions To Capture

Capture a ledger entry when Spec chooses or changes:

- stack or framework direction
- folder/module boundaries
- auth, roles or permission model
- data ownership or tenant boundaries
- official statuses and lifecycle transitions
- external integration approach
- validation strategy
- rollback strategy
- major scope deferral
- refactor constraint

## Rules

- Prefer one or two high-value entries over a long decision archive.
- Use `proposed` when the user has not approved the decision yet.
- Use `accepted` when it reflects confirmed project truth.
- Use `revisited` when replacing or correcting a previous decision.
- Do not record trivial implementation details.
- Mention Decision Ledger updates in the final memory section.
