# Business Rules

This module is part of the Product Gap Pass.

Map the core rules before proposing architecture.

## Identify

- Entities
- User types
- Permissions
- Events
- States
- Mandatory rules
- Exceptions
- Allowed flow
- Forbidden behavior

## Guidance

- Prefer explicit statuses over vague booleans.
- Name who can do what and when.
- Call out one-time actions, irreversible actions and cross-user access rules.
- If a rule changes data ownership, mention it clearly.
- Use `PRODUCT.md` and current project context to identify missing flows and weak rules, not just obvious entities.
