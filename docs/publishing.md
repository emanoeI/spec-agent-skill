# Publishing checklist

Complete these checks from a clean working tree before publishing a release.

## Validate the repository

```bash
npm run test:all
node bin/spec.js install --all
node bin/spec.js check --ci
```

The full suite covers the CLI, adapters, routing evals, package contents, and tarball installation. The last two commands are a manual smoke check in a disposable project directory.

## Inspect the package

```bash
npm pack --dry-run
```

Confirm that the package contains `bin/`, `skill/`, `adapters/`, `docs/`, and the public Markdown files. It must not contain `evals/`, local project files, generated tarballs, secrets, or development caches.

## Release

1. Update `version` in `package.json` according to the change.
2. Review the package name, repository URL, homepage, and issue URL.
3. Commit the release changes.
4. Create the GitHub release from the commit.
5. Publish the package:

```bash
npm publish
```

The npm package is `spec-skill`; its installed binary is `spec`.

