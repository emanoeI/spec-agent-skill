# Check Command

Use when the user invokes `$spec check`, `/spec check` or `spec check` inside a coding agent.

Goal: tell whether Spec context is strong enough before implementation.
Do not produce a final implementation prompt unless the user also provided a concrete build/change request.

## Check

Review:

- project context
- product context
- domain research readiness
- business rules
- security and permissions
- validation
- regression risks
- rollback
- tests
- memory/session notes

## Output

```md
## Spec Check

- Contexto: forte | fraco
- Produto: forte | fraco
- Segurança: forte | fraco
- Regressão: forte | fraco
- Prompt final: liberado | segurar

## Próximo passo

- ...
```
