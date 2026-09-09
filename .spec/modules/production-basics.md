# Production Basics

The minimum that separates "works in the demo" from "survives real usage".
These are not over-engineering. Skipping them is a common vibecoding failure that
breaks quietly under load or real data. Surface only the ones relevant to the
request, as concrete rules in the prompt.

## Signal → Rule → Failure Mode

- List or table endpoint → paginate (limit + offset/cursor); never return all rows. Prevents the page that loads 50k rows and times out.
- Loop that queries per item → batch or join instead (kill N+1). Prevents one list view firing hundreds of queries.
- Column used in a WHERE/JOIN/ORDER BY on a growing table → add an index. Prevents full-table scans that get slower every week.
- External call (HTTP, payment, email) → set a timeout and handle failure; do not block forever. Prevents one slow dependency hanging every request.
- Retried or repeated write (webhooks, payments, form resubmit) → make it idempotent (unique key / upsert). Prevents duplicate charges and duplicate records.
- User-triggered heavy work (export, email blast, image processing) → move to a background job. Prevents request timeouts and dropped work.
- Any write path → wrap multi-step writes in a transaction. Prevents half-written state when step 2 fails.
- Public endpoint → rate limit it. Prevents abuse and runaway cost.
- File/image upload → cap size and store in object storage, not the app server disk. Prevents disk-full outages.
- Money → store as integer minor units or decimal, never float. Prevents rounding errors in totals.
- Timestamps → store in UTC; convert at display. Prevents off-by-hours bugs across timezones.

## Rules

- Match the rule to the project stage: an MVP needs pagination, timeouts and idempotency; it does not need sharding or a queue cluster.
- Prefer the simplest form of each rule (a DB index, a `LIMIT`, a unique constraint) over new infrastructure.
- Surface only what the request touches. Do not dump the whole list.
- If a basic is missing on a path that handles money, uploads or public traffic, treat it as a red flag.
