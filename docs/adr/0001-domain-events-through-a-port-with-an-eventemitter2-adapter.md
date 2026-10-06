# ADR-0001: Domain events are raised in the entity and published through a port whose adapter uses EventEmitter2

**Date**: 2026-10-05
**Status**: accepted
**Deciders**: nico

## Context

When a business rule decides a behaviour, the domain announces it with a domain event named in the
past participle, such as `DiscountPublished`. The domain must not depend on a messaging mechanism, so
something has to carry the event out of it.

## Decision

The entity that owns the rule raises the event (`Discount.publish()`), and publishes it through the
`DomainEventPublisher` port. Its adapter, `EventEmitterDomainEventPublisher`, uses EventEmitter2.

## Alternatives Considered

### Alternative 1: A no-op (null-object) publisher
- **Pros**: no dependency on an emitter until a subscriber exists.
- **Cons**: the event goes nowhere.
- **Why not**: the adapter uses EventEmitter2 instead of a no-op.

## Consequences

### Positive
- The domain depends only on the port; the emitter stays in `infra/`.
- A subscriber can be added without changing the domain.

### Negative
- Events are emitted whether or not anything subscribes.

### Risks
- None recorded.
