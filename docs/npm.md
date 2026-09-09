# npm package

## Local development

```bash
npm install
node bin/spec.js help
node bin/spec.js install --all
node bin/spec.js check --ci
```

Run the commands from the project that should receive the `.spec/` files. After installation, restart the coding agent and run its matching init command:

- Codex: `$spec init`
- Claude Code and Cursor: `/spec init`
- Generic agents: `spec init`
- Antigravity: ask the agent to initialize Spec with `.agents/rules/spec.md` enabled

Re-running `spec install` preserves existing managed files. Use `spec install --refresh` when you intentionally want to replace installed runtime files with the package version.

## Package inspection

Create a local tarball and inspect its contents before publishing:

```bash
npm pack --dry-run
npm pack
```

The package is named `spec-skill` and exposes the `spec` binary. The `files` field in `package.json` defines the published paths.

## Skill bundle

The reusable skill bundle is the `skill/` directory. It contains `SKILL.md`, the router, commands, modules and templates. The CLI and adapters are the installation layer around that bundle. When distributing the skill to another compatible agent, use `skill/` as the source directory rather than the repository root.

## Test a tarball

Use a disposable directory outside the repository:

```bash
mkdir tmp-spec-test
cd tmp-spec-test
npx ../spec-skill-0.1.0.tgz install --all
npx spec check --ci
```

Do not run `/spec` or `$spec` in a shell. They are agent commands.

## Publish

```bash
npm publish
```

Update the version and review `docs/publishing.md` before publishing a new release.

