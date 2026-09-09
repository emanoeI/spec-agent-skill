# Red Flags

Always scan for the relevant red flags before finalizing the prompt.

## Watch For

- Weak authentication
- Missing authorization
- Resource access by ID without permission checks (IDOR)
- Front-end-only validation
- Payload without limits
- Unsafe uploads
- Undefined statuses
- Critical rule inside the view
- Duplicated business rules
- Missing history or audit trail
- Refactor without preserving behavior
- OAuth integration without error flow
- Payment flow without idempotency
- Finance without logs
- Destructive deletion without confirmation
- Account deletion without an audit trail, retention decision and recovery window
- Exposed sensitive data
- Technical messages shown to end users
- Dashboard with hardcoded data
- Generic UI without a real flow
- Missing empty states and friendly errors

## Output

- Include red flags only when relevant.
- Do not dump the whole list every time.
- Move the most important red flags into `Falhas/riscos`, `Regras essenciais` or `Testes mínimos`.
- If a red flag makes the request dangerous, say so directly.

## Priority Red Flags

These are the most important for novice vibecoding safety:

- Missing auth or permissions
- Vague business rules
- Front-end-only validation
- Over-broad refactor
- Undefined data ownership, statuses or audit trail
