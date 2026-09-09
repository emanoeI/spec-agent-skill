# MVP Slicer

Use this pass to turn broad or ambitious requests into a small, safe implementation slice.
Spec should help vibecoding move fast by reducing simultaneous decisions.

## Required Output

```md
## MVP Slice

- Phase 1: ...
- Next: ...
- Later: ...
- Do not implement yet: ...
- Stop condition: ...
```

## Phase 1 Rules

Phase 1 must be the smallest useful vertical slice.
It should include just enough UI, validation, persistence and tests to prove the core flow.

Prefer Phase 1 work that:

- can be implemented in one focused coding-agent session
- touches few files
- has a clear happy path and one or two critical failure paths
- uses existing project conventions
- avoids new infrastructure unless the product cannot work without it
- produces visible user value

## Split These By Default

Split into later phases unless the user explicitly needs them now:

- dashboards with many charts
- full role management
- notification systems
- exports and reports
- webhooks
- background jobs
- billing and plans
- advanced audit screens
- multi-step admin tooling
- visual polish beyond core usability

## Rules

- Do not let a greenfield request become a full platform in the first prompt.
- Do not let a refactor become a rewrite unless the Protection Layer approves the risk.
- For sensitive integrations, Phase 1 must include the safe core flow before automation.
- For repairs, Phase 1 is only the smallest fix plus regression check.
- Put non-critical work under `Do not implement yet`.
