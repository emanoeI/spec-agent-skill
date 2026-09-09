# Spec with Claude Code

- Run `spec install --claude`
- Restart Claude Code or VS Code
- Ask `/spec init` inside Claude Code
- Then ask `/spec <what you want to build or change>`
- Make sure Claude Code reads `.spec/` and follows `.spec/SKILL.md`
- Make sure Claude Code does domain research, work classification, impact review, tests, rollback and memory update before the final prompt

Spec is Markdown-only. There is no hidden integration layer.
Spec helps Claude Code make safer implementation decisions.
