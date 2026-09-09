# Security policy

Spec runs locally, writes Markdown files in the target project, and does not provide a hosted service or telemetry.

## Report a vulnerability

Use a private GitHub security report when the repository host supports it. If private reporting is unavailable, open an issue without secrets, tokens, credentials, private source code, or production data. Include:

- the affected command or install path;
- the smallest reproducible project shape;
- expected and actual behavior; and
- the Node.js version and operating system.

## In scope

- Installation or packaging that writes outside the target project.
- Instructions that weaken authentication, authorization, secret handling, or tenant isolation.
- Prompt flows that expose credentials or private project data.
- Packaging that includes local artifacts or sensitive files.

## Out of scope

Issues in downstream applications are out of scope unless Spec explicitly produced the unsafe instruction or behavior.

