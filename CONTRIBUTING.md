# Contributing to Spec

Spec is a Markdown-first planning skill for coding agents. Contributions should improve request routing, project protection, installation, evaluation coverage, or documentation.

## Scope

Good contributions include:

- Routing and output-contract fixes.
- CLI and adapter installation fixes.
- Eval cases for reproducible agent failures.
- Safer handling of authentication, permissions, validation, and data changes.
- Documentation that lets users install and verify Spec without guesswork.

Do not add:

- Hosted services, telemetry, tracking, or external runtime dependencies.
- Commands that duplicate existing install or check behavior.
- Large domain-specific libraries without a routing requirement.
- Marketing copy or internal notes in runtime files.

## Development

Requirements: Node.js 18 or newer.

```bash
npm install
npm run test:all
```

Run `npm run public:check` after changing public documentation, prompts, or skill files. Add or update tests when changing routing, installation, agent dialects, packaging, or output contracts.

## Writing rules

- Write short, operational instructions.
- Prefer concrete rules over slogans.
- Keep terminology consistent across the README, adapters, and runtime files.
- Use technical examples that can be executed or verified.
- Keep agent dialects correct: Codex uses `$spec`; Claude Code and Cursor use `/spec`.

## Code style

Write code as if it will be maintained by the next person on the project.

- Prefer small functions, direct control flow, and names that explain intent.
- Keep comments rare. Use them for a non-obvious reason, tradeoff, or constraint; do not narrate what the code already says.
- Do not add AI-generated disclaimers, model references, filler prose, or comments that claim authorship.
- Match the surrounding style before introducing a new abstraction or dependency.
- When changing behavior, add a focused test and keep the public output concise.

## Pull requests

Before opening a pull request:

- Keep the change scoped and easy to review.
- Include tests or evals for behavior changes.
- Do not commit generated tarballs, local artifacts, secrets, or private project data.
- Explain any change to installed files or agent behavior.
- Run `npm run test:all` and include the result.
