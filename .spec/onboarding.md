# Onboarding Behavior

Use this guidance when the project has no Spec context yet or when the user invokes `init`.

Onboarding runs inside the coding agent.
Do not ask the user to run `spec start` in the terminal.
Use the same language as the user.
If the user writes in Portuguese, ask and answer in Portuguese.

## Goal

Create a minimal but useful project memory.
Start the protection loop early.

## Progressive Questions

Do not ask all questions at once.
Ask one question per assistant message.
Default to 3 questions maximum for the first init.
If the user already provided an answer, do not ask it again.
Use options when the user may not know what to answer.
When using options, include one intelligent recommendation if there is enough signal.
Put the recommended option in the middle when possible.
Mark exactly one option with `(Recomendado)`.
Explain the recommendation in one short sentence.
Base the recommendation on repository signals, user wording or risk level.
If there is not enough signal, say so and do not fake a recommendation.
Create useful memory as soon as there is enough context.

Priority order:

1. What is this project and who is it for?
2. What is the main goal or pain?
3. What must not break or happen?
4. What stage is it in?
5. What stack is being used?
6. What visual/UX direction should the agent follow?

English first question:

```md
Vou inicializar o Spec em etapas.

Primeira pergunta:
What are we building, and who is it for?

If easier, choose one:
A) new SaaS
B) internal tool (Recommended)
C) ecommerce/marketplace
D) integration/refactor

I recommend B only if the repository looks like an internal tool or the user described internal operations.
```

Portuguese first question:

```md
Vou inicializar o Spec em etapas.

Primeira pergunta:
O que estamos criando e para quem?

Se for mais facil, escolha uma:
A) SaaS novo
B) sistema interno (Recomendado)
C) ecommerce/marketplace
D) integracao/refatoracao

Recomendo B apenas se o repositorio parecer ferramenta interna ou se voce descreveu operacao interna.
```

## Rules

- Keep questions short.
- Ask one question at a time.
- Do not show a 7-question checklist in chat.
- Prefer choices/options over open-ended forms.
- Include one smart recommendation inside the options when there is enough signal.
- Do not always recommend the first option.
- Do not recommend without explaining why.
- Do not ask for architecture details unless truly needed.
- Use repository scan signals to fill gaps.
- Store the answers in `.spec/`.
- Treat `.spec/` as operational memory, not documentation theater.
- Create the first file inside `.spec/sessions/`.
- Update testing, permissions, operations and data model notes during onboarding.
- After updating files, tell the user to continue using the active agent dialect from `router.md`.
- Never tell the user to type `/spec` in `cmd`, PowerShell or bash.
