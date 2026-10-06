# ADR-0005: Coupons are entities inside the Discount aggregate, not an aggregate of their own

**Date**: 2026-10-05
**Status**: accepted
**Deciders**: nico

## Context

A discount issues coupons, a coupon is checked against its discount's properties and a coupon is
redeemed as part of its discount. The model needs to say whether a coupon stands on its own or belongs
to the discount that owns it.

## Decision

There is one aggregate, Discount, and coupons are part of it. The Discount root handles coupons
directly until they carry domain logic of their own; once a coupon does (it can be redeemed once), it is
an entity inside the aggregate, written as such from its first write. Coupons are reached only through
the root and are persisted with it, in a table that only the Discount repository reads and writes.
There is no coupon repository and no coupon port.

## Alternatives Considered

### Alternative 1: Coupon as an aggregate of its own, referencing its discount by id
- **Pros**: a coupon could be loaded and saved without its discount.
- **Cons**: a coupon would exist apart from the discount that owns it.
- **Why not**: a discount owns all its coupons and a coupon cannot exist independent of the discount
  that owns it, which is the definition of one aggregate with a single root.

## Consequences

### Positive
- A coupon is found through its discount: the one repository loads a discount by a coupon's token.
- A rule between a discount and its coupons is kept inside one boundary.

### Negative
- Saving a discount saves its coupons with it.

### Risks
- None recorded.
