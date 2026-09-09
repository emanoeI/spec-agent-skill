# Request Depth

Choose the lightest workflow that still protects the requested change.

## Levels

### Lightweight

Use when the change is local, reversible, low-risk and already supported by clear project context. Typical examples are copy changes, a small style adjustment, a focused test or a narrow configuration correction.

- Read only the context and files touched by the request.
- Do not run domain research unless domain behavior could change.
- Do not calculate Foundation Score or Spec Score.
- Do not create decision, prompt, task, session or memory artifacts.
- If the change reveals a durable decision or spans multiple safe steps, escalate it to `standard` before writing artifacts.
- Return the lightweight output defined in `output-contract.md`.

### Standard

Use for ordinary features and greenfield slices that require product decisions, domain context or coordination across files.

- Run domain, product-gap, scope, protection and testing passes.
- Create a prompt file when it will materially improve implementation.
- Create a task pack only when the work has multiple dependent steps.

### Guarded

Use for authentication, permissions, payments, uploads, personal data, migrations, destructive operations, broad refactors, production repairs or any request with high regression cost.

- Run the full routed pipeline.
- Require explicit security, validation, rollback and non-regression controls.
- Use readiness scores to decide whether to proceed, narrow scope or hold.
- Create prompt, decision and task artifacts when the request proceeds.

## Escalation

When uncertain between two levels, choose the safer level. Escalate immediately when repository evidence reveals sensitive data, an external integration, a schema change, unclear ownership or a destructive action.
