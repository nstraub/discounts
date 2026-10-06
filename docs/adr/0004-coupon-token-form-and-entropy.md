# ADR-0004: A coupon's token is ten Crockford base32 characters from a CSPRNG

**Date**: 2026-10-05
**Status**: accepted

## Context

A coupon is identified by its token alone, so the token is all that stands between a guess and a free
sale, and nothing throttles guessing. The token is also read out and typed at a till.

## Decision

A token is ten characters of Crockford base32 (no I, L, O or U), about 50 bits, drawn from a
cryptographically secure random source (`crypto.getRandomValues`, injected as a random source). It is
shown as two groups of five and is case-insensitive. The `coupons` table holds it under a unique
constraint.

## Alternatives Considered

### Alternative 1: A UUID
- **Pros**: no code to write for it.
- **Cons**: it cannot be read out at a till.
- **Why not**: the token is read aloud and typed.

### Alternative 2: A shorter token, about 40 bits
- **Pros**: shorter to read and type.
- **Cons**: guessing it would need throttling, which the app does not have.
- **Why not**: 50 bits makes guessing impractical without throttling.

## Consequences

### Positive
- Crockford base32 leaves out the characters people misread.
- The unique constraint mirrors the rule that a coupon is identified by its token, and tightens nothing.

### Negative
- A typed token needs normalising (O to 0, I and L to 1, case, the separator) before it is looked up.

### Risks
- None recorded.
