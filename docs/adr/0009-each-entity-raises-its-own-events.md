# ADR-0009: Each entity raises its own events

**Date**: 2026-10-06
**Status**: accepted; supersedes the `DiscountEvents` decision and Alternative 1 of ADR-0008

## Context

ADR 0008 kept every event of the aggregate in `Discount`: `Discount` told a `DiscountEvents` collaborator
what happened, and that built each event and published it through the event-publisher port. `Coupons`,
the collection of the discount's coupons, did the coupon bookkeeping (issuing, counting) but raised
nothing, so `Discount` raised `CouponIssued` and `DiscountedSalesCounted` for what `Coupons` had done.

Two costs showed. `DiscountEvents` is named for an implementation artifact (handling a discount's
events), not for anything in the domain, and it knew the payload of every event of every entity: adding a
field to an event changed it and the entity that raised it. And an event was raised by an object that did
not own the rule behind it.

## Decision

Each entity, or collection of entities, inside the aggregate raises the events of what it owns, through
the event-publisher port it is given.

- `Discount` raises `DiscountPublished`, `DiscountPublicationRejected`, `DiscountRateChanged` and, for
  the store rule, `CouponRedemptionRejected`.
- `Coupons` owns issuing and counting: it raises `CouponIssued` and `DiscountedSalesCounted`, one per
  discount, each carrying the discount's id.
- `Coupon` raises `CouponRedeemed` and its single-use `CouponRedemptionRejected`.

`DiscountEvents` is removed. No class exists to build or publish the events of others. `Coupons` stays as
ADR 0008 set it up: no port, no repository, reached only through `Discount`, persisted with it.

## Alternatives Considered

### Alternative 1: Keep `DiscountEvents` as an announcer
- **Pros**: an event's payload is built in one place; `Discount` stays free of event construction.
- **Cons**: a helper named for an implementation artifact breaks encapsulation: it knows what each
  entity's events carry. A field added to an event still means passing it through the announcer.
- **Why not**: the entity that owns a rule is the one that knows what its events say.

### Alternative 2: `Discount` raises the coupon events for what `Coupons` did (ADR 0008)
- **Pros**: every event of the aggregate has one raiser.
- **Cons**: the event is raised away from the rule that decides it, and `Discount` must be told what
  `Coupons` did in order to raise it.
- **Why not**: `Coupons` owns issuing and counting, so it raises their events.

## Consequences

### Positive
- An event changes where its rule is, and nowhere else.
- No helper class sits between an entity and the port.

### Negative
- `Coupons` and `Coupon` hold the event-publisher port as well as `Discount`; three objects depend on it.
- An event is raised from more than one class, so the places that raise events are not found in one file.

### Risks
- None recorded.
