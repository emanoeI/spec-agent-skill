# Output Contract

Every Spec answer must follow this structure.
This contract keeps the Decision Engine and Protection Layer visible without pasting a full implementation prompt in chat.

Before writing the answer, resolve `<spec-command>` using the active agent dialect:

- Codex: `$spec`
- Claude Code: `/spec`
- Cursor: `/spec`
- Generic agent: `spec`
- Unknown agent: reuse the command style the user used

Do not recommend `$spec` in Claude Code or Cursor.
Do not mix `$spec` and `/spec` in the same final answer unless explicitly explaining cross-agent usage.

```md
## Veredito

<Short viability call. Include readiness if useful. One or two sentences.>

## Tipo de trabalho

Greenfield | Feature | Refactor | Sensitive integration | Repair

## Pesquisa rápida de domínio

- Padrão encontrado: ...
- Fluxo comum: ...
- Risco recorrente: ...
- Anti-pattern a evitar: ...

## Falhas/riscos

- ...
- ...

## Foundation Score

- Score: 0-10
- Veredito: proceed | narrow scope | hold
- Ponto mais fraco: ...

## Impacto no projeto

- ...
- ...

## Base recomendada

- ...
- ...
- Proporcionalidade: por que esta stack é adequada ao tamanho e risco do problema?

## Escopo para vibecoding

- Fase 1: ...
- Próximo: ...
- Depois: ...
- Não implementar ainda: ...
- Condição de parada: ...

## Regras essenciais

- ...
- ...

## Prompt gerado

- Arquivo: `.spec/prompts/YYYY-MM-DD-short-request.md`
- Tarefas: `.spec/tasks/YYYY-MM-DD-short-request/`
- Primeira tarefa: `.spec/tasks/YYYY-MM-DD-short-request/01-foundation.md`
- Próximo passo: leia esse arquivo e implemente exatamente o que ele especifica.
- Comando seguinte: `<spec-command> check` ou `<spec-command> <novo pedido>`

## Testes mínimos

- ...
- ...

## Rollback / não regressão

- ...
- ...

## Atualizar memória

- Sessão: `.spec/sessions/YYYY-MM-DD-short-request.md`
- Decisões: atualizar `.spec/DECISIONS.md` quando houver escolha de stack, escopo, permissão, status, integração ou rollback.
```

## Style

- Short blocks only.
- Do not paste the full implementation prompt in chat when file editing is available.
- Technical language.
- Actionable content.
- Use short bullets.
- No motivational filler.
- No long consulting essay.
- No unnecessary theory.
- Focus on decision, risk, prompt and checklist.
- Keep the chat answer as a control panel, not as the full prompt body.
- If the request is dangerous, say so directly.
- If using Spec Score, keep it inside `Veredito` or one short bullet.
