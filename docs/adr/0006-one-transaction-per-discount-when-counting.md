# ADR-0006: A count restarts each discount in its own transaction

**Date**: 2026-10-05
**Status**: accepted
**Deciders**: nico

## Context

Counting a store's discounted sales restarts the count of each of the store's discounts. A store can
have several discounts, and each discount, with its coupons, is one aggregate. The model needs to say
whether the restart of all of them is one transaction or one per discount.

## Decision

Each discount's count restart is its own transaction: one aggregate per transaction. The store's
discounts become consistent eventually, not at once.

## Alternatives Considered

### Alternative 1: One transaction for the whole store
- **Pros**: all of the store's discounts are counted at once or not at all.
- **Cons**: one transaction would span several aggregates.
- **Why not**: nico chose one transaction per discount.

## Consequences

### Positive
- A transaction holds one aggregate: the discount and its coupons are saved together.

### Negative
- Between the first and the last discount saved, a store's discounts are not all counted.

### Risks
- None recorded.
