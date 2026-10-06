# Architecture Decision Records

A decision that chose between alternatives a later reader will ask about gets one record here. Copy
`template.md` to `NNNN-decision-title.md` and add a row below. A decision with no alternative weighed
gets none. A decision a later one replaces, in whole or in part, keeps its record: its status says
which ADR supersedes it and what part.

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-domain-events-through-a-port-with-an-eventemitter2-adapter.md) | Domain events are raised in the entity and published through a port whose adapter uses EventEmitter2 | accepted | 2026-10-05 |
| [0002](0002-anyone-can-act-for-any-store.md) | Anyone can act for any store: no store key, no identity | accepted | 2026-09-27 |
| [0003](0003-one-database-pool-per-process.md) | One database pool per process, closed on shutdown | accepted | 2026-10-05 |
| [0004](0004-coupon-token-form-and-entropy.md) | A coupon's token is ten Crockford base32 characters from a CSPRNG | accepted | 2026-10-05 |
| [0005](0005-coupons-are-entities-inside-the-discount-aggregate.md) | Coupons are entities inside the Discount aggregate, not an aggregate of their own | accepted | 2026-10-05 |
| [0006](0006-one-transaction-per-discount-when-counting.md) | A count restarts each discount in its own transaction; a store's discounts become consistent eventually | accepted | 2026-10-05 |
| [0007](0007-one-change-at-a-time-to-a-discount-with-a-row-lock.md) | A change to a discount runs in one transaction with the discount's row locked | accepted | 2026-10-06 |
| [0008](0008-coupons-collection-and-discount-events-inside-the-aggregate.md) | Discount delegates coupon bookkeeping to a Coupons collection and event building to DiscountEvents, and keeps deciding | accepted, in part superseded by 0009 | 2026-10-06 |
| [0009](0009-each-entity-raises-its-own-events.md) | Each entity raises its own events; no class builds or publishes them for others | accepted | 2026-10-06 |
| [0010](0010-a-code-nobody-issued-is-a-not-found-of-its-own.md) | A code nobody issued is a not-found of its own, not "no such discount" | accepted | 2026-10-06 |
