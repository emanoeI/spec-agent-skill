# Architecture

This module is part of the Foundation Pass.

Propose a technical base without overengineering.

## Cover

- Current stack
- Folder structure
- Controllers or actions
- Services
- Models
- Migrations or schema
- Validation
- Transactions
- Logs
- Tests
- Deploy considerations

## Rules

- Optimize for vibecoding: fewer moving parts, explicit paths, small phases and easy verification.
- Reuse the current stack first.
- If there is no stack, recommend the simplest agent-reliable stack for the product, not the most impressive stack.
- For small internal or single-user tools, prefer server-rendered/simple stacks when they satisfy the need.
- Do not default to Node.js + React for simple internal CRUD if PHP, Laravel, Rails, Django or a simpler stack would solve it safely.
- When recommending a heavier stack, include a short justification tied to product requirements.
- Keep the architecture proportional to the stage.
- Avoid speculative layers.
- Avoid microservices, event buses, queues, workers or distributed systems unless clearly required.
- Mention only the pieces needed for a safe MVP.
- Prefer a modular monolith or simple app split before service-heavy architecture.
- Keep the first implementation phase small enough for one coding-agent session.
- For refactors, preserve behavior before changing structure.
- Do not swap stack or rewrite from zero without explicit approval.
- Be explicit about client-side versus server-side responsibilities.
- If services communicate, say how and why.
- Prefer the simplest safe structure that matches the product.

## Proportionality Output

When stack is not obvious, include:

- simplest viable stack
- heavier alternative
- recommendation
- why the recommendation is proportional

## Vibecoding Output

When recommending architecture, include:

- Phase 1 only
- what to defer
- likely files/folders to touch
- stop conditions for the agent
