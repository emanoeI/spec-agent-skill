# Spec Context

.spec/ is the operational memory of this project.

Every coding agent using Spec should read:
- .spec/SKILL.md
- the relevant files inside .spec/
- generated prompts inside .spec/prompts/
- generated task packs inside .spec/tasks/

Spec is Markdown-only.
It does not generate code by itself.

Use Spec inside your coding agent:
- Codex: $spec init, then $spec <request>
- Claude/Cursor-style agents: /spec init, then /spec <request>

Do not type /spec in cmd, PowerShell or bash.

When Spec creates a prompt file, ask the agent to read that file instead of copying a giant prompt from chat.
When Spec creates a task pack, execute the task files in order.
