# Red Flags

## Watch List
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
- Exposed sensitive data
- Technical messages shown to end users
- Dashboard with hardcoded data
- Generic UI without a real flow
- Missing empty states and friendly errors
