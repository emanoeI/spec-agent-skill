# Product Gap Review

This module is the Product Gap Pass.

Use `.spec/PRODUCT.md` as product truth after the foundation is understood.

## Goal

Find what is missing, weak or undefined in the product request.

## Review

- Main user flows
- Entry points
- Approval flows
- Error flows
- Empty states
- Official statuses
- Business exceptions
- Permission boundaries
- Ownership rules
- Audit needs
- Notifications or follow-up actions
- Admin or support flows when relevant

## Questions

- Which flow is still vague?
- Which rule is implied but not defined?
- Which status or transition is missing?
- Which exception can break the product?
- Which user action has no clear owner or permission?
- Which part of the request sounds good but is operationally incomplete?

## Output

- Convert the biggest gaps into `Falhas/riscos`.
- Convert missing rules into `Regras essenciais`.
- Use the findings to tighten the final prompt.
- Keep it short and product-focused.
