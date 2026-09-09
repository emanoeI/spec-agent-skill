# Security

Do not restate generic security theory. For each relevant signal in the request,
turn it into a concrete rule the implementation prompt must contain, and name the
failure mode it prevents. Only include the ones that apply to this feature.

## Signal → Rule → Failure Mode

- Resource fetched or mutated by ID from URL/body → require a server-side ownership check (`where owner_id = currentUser`/tenant) before returning or changing it. Prevents IDOR: `findById(req.params.id)` returning another user's record.
- Any state-changing request (create/update/delete) → require authentication and an authorization check for that specific action and role. Prevents privilege escalation where any logged-in user hits an admin action.
- Form or API input → require server-side validation even if the client validates. Prevents bypass via direct API calls or crafted payloads.
- Request body or file upload → require size/type limits and reject the rest. Prevents memory exhaustion and unbounded storage cost.
- File upload → validate content type, store outside the web root or in object storage, never execute, generate a new filename. Prevents RCE via uploaded scripts and path traversal.
- OAuth / external login → validate `state`, verify the callback, handle the denied/error path. Prevents CSRF on the OAuth flow and broken login on provider errors.
- Public or unauthenticated endpoint → add rate limiting / abuse protection. Prevents credential stuffing, scraping and cost-amplification abuse.
- Secrets, API keys, tokens → load from environment/secret store, never hardcode or log them. Prevents leaked credentials in the repo or logs.
- SQL / query built from input → use parameterized queries or the ORM's binding, never string concatenation. Prevents SQL injection.
- User-supplied text rendered in UI → escape/encode on output. Prevents stored/reflected XSS.
- Sensitive data (PII, financial, auth) in responses or logs → return only needed fields, redact in logs. Prevents overexposure and log leakage.
- Account or personal-data deletion → require explicit confirmation, authorization for the account owner, an audit record and a documented retention rule. Prevents accidental erasure and non-compliant data handling.

## Rules

- Treat auth, permissions, payment, upload and OAuth flows as sensitive by default.
- Surface only the rules that match the request; do not dump the whole list.
- Each rule you surface must be specific enough to implement without guessing.
- If a required control is missing and the feature is sensitive, say the request is unsafe as written.
