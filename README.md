# Spec

Spec is a Markdown-first planning skill for coding agents. It creates project context, routes each request through the relevant checks, and writes implementation prompts with scope, risks, tests, and rollback notes.

Spec does not generate application code, call a hosted service, or collect telemetry.

## Requirements

- Node.js 18 or newer
- A coding agent that can read Markdown instructions

## Install

Run this in the project where you want to use Spec:

```bash
npx spec-skill install --all
```

Install one adapter when you only use one agent:

```bash
spec install --codex
spec install --claude
spec install --cursor
spec install --antigravity
spec install --generic
```

Restart the agent after installation.

## Use

Initialize the project context inside the agent:

| Agent | Init command | Request command |
| --- | --- | --- |
| Codex | `$spec init` | `$spec <request>` |
| Claude Code | `/spec init` | `/spec <request>` |
| Cursor | `/spec init` | `/spec <request>` |
| Generic agent | `spec init` | `spec <request>` |

The terminal `spec` command is used for installation and CI checks. The init and request commands are interpreted by the agent.

## Installed files

Every install creates `.spec/` with:

- `SKILL.md`, routing rules, commands, and runtime modules
- Markdown templates for context, product, architecture, risks, permissions, and tests
- `sessions/`, `prompts/`, and `tasks/` for project memory and generated work

The adapter adds the agent-specific instruction file:

| Adapter | Additional files |
| --- | --- |
| Generic | `AGENTS.md` |
| Codex | `.agents/skills/spec/`, `AGENTS.md` |
| Claude Code | `.claude/skills/spec/`, `CLAUDE.md` |
| Cursor | `.cursor/rules/spec.mdc`, `AGENTS.md` |
| Antigravity | `.agents/rules/spec.md` |

Existing context files are preserved. Spec replaces only its marked block in `AGENTS.md` or `CLAUDE.md`.

## Request pipeline

For each request, Spec selects the relevant modules and produces a structured response covering:

1. Work classification and domain research
2. Foundation and product-gap review
3. Project impact, security, validation, and regression risks
4. MVP scope, tests, rollback, and implementation tasks
5. A prompt file under `.spec/prompts/` and a memory update

Use `spec check --ci` to verify that a project has the required Spec files before an agent request.

## Development

Clone the repository and run:

```bash
npm install
npm run test:all
```

The test suite covers public-file hygiene, routing evals, CLI installation, generated skill mirrors, package contents, and installation from an npm tarball.

Useful individual checks:

```bash
npm test
npm run public:check
npm run eval
npm run pack:check
npm run distribution:test
```

## Documentation

- [npm installation and publishing](./docs/npm.md)
- [Publishing checklist](./docs/publishing.md)
- [Codex adapter](./docs/codex.md)
- [Claude Code adapter](./docs/claude-code.md)
- [Cursor adapter](./docs/cursor.md)
- [Antigravity adapter](./docs/antigravity.md)
- [Generic agent adapter](./docs/generic-agent.md)
- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)

## License

MIT. See [LICENSE](./LICENSE).
