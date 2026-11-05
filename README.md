# angolalab-restaurants
AngolaLab Restaurant Project

## Registration → reviewed Basic listing (private pilot)

The preview branch supports real pending registrations for Angola, Portugal and the UK.
Configure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and an existing staff password
(`STAFF_REVIEW_PASSWORD`, at least 16 characters) in the appropriate Vercel project/environment.
Never put these values in `NEXT_PUBLIC_` variables or source control.

1. Submit restaurant details at `/pt/restaurantes/registar` or `/en/restaurants/submit`.
2. Sign in at `/staff/review/login`. `/admin` now redirects to protected staff review.
3. Read the private record; confirm identity and permission to publish the limited public fields.
4. Write a review note (20–2000 characters), then publish Basic or reject.
5. Approved Basic records appear in both language directories and on their own profile URLs.
6. Staff can withdraw an approved listing with a recorded reason; its public profile is removed.

Publication does not verify a business. Basic profiles reveal only name, city, country,
cuisine and opening hours; no owner contact data, full address, map or fabricated menu.
Customer/owner sign-in and signup forms are disabled until real account authentication exists.

### Database upgrade and recovery

The first intake or authorized staff read runs the idempotent statements in
`lib/restaurant-schema.ts` using the existing server-only Turso connection.
It creates `restaurant_intake`, `restaurant_listings` and `restaurant_review_history`.
The original `restaurant_submissions` table is preserved unchanged. Legacy rows are
copied once per ID as pending records requiring fresh review, regardless of old status.
No existing record is automatically published or verified. UK rows use the new intake
schema; changing the old CREATE TABLE script alone would not upgrade existing tables.

SQLite triggers make publication/removal and the review-history entry atomic with the
status update. Repeated or stale decisions are rejected. Staff checks run on every action;
Next.js Server Actions provide the same-origin mutation boundary. Public pages select
only the public listing table and never run migrations. Database failures show an explicit
availability message instead of implying that sample records are the whole live directory.

The pilot uses a shared staff session (`shared-pilot-staff`), not individual staff accounts.
The audit trail records this shared identity, note, transition and time. Individual reviewer
accounts, customer phone verification, owner editing, images and menu codes remain future work.
The public read path intentionally excludes all private intake fields, including from React props.

Validation: `node tests/restaurant-workflow.cjs` (Node 22+ SQLite support), `npx tsc --noEmit`,
and `npm run build`. Tests use an isolated in-memory SQLite database with simulated HTTP
responses; they never contact the real Turso database or publish a real business.
