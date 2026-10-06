# ADR-0007: A change to a discount runs in one transaction with the discount's row locked

**Date**: 2026-10-06
**Status**: accepted

## Context

Saving a discount rewrites its coupons. Two requests changing one discount at the same moment (two
redemptions of one coupon, two counts, an issue or a redemption racing a rate change) could each lose
the other's change, redeem a coupon twice or count it twice. Whatever prevents this must not show the
user a "changed since you looked" refusal, and a change of rate keeps last-write-wins.

## Decision

Issuing, redeeming and counting run through `DiscountRepository.changing(work)`. The Drizzle adapter
runs the work in one database transaction, and `withId` locks the discount's row (`SELECT … FOR UPDATE`)
before it reads the coupons. Concurrent changes to one discount are serialised by the database.

## Alternatives Considered

### Alternative 1: A version check on the aggregate that reloads and reapplies
- **Pros**: no lock held while the change runs.
- **Cons**: a change that finds a newer version has to be loaded and applied again.
- **Why not**: the transaction with the row lock serialises the changes, so none is reapplied.

### Alternative 2: A save that writes only what changed
- **Pros**: no coupon is rewritten that the change did not touch.
- **Cons**: it does not stop two redemptions of one coupon from both succeeding.
- **Why not**: the guarantee needs the changes to one discount to run one at a time.

## Consequences

### Positive
- A redemption is never lost or counted twice; a coupon is never counted in two counts.
- Nobody is shown a refusal for a change made since they looked.

### Negative
- Changes to one discount wait for each other.
- `changeRate` runs outside `changing`; it keeps last-write-wins on the rate.

### Risks
- None recorded.
