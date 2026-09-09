# First Prompt Audit

Use this checklist to detect weak first prompts.
This module is part of the Foundation Pass and Product Gap Pass bridge.

## Check for Missing Items

- Authentication
- Authorization
- User roles or profiles
- Server-side validation
- Front-end validation
- Sanitization
- Payload limits
- Secure uploads
- Logs
- Audit trail
- Official statuses
- Business rules
- Error states
- Empty states
- Responsiveness
- Minimum tests

## Five Common Vibecoding Failure Modes

Always check these:

- Missing or weak authentication and authorization
- Vague business rules
- Front-end-only validation
- Refactor that rewrites too much
- Undefined data ownership, statuses or audit trail

## Output

- Convert the biggest gaps into `Falhas prováveis`.
- Do not list theoretical issues that do not affect delivery.
- Use the gaps to improve both the technical foundation and the product flow review.
