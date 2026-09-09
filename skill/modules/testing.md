# Testing

Every final prompt needs a manual or automated test checklist.

## Output

Always include:

```md
## Testes mínimos

- ...
- ...
- ...
```

For refactors, also include:

```md
## Não regressão

- fluxo atual X continua funcionando
- usuário sem permissão continua bloqueado
- dados existentes continuam legíveis
- rotas antigas continuam válidas
```

## Rules

- Prefer test cases tied to the critical path.
- Mention permission, validation and error-flow checks.
- For repairs, cover the broken path and the adjacent stable path.
- For repairs and refactors, verify existing data remains readable.
- For account areas, verify login, orders, security settings and profile data still work.
