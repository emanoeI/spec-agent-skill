# Work Classifier

Classify every `/spec` request before producing the answer or final prompt.
This is the Decision Engine entrypoint.

## Allowed Types

1. `Greenfield`
Project new. No existing base to preserve.

2. `Feature`
New capability or intentional user-visible change inside an existing product. Local copy, layout and interaction changes belong here even when they are lightweight.

3. `Refactor`
Internal structural change that preserves observable behavior. Moving code, simplifying boundaries or replacing an implementation without changing the user experience belongs here.

4. `Sensitive integration`
OAuth, payments, uploads, email, permissions, authentication, finance or sensitive data.

5. `Repair`
Bug fix, broken deploy, failing flow or regression.

## Behavior By Type

### Greenfield

Focus on:

- Safe baseline
- MVP scope
- Domain rules
- Initial architecture
- Essential validations
- Initial UX
- Implementation prompt

Prompt behavior:

- Propose the safest thin foundation.
- Define the MVP boundary.
- Do not bloat the architecture.
- Prefer a Phase 1 that an agent can finish safely in one session.
- Put non-critical subsystems into "Do not implement yet".

### Feature

Focus on:

- Preserve current architecture
- Fit the existing product
- Identify impact
- Avoid duplicated flows
- Respect existing rules
- Minimum tests

Prompt behavior:

- Fit into the existing product before inventing new structure.
- Reuse current flows, statuses and permissions when possible.
- Reject duplicate subsystems when the current one can be extended.
- Touch the fewest files that can safely deliver the feature.

### Refactor

Mandatory focus:

- Preserve existing behavior
- Map regression risks
- Avoid rewrite without reason
- Propose rollback
- Define before-and-after tests
- Keep compatibility

Prompt behavior:

- Be conservative.
- Do not recreate the project from zero.
- Do not swap stack because of aesthetics alone.
- If the request is too broad or risky, slow it down before compiling the prompt.
- Split refactors into inspection, safe change and verification phases.

### Sensitive integration

Mandatory focus:

- Security
- Authorization
- Server-side validation
- Logs
- Error flow
- Rate limit when relevant
- Sensitive data handling
- Permissions
- Rollback

Prompt behavior:

- Be conservative and explicit.
- Prefer stricter validation, permission checks and error handling.
- Do not treat happy-path success as enough.
- For OAuth, require state, callback validation, account-link uniqueness and error flow.
- Separate external-provider setup from local implementation when credentials or webhooks are needed.

### Repair

Mandatory focus:

- Understand expected behavior
- Find likely breakage
- Preserve working parts
- Fix with the smallest safe change
- Add test or regression checklist

Prompt behavior:

- Change the minimum necessary.
- Prefer correction over cleanup.
- Protect the adjacent stable flow before improving style or structure.
- Verify existing data remains readable after the fix.
- Do not combine bug repair with cleanup unless the cleanup is required for the fix.

## Output

- Always state one work type.
- If more than one applies, choose the dominant type and mention the secondary risk inside `Falhas/riscos`.
- Do not label a change as `Refactor` merely because it edits existing code. Use `Refactor` only when internal structure is the purpose and observable behavior stays the same.
- The work type must change the final prompt, tests and rollback guidance.
- If the work type is `Refactor`, `Sensitive integration` or `Repair`, the answer must become more conservative.
