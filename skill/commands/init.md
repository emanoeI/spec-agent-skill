# Init Command

Use when the user invokes `$spec init`, `/spec init` or `spec init` inside a coding agent.

Goal: create useful `.spec/` project memory through conversation.
Do not generate an implementation prompt during init.
Do not ask the user to run `spec start`.

## Flow

1. Inspect `.spec/`.
2. Read [`../onboarding.md`](../onboarding.md).
3. Ask one question at a time.
4. Use the same language as the user.
5. Prefer 2-3 answer options when the user may not know what to choose.
6. Include one intelligent recommendation among the options when there is enough signal.
7. After each answer, update or prepare `.spec/` memory and decide if one more question is truly needed.
8. Update `.spec/CONTEXT.md`, `.spec/PRODUCT.md`, `.spec/TESTING.md`, `.spec/OPERATIONS.md`, `.spec/PERMISSIONS.md`, `.spec/DATA-MODEL.md` and `.spec/sessions/`.
9. End with the next agent command using the active agent dialect from `router.md`.

## Conversation Rules

- Never dump all onboarding questions at once.
- Ask only one question per assistant message.
- Ask the smallest useful next question.
- Default to 3 questions maximum for first init.
- If more detail would help, put it under "Depois podemos refinar" instead of blocking init.
- If the user gives enough context in one message, skip questions and create the memory.
- If the user gives vague input, ask the most important missing question first.
- Use options with one recommendation when helpful.
- Put the recommended option in the middle when possible, not always first.
- Mark exactly one option with `(Recomendado)`.
- Add one short reason after the options.
- Base the recommendation on repository signals, user wording or risk level.
- If there is not enough signal, say "Ainda nao tenho sinal suficiente para recomendar uma opcao." and do not fake confidence.

Example:

```md
Primeira pergunta:
Qual tipo de projeto estamos configurando?

A) Sistema interno
B) Ecommerce/marketplace (Recomendado)
C) Integracao/refatoracao

Recomendo B porque voce mencionou lojas, vitrine e venda.
```

## Output

Keep it short:

```md
Vou iniciar o Spec por etapas.

Primeira pergunta:
<uma pergunta objetiva com 2-3 opcoes quando fizer sentido>

<marque uma opcao como (Recomendado) quando houver sinal suficiente>
```

When enough context exists:

```md
Spec inicializado.

Atualizei:
- .spec/CONTEXT.md
- .spec/PRODUCT.md
- .spec/sessions/...

Proximo passo:
Use `<spec-command> <pedido>` dentro do agente.
```

Replace `<spec-command>` with the active dialect:

- Codex: `$spec`
- Claude Code/Cursor: `/spec`
- Generic: `spec`
