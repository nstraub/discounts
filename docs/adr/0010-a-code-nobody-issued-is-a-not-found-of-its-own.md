# ADR-0010: A code nobody issued is a not-found of its own, not "no such discount"

**Date**: 2026-10-06
**Status**: accepted

## Context

`POST /redemptions` carries a coupon's code. When no coupon has that code, the request must be refused
as a `404`. The backend already refuses an id that no discount has (`NoSuchDiscountException`, answered
by `infra/missing-discount.ts` with "There is no such discount") on `PATCH /discounts/:id` and
`POST /discounts/:id/coupons`.

## Decision

A code nobody issued is its own refusal: `NoCouponHasTheCodeException`, raised by
`DiscountChanges.theOneThatIssued` when no discount holds the coupon, and answered with a `404` whose
message is "No coupon has this code". `CouponToken.read` raises it too for anything not written as a
token (wrong length or alphabet), so a malformed code and a well-formed one nobody issued are answered
alike. "There is no such discount" stays for discount ids. Two families may share a status; the rule is
one status per family, not one family per status. No domain event is raised: the target was not found.
The till is told "This coupon is not valid."

## Alternatives Considered

### Alternative 1: Reuse `NoSuchDiscountException` and its message
- **Pros**: no new exception, no new answer.
- **Cons**: the request names a coupon, so "There is no such discount" says something untrue about what
  was asked, and the one exception would mean two different missing things.
- **Why not**: the refusal is named for what is missing; the discount-id family keeps meaning a discount id.

## Consequences

### Positive
- Each refusal says what was asked for and could not be found.
- The till maps a `404` from `POST /redemptions` to its own answer, "not valid", without reading a message.

### Negative
- One more exception, and one more entry in the `infra/` list of refusals answered for redemptions.

### Risks
- None recorded.
