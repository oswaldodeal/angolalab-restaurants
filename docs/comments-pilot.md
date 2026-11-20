# Restaurant comments — private pilot

Basic and Verified restaurant profiles share the same comments workflow. Restaurant verification does not verify the customer's account.

## Manual acceptance check

1. Sign in with a customer account that is not linked as the restaurant's owner. Open **My account → My comments** and copy its verification ID.
2. In authenticated **Staff review → Comment permissions and review**, enter that ID and an agreed public name. Confirm identity, phone ownership and publication permission privately; record a review note. Select **Allow comments**.
3. Refresh the customer's account. Choose a restaurant, then choose a dish or drink; its saved `AL-…` reference is selected with it. Own restaurants and restaurants without saved menu entries are excluded. Enter an experience of 20–1000 characters and consent to publication.
4. Confirm **Awaiting review** in the customer's account and confirm it is absent from the public profile.
5. Staff review the comment, record a note and publish. Open **Comments → Read more** on the restaurant profile in PT and EN. Staff can save an optional English translation during review or update a published comment. The Portuguese page shows the original, and the English page falls back to the original when no translation has been saved.
6. Check rejection/hiding, customer removal, revoking commenter access, invalid references, repeat submissions and an owner attempting to review their own restaurant. Repeat on a Basic and a Verified listing.

## Boundaries

- Only a valid staff session may grant/revoke comment permissions or moderate comments. Sign-up alone grants no commenting permission. Phone ownership is manually checked in this pilot; there is no automated SMS verification.
- Customer identity comes from Clerk, public name from staff verification, and reference validity from the selected restaurant's saved menu. No client-supplied user ID, display name or publication status is trusted.
- Pending/rejected/removed comments, account IDs and private review notes never appear in public comment data. Revoked commenters and withdrawn restaurant listings are excluded from reads.
- Customers cannot comment on their own linked restaurant. The insert enforces a rolling limit of one submission per restaurant per 24 hours and five submissions per customer per 24 hours, including removed or rejected submissions while their restaurant record exists.
- Failed submissions explain missing commenter permission, own-restaurant reviews, invalid menu references, withdrawn restaurants and rate limits separately. These messages do not replace the atomic insert checks.
- Moderation uses a version check; removal cannot be reversed by a stale review form. Database triggers record verification and moderation events.
- Authenticated account/staff flows create additive comment tables. Public reads never migrate or grant permissions. Before setup, the profile reports that comments are not yet available.
- Public profiles show the latest 20 approved comments. Account history shows 30; staff review shows up to 100 pending/approved comments, pending first.
- Existing photo storage and tier entitlements are unchanged. The illustrative tier preview is now restricted to demo profiles.

Validation: `node tests/restaurant-workflow.cjs`, `npx tsc --noEmit`, `npm run build`.
