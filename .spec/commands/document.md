# Document Command

Use when the user invokes `$spec document`, `/spec document` or `spec document` inside a coding agent.

Goal: update Spec memory from the current repository.
Do not produce a final implementation prompt.

## Flow

1. Inspect the repository structure.
2. Identify stack, app boundaries, modules, routes, data models, auth, permissions, integrations and tests.
3. Update `.spec/CONTEXT.md`, `.spec/ARCHITECTURE.md`, `.spec/DATA-MODEL.md`, `.spec/PERMISSIONS.md` and `.spec/TESTING.md`.
4. Add a short session note in `.spec/sessions/`.
5. Keep assumptions explicit when the codebase is empty or unclear.

## Output

```md
Spec documentado.

Sinais encontrados:
- ...

Atualizei:
- ...

Lacunas:
- ...
```
