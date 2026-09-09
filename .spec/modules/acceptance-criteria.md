# Acceptance Criteria

Generate an objective, testable checklist that is specific to THIS request.
Do not emit generic categories. Instantiate each one with the actual entities,
roles and rules of the feature being built.

## Method

For each category below, write a concrete, checkable statement using the real
domain terms from the request. If a category does not apply, skip it.

- Happy path: the main action succeeds with valid input and the expected result is visible/persisted.
- Permissions: name the role that is blocked and the exact action, with the expected response.
- Validation errors: name a specific invalid input and the exact rejection behavior.
- Empty state: what the user sees before any data exists.
- Error state: what the user sees when the operation fails.
- Audit/logging: which sensitive action must leave a record, when relevant.
- Responsive/UI: which view must work on small screens, when UI is involved.
- Minimum automated tests: the one or two checks worth automating for this feature.

## Example

Vague (reject this): "permissions work", "validation works".

Specific (aim for this):
- A user without the `admin` role gets `403` when calling `DELETE /invoices/:id`.
- Submitting an invoice with `amount = -10` is rejected with "Amount must be positive" and nothing is saved.
- With zero invoices, the list shows the empty state, not a blank table.

## Rules

- Every criterion must be objectively pass/fail.
- Use the request's real nouns (entities) and verbs (actions), not placeholders.
- Avoid vague statements like "works well" or "is secure".
