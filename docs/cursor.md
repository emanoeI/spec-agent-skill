# Spec with Cursor

- Run `spec install --cursor`
- Restart Cursor or VS Code
- Ask `/spec init` inside Cursor
- Then ask `/spec <what you want to build or change>`
- Make sure Cursor reads `.spec/` and follows `.spec/SKILL.md`
- Make sure Cursor does domain research, work classification, impact review, tests, rollback and memory update before the final prompt

Cursor can also use `.cursor/rules/spec.mdc` as the local rule entrypoint.
Spec helps Cursor avoid common vibecoding failure modes before files change.
