# Domain Research

Always research the domain before generating the final prompt.

## Core Rule

`No domain research, no final prompt.`

Spec prefers the user's coding agent to have web access, but must still be useful without it.

## When Web Access Is Available

- Research the domain live (see `What To Research`).
- Prefer live findings over model memory.

## When Web Access Is Not Available

Do not silently pretend research happened, and do not hard-stop for ordinary domains.
Use a degraded, honest mode instead:

- State clearly, in one line, that findings come from model knowledge of common patterns, not live research.
- Still produce the domain findings and the improved prompt.
- Mark any domain fact the agent is unsure about as an assumption to confirm.
- Penalize the Foundation Score by 1-2 points and name "no live domain research" as a weak area.
- Ask the user to confirm one or two high-impact domain facts before implementation.

Hard-stop only for volatile or high-liability domains where guessing is unsafe:

- Payments, billing, tax, and financial compliance
- Auth/identity protocols and token/session security
- Legal, medical, or regulatory rules
- Anything where an outdated assumption causes data loss or a security hole

For those, if there is no web access, hold the final prompt and say why, instead of guessing.

## Goal

Harden the first prompt with real domain expectations.

The research exists to improve:

- Scope
- Business rules
- Architecture
- Validation
- Security
- UX/UI
- Final prompt quality

## What To Research

Before generating any improved prompt, research:

- How similar systems usually work
- Common features in that domain
- Expected user flows
- Common business rules
- Frequent technical and security risks
- Anti-patterns to avoid
- Common UX/UI patterns for that system type

## Domains That Require Research

- Quotation systems
- E-commerce
- CRM
- Tickets and support
- Discord OAuth
- Scheduling
- Finance
- Admin dashboards
- Order management
- Marketplace
- Asset tracking
- Systems with uploads
- Systems with payments
- Systems with authentication and permissions

## Output Format

Keep it short.
Do not write a long report.
Do not copy site text.
Do not dump useless links.

Use one of these compact formats.

### Option A

```md
## Referências de domínio

- Sistemas desse tipo normalmente possuem...
- Fluxos comuns encontrados...
- Riscos comuns...
- O que evitar no primeiro prompt...
```

### Option B

```md
## Pesquisa rápida de domínio

- Padrão encontrado: ...
- Fluxo comum: ...
- Risco recorrente: ...
- Anti-pattern a evitar: ...

## Impacto no prompt

- Adicionar ...
- Remover ...
- Tratar ...
- Validar ...
```

## Behavior

- Be direct if the user's initial prompt is weak, incomplete or dangerous.
- Carry the research findings into scope, rules, architecture, validations, security and UX/UI.
- Keep only the useful findings that change implementation decisions.
- The purpose is to harden the initial prompt, not to produce an article.
