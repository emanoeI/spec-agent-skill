# Vibecoding Fit

Optimize every Spec decision for coding agents and novice vibecoders.

Spec is not designing for a large human team first.
Spec is designing for an AI coding agent that will implement the plan with limited context, imperfect judgment and high speed.

## Goal

Make the implementation easier for agents to complete safely.
Prefer proven, explicit, incremental choices over clever architecture.

## Rules

- Keep stack complexity proportional to product complexity.
- Prefer one cohesive app over multiple services unless separation is clearly required.
- Prefer a familiar stack already present in the repo.
- For greenfield, recommend proven mainstream stacks the agent can implement reliably.
- Avoid recommending queues, workers, event buses, microservices, webhooks, realtime, background jobs or complex infra unless the domain truly needs them.
- Split large work into phases that can be implemented and tested independently.
- Keep Phase 1 thin: auth, core entity, critical flow, server-side validation, minimum tests.
- Do not ask the agent to build admin, analytics, notifications, PDF, email, audit, permissions and payments all in one prompt unless the user explicitly wants a large build.
- Prefer explicit file paths, simple data models and clear route names.
- Prefer server-side validation and authorization over client-side cleverness.
- Reduce simultaneous decisions in the prompt.
- Avoid "enterprise architecture" language unless the project is already enterprise-scale.
- If the safest architecture is complex, explain the smallest safe subset first.

## Proportionality Check

Before recommending a stack or architecture, ask:

- How many users will use this?
- Is it internal or public?
- Does it need real-time scale, complex permissions, payments, uploads or integrations?
- Is there existing hosting or team familiarity?
- Can a simple server-rendered app solve it safely?

If the project is small, internal, low-traffic or single-user:

- Prefer a simple stack over Node/React/API split by default.
- Consider PHP, Laravel, Rails, Django, simple server-rendered app, SQLite or a single PostgreSQL database when appropriate.
- Do not recommend a separate frontend/backend unless it clearly reduces risk.
- Do not recommend TypeScript, Prisma, queues, background jobs or SPA architecture just because they are common in AI-generated apps.
- Explain why the simpler stack is enough.

If recommending a heavier stack anyway, justify it with a real requirement:

- multi-user permission model
- auditability
- payment or financial correctness
- external integrations
- expected growth
- existing repo stack
- team familiarity

Avoid disproportionate architecture for small problems.

## Stack Guidance

When stack is unknown:

- Recommend a stack only after considering the user's goal, repo signals and agent reliability.
- Compare the simplest viable stack against the heavier default before deciding.
- Prefer stacks with strong conventions and fewer integration choices.
- Avoid mixing too many libraries in the first prompt.
- If the user is a novice, choose fewer moving parts.

Good default shape for many web MVPs:

- single app or simple frontend/backend split
- one database
- one auth approach
- one validation library or validation layer
- one test path
- one deployment target later, not during first implementation unless required

## Prompt Impact

The generated prompt must include:

- `Vibecoding constraints`
- `Phase 1 scope`
- `Do not implement yet`
- `safe Phase 1`
- `Files likely to touch`
- `Stop conditions`

## Stop Conditions

Tell the implementation agent to stop and ask before continuing if:

- the requested scope requires more than one major subsystem
- the stack is not present and must be chosen
- auth, payments, upload, email or permissions become larger than the current phase
- schema changes affect existing data
- generated code would need secrets, external credentials or production services
