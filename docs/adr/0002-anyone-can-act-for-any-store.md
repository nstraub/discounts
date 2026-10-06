# ADR-0002: Anyone can act for any store — no store key, no identity

**Date**: 2026-09-27
**Status**: accepted
**Deciders**: nico

## Context

The app has no concept of a user: no accounts, roles or identity anywhere. The epics give stores
actions that read as a store's own: Mike changes his discount's rate; Stephanie ends her discount,
redeems coupons at her till ("not for her store") and counts her discounted sales. With no identity,
nothing makes those actions the store's own: anyone could change or end Mike's discount, redeem at any
till, or read Stephanie's count. We discussed this and came to the conclusion below.

## Decision

Anyone can act for any store. There is no store key and no identity: whoever uses the app may publish,
change or end any discount, redeem a coupon at any store and see any store's count. Where a scenario
speaks of "her store", the store is the one the person acting says they are at: "not for her store"
means the coupon's discount belongs to a different store than the one named at the till.

This is a deliberate choice for this project, a self-contained showcase, not an oversight.

## Alternatives Considered

### Alternative 1: A store key
A secret link or code a store receives when it publishes its first discount; whoever holds it can
change or end that store's discounts, redeem at its till and see its count. No account, no login,
nothing about a person.
- **Pros**: a store's actions become its own without any user identity.
- **Cons**: a credential to issue, keep and recover; more scope than the showcase needs.
- **Why not**: nico chose the simpler option for this project.

## Consequences

### Positive
- No story needs identity or a credential; the app stays free of users.
- Changing a rate (`PATCH /discounts/:id`), and later ending, redeeming and counting, take no
  credential.

### Negative
- Anyone can change or end any store's discount.

### Risks
- If the product leaves the showcase, this ADR is superseded; a store key is the recorded
  alternative, and it keeps the no-identity rule.
