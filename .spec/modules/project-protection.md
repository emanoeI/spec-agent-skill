# Project Protection

Never generate an implementation prompt without checking project impact first.
This is the Protection Layer.

## Internal Questions

- What already exists and must be preserved?
- Which behavior must not change?
- Which files, flows or rules may be affected?
- Which user type may be impacted?
- Is there risk to authentication, permissions, data, payments, uploads or statuses?
- Does the request really need a refactor or can it be incremental?
- Is the request too dangerous, too vague or too broad to approve as written?
- Is the request too large for one coding-agent session?
- Can this be split into a safe Phase 1?

## Output

Always include:

```md
## Impacto no projeto

- ...
```

## Rules

- Prefer incremental change over broad rewrite.
- Prefer one safe vertical slice over a large horizontal platform build.
- Be explicit about what must stay stable.
- If impact is unclear, say that before compiling the prompt.
- For features, refactors, sensitive integrations and repairs, identify the current flow that must keep working.
- Never treat an existing project like a greenfield request.
- If the request is risky and weakly justified, hold or narrow the prompt instead of obeying it blindly.
- If the scope spans many subsystems, create a phased prompt and make only Phase 1 implementable.
- For dangerous or broad requests, narrow to a safe Phase 1 before implementation.
- For high-risk refactors, require justification for stack changes, route changes, schema changes or auth changes.

## High-Risk Example

If the user asks for something like:

`/spec troca tudo para Next.js e refaz o sistema inteiro`

Do not obey it directly.

Respond as a high-risk refactor and require validation of:

- what breaks
- migration cost
- impacted routes
- existing data
- authentication
- deploy
- rollback
