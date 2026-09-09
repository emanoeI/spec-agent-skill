# Spec with Antigravity

- Run `spec install --antigravity`
- Open the project in Antigravity
- Ensure `.agents/rules/spec.md` is enabled as a workspace rule with **Always On** activation
- Ask Antigravity to initialize Spec, or describe the planning request directly
- Make sure it reads `.spec/` and follows `.spec/SKILL.md`
- Make sure it performs domain research, work classification, impact review, tests, rollback and memory update before the final prompt

Antigravity workspace rules are Markdown files stored in `.agents/rules`. Spec's rule uses file references so the agent can load the runtime instructions from `.spec/`.
