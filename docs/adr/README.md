# Architecture Decision Records

A decision that chose between alternatives a later reader will ask about gets one record here. Copy
`template.md` to `NNNN-decision-title.md` and add a row below. A decision with no alternative weighed
gets none.

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-domain-events-through-a-port-with-an-eventemitter2-adapter.md) | Domain events are raised in the entity and published through a port whose adapter uses EventEmitter2 | accepted | 2026-10-05 |
| [0002](0002-anyone-can-act-for-any-store.md) | Anyone can act for any store: no store key, no identity | accepted | 2026-09-27 |
| [0003](0003-one-database-pool-per-process.md) | One database pool per process, closed on shutdown | accepted | 2026-10-05 |
| [0004](0004-coupon-token-form-and-entropy.md) | A coupon's token is ten Crockford base32 characters from a CSPRNG | accepted | 2026-10-05 |
| [0005](0005-coupons-are-entities-inside-the-discount-aggregate.md) | Coupons are entities inside the Discount aggregate, not an aggregate of their own | accepted | 2026-10-05 |
| [0006](0006-one-transaction-per-discount-when-counting.md) | A count restarts each discount in its own transaction; a store's discounts become consistent eventually | accepted | 2026-10-05 |
