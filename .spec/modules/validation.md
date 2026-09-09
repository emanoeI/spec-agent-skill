# Validation

Never accept front-end-only validation. Turn each relevant input point into a
concrete server-side rule and name what breaks without it. Client-side feedback
is for UX; the server is the source of truth.

## Signal → Rule → Failure Mode

- Any data entering the system → validate on the server, not only in the browser. Prevents bad/malicious data via direct API calls that skip the UI.
- Enum-like or status field → validate against the allowed set of values. Prevents impossible states like an order status the app never handles.
- Status/lifecycle change → validate the transition is legal from the current state. Prevents skipping steps (e.g. `draft → paid` without `issued`).
- Required fields → reject when missing instead of writing partial rows. Prevents null/partial records that later crash reads.
- Numbers, money, quantities → check range, sign and precision (no negative totals, no overflow). Prevents corrupt financial or inventory data.
- Strings → normalize (trim, case, unicode) and bound length before storing or comparing. Prevents duplicate-by-whitespace and oversized payloads.
- Uniqueness rules (email, slug, external id) → enforce at the database level, not only in app code. Prevents race-condition duplicates under concurrent requests.
- Foreign references from input (parent id, category id) → verify they exist and belong to the caller. Prevents dangling or cross-tenant references.

## Rules

- Put validation where data enters the system, close to the write.
- Return friendly, non-technical error messages to the user.
- For existing systems, confirm new validation does not silently reject currently valid data.
- Surface only the rules that match the request; keep them implementable.
