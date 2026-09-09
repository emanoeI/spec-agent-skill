# Agent Task Pack

Use this pass to split the implementation prompt into small task files when the work is bigger than a single safe change.
This makes Spec easier for coding agents to execute without losing constraints.

## Required Directory

Create task files in:

```txt
.spec/tasks/YYYY-MM-DD-short-request/
```

For small requests, one task file is enough.
For larger requests, create ordered files.

## Suggested Files

```txt
.spec/tasks/YYYY-MM-DD-short-request/01-foundation.md
.spec/tasks/YYYY-MM-DD-short-request/02-data-and-validation.md
.spec/tasks/YYYY-MM-DD-short-request/03-api-or-actions.md
.spec/tasks/YYYY-MM-DD-short-request/04-ui-flow.md
.spec/tasks/YYYY-MM-DD-short-request/05-tests-and-regression.md
```

## Task File Format

```md
# Task: <name>

## Objective
...

## Files Likely To Touch
- ...

## Constraints
- ...

## Done Criteria
- ...

## Stop Conditions
- ...
```

## Splitting Rules

- Keep each task independently understandable.
- Order tasks by dependency, not by visual appeal.
- Put schema, permission and validation work before UI polish.
- Put tests and regression checks in a final explicit task unless the work is a small repair.
- For sensitive integrations, isolate the external boundary before adding UX polish.
- For refactors, add a behavior-preservation task before structural changes.
- For repairs, keep the task pack minimal and focused on the failing behavior.

## Chat Rule

Do not paste all task contents in chat.
Mention only the task directory and the first task the agent should read.
