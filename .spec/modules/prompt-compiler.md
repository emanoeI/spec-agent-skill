# Prompt Compiler

Turn the analysis into a prompt file for another coding agent.
Do not paste the full implementation prompt in the chat response.

## Required File

Create a Markdown file in:

```txt
.spec/prompts/YYYY-MM-DD-short-request.md
```

Use a stable slug based on the request.
If a file with the same name exists, append `-2`, `-3`, etc.

## Required File Sections

- Context
- Work type
- Domain references
- Foundation Score
- Objective
- Vibecoding constraints
- Phase 1 scope
- Scope
- Do not implement yet
- Mandatory rules
- Expected architecture
- Validations
- Security
- UX/UI
- What not to do
- Deliverables
- Minimum tests
- Rollback and non-regression
- Stop conditions
- Agent Task Pack
- Decision Ledger updates
- Memory updates

## Self-Check Before Writing The File

The loaded modules only add value if their output reaches the prompt file.
Before writing the file, verify it actually contains what the routed modules required.
If any item is missing and it is relevant to the request, add it. Do not write the
file until it passes:

- Every red flag surfaced this run appears as a rule, risk or test — not just mentioned in chat.
- Every concrete security rule from `security.md` that matched a signal is present.
- Server-side validation is specified for each data-entry point.
- Acceptance criteria are specific to this request, not generic categories.
- Production basics that apply (pagination, idempotency, timeouts, limits) are named.
- Rollback and at least one non-regression check exist for any change to existing behavior.
- Assumptions (including "no live domain research") are stated explicitly.
- Phase 1 scope is bounded and future work sits under `Do not implement yet`.

If the Foundation Score verdict was `hold`, do not write an implementation prompt;
write the open questions to resolve instead.

## Chat Response Rule

In the chat, include only:

- short verdict
- work type
- Foundation Score summary
- key risks
- prompt file path
- task directory path when task files were created
- one instruction telling the agent to read the prompt file
- next command using the active agent dialect from `router.md`
- minimum tests summary
- memory update summary

## Rules

- Write the prompt file for implementation, not discussion.
- Optimize the prompt for one coding-agent session when possible.
- Split large work into phases and make Phase 1 the only required implementation scope.
- Put future work under `Do not implement yet`.
- Reference `.spec/tasks/YYYY-MM-DD-short-request/` when the request needs ordered agent execution.
- Keep task files smaller than the prompt file and focused on concrete implementation steps.
- Keep the chat response short.
- Avoid filler and repeated analysis.
- If assumptions exist, state them in one short block inside the prompt file.
- If the agent cannot edit files, provide the prompt file content as a collapsible/clearly separated block and say file creation is required before implementation.
