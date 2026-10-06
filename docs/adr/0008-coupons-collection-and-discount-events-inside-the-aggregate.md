# ADR-0008: Discount delegates coupon bookkeeping and event building, and keeps deciding

**Date**: 2026-10-06
**Status**: accepted; the `DiscountEvents` decision and Alternative 1 are superseded by ADR-0009

## Context

`Discount` is the aggregate root and does the heavy lifting: the rate rule, the store rule, what a count
restarts, and raising its events (ADR 0001). As it gained rules it grew past a size where it still reads
as one thing, and it had two reasons to change besides its rules: how its coupons are kept, and what each
event carries.

## Decision

`Discount` keeps deciding: it runs every rule and raises every one of its events at the point the rule
decides. Two collaborators inside the aggregate take the rest.

- `Coupons` is a collection with no port and no repository, reached only through `Discount` and persisted
  with it. It issues coupons, finds one by token and hands it the redemption, counts what was redeemed
  since the last count, and gives its state. It answers with plain facts (a number); `Discount` builds the
  answers it returns.
- `DiscountEvents` builds each event from the terms `Discount` tells it and publishes it through the
  event-publisher port. It decides nothing.

`Coupon` still raises `CouponRedeemed` and its own single-use refusal.

## Alternatives Considered

### Alternative 1: Coupons raises the coupon events
- **Pros**: `Discount` shrinks further.
- **Cons**: the event is no longer raised in the entity that owns the rule.
- **Why not**: events are raised inside the entity that owns the rule (ADR 0001); `Discount` raises
  `CouponIssued` and `DiscountedSalesCounted`.

### Alternative 2: Move publishing out of Discount
- **Pros**: `Discount` no longer touches events.
- **Cons**: the aggregate would no longer do its own heavy lifting.
- **Why not**: the root keeps the rules and their events.

## Consequences

### Positive
- Coupon bookkeeping and an event's payload each change in one place, apart from the discount's rules.
- A rule added to `Discount` has room.

### Negative
- A field added to an event is passed through `DiscountEvents` field by field: more files change.

### Risks
- None recorded.
