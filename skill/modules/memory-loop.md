# Memory Loop

Close the context loop after each relevant Spec request.
This is the Memory Writer.

## Rule

After the analysis, suggest how `.spec/` should be updated.
Do this for every relevant Spec request, not only for large features.

If the agent can edit files, it may create or update them.
If it cannot edit files, it should provide ready-to-paste blocks.

## Output

Always include:

```md
## Atualizar memoria

Criar sessao:
.spec/sessions/YYYY-MM-DD-short-feature-name.md

Prompt gerado:
.spec/prompts/YYYY-MM-DD-short-feature-name.md

Tarefas geradas:
.spec/tasks/YYYY-MM-DD-short-feature-name/

Atualizar:
- .spec/RULES.md: ...
- .spec/RISKS.md: ...
- .spec/DECISIONS.md: ...
- .spec/TESTING.md: ...
- .spec/PROMPTS.md: ...
```

## Session Format

```md
# Session: <feature or decision>

Date: YYYY-MM-DD

## Request

<resumo do pedido original>

## Work type

Greenfield | Feature | Refactor | Sensitive integration | Repair

## Decisions

- ...

## Risks

- ...

## Rules added

- ...

## Prompt generated

<resumo e caminho para .spec/prompts/YYYY-MM-DD-short-feature-name.md>

## Task pack

<resumo e caminho para .spec/tasks/YYYY-MM-DD-short-feature-name/>

## Follow-up

- ...
```

## Rules

- Always suggest a session filename.
- Always mention the generated file in `.spec/prompts/` when a prompt was produced.
- Always mention the task directory in `.spec/tasks/` when task files were produced.
- Use `.spec/PROMPTS.md` for prompt policy and reusable requirements, not as the giant prompt body.
- Use `.spec/DECISIONS.md` for important product and architecture decisions, following the Decision Ledger format.
- For refactors, sensitive integrations and repairs, prefer updating `RISKS.md`, `TESTING.md` and `DECISIONS.md` at minimum.
- If file editing is unavailable, provide ready-to-paste Markdown blocks instead of vague suggestions.
- Treat session creation as mandatory for relevant Spec work, not optional polish.
