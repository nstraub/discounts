# Slice 13: A coupon counts only once — red-test outline

The acceptance criterion is the scenario "A coupon counts only once" of story 2 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rules: a coupon is single-use, one coupon
for one sale; a count covers everything since the last count. Its text is appended to
`packages/sut/acceptance/features/stephanie-takes-the-coupon-at-the-till.feature`, carrying `@wip` while it is
red; the cases it leaves implicit are `@todo` scenarios with their steps written and no step definitions, in
that feature and in `rodrigo-counts-the-discounted-sales.feature`.

The slice also builds three lines already outlined: "should redeem a coupon once when it is used twice at the
same moment" in `contract/discounts/post-redemptions.spec.ts`, and "should count each redeemed coupon once
between two counts of a store arriving at the same moment" and "should count a coupon redeemed during a count
once, in that count or the next" in `contract/discounts/post-stores-counts.spec.ts`. Together with the new
concurrency lines below they pin one guarantee (settled): saving one Discount never loses a change another
request kept meanwhile; a redemption is never lost or counted twice, and a coupon is never counted in two
counts. How that is achieved is left open; whatever it is, no one is shown a refusal for a change made
since they looked, and a change of rate stays last-write-wins.

Files read: `.plans/stephanie-comeback-epic.md`, the outlines and scenarios of "Stephanie redeems a
coupon" and "Rodrigo counts the discounted sales since his last count", and the recorded rulings on single use,
the count and concurrent changes. No implementation body was read.

## Outlined

20 new `it.todo` lines, all built in this slice, plus the 3 existing lines named above: 23 built. One spec file
is new; lines for seven existing spec files are added inside each file's top-level `describe`, in groups of
their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 3 — refuses a second redemption, staying used; raises `CouponRedemptionRejected` with its discount's id, its token and the reason; raises no second `CouponRedeemed` | the scenario; single use is `Coupon`'s rule, so `Coupon` raises the refusal (settled); invariant 1 | edge-case-discovery (state) | `unit/backend/discounts/application/domain/coupon/redeem.spec.ts` (added) |
| 1 — refuses a second redemption once the first has been counted | a count restarts the count, never a coupon's use | edge-case-discovery (state) | same file |
| 1 — refuses the used coupon, leaving its other coupons as they were | coupons are reached only through `Discount` | edge-case-discovery (combination) | `unit/backend/discounts/application/domain/discount/redeem-coupon.spec.ts` (added) |
| 2 — reports the coupon has already been used; announces `CouponRedemptionRejected` | the scenario | edge-case-discovery | `unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` (added) |
| 4 — 409 with the error schema; the coupon kept used once, the rest as it was; `CouponRedemptionRejected` on the wired app's emitter; refused when typed in lower case, in two groups, the second time | the scenario; invariant 2; the typed form × a used coupon | api-testing (exception family, event); edge-case-discovery (combination) | `contract/discounts/post-redemptions.spec.ts` (added) |
| 1 — a coupon whose second use was refused counted once | the count reads stored state (settled) | database-testing (state) | `contract/discounts/post-stores-counts.spec.ts` (added) |
| 5 — a coupon issued and another redeemed at the same moment both kept; two coupons issued at the same moment both kept; a redemption and a change of rate at the same moment both kept; each answered as it would be alone, never refused for a change kept meanwhile; the later of two changes of rate kept | the guarantee above (settled) | adversarial-testing (A4) | `contract/discounts/changes-to-one-discount-at-the-same-moment.spec.ts` (new) |
| 1 — holds that the coupon has already been used | the page reaches the redemption through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/redeem-coupon.spec.ts` (added) |
| 2 — tells Stephanie the coupon has already been used; does not say the discount applies | the scenario ("Stephanie is told it has already been used"); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` (added) |

The concurrency lines run each pair of requests through the wired app against the real database, as many
times as it takes for the red to be reliable; the stress is tuned until it is.

The step definitions: "Given Sue has used her coupon at Stephanie's store" does what "Sue has a coupon for
Stephanie's discount" and "Sue uses it at Stephanie's store" do together; "When Sue tries to use it again"
types the same code at Stephanie's till once more; "Then Stephanie is told it has already been used" checks the
till's answer. The captions and the example values live in the page driver, not in the steps.

The `@todo` scenarios "A coupon used before Rodrigo's count is still used after it", "A coupon is got while
another is used", "Stephanie changes the rate while a coupon is used" and "A coupon used again counts once" are
the acceptance-level record of lines built above; "Sue's coupon is used at two tills at the same moment" is
that of the existing line this slice builds.

## Recorded for later

None.

## Out of scope

- Telling "already used" apart from "never issued" lets whoever holds a used code learn it was a coupon: the
  scenario asks for it, and a used code buys nothing; "A coupon nobody issued" owns the answer to a code never
  issued.
- When the coupon was first used, and where: nothing records either; there is no identity, and no time is kept.
- A used coupon tried at another store: the scenario's refusal holds wherever it is tried; the store's own
  refusal is owned by "A coupon for another store's discount".
- A used coupon of an ended discount: owned by "A coupon for a discount that has ended".
- The rate a coupon applies at when the rate changes after it was got: a question held with Stephanie.
- A1, A2, A5: the slice adds no input, sink or dependency (n/a). A3: no handle is added; see the first row. A6:
  replaying a redemption is the scenario itself.
- Time: no rule of this slice depends on a date or a clock (n/a).
- The controller: thin, pinned by the contract lines only.

## Invariants assumed

1. Every rule emits an event: a refused second use raises `CouponRedemptionRejected`, carrying the discount's id,
   the token and the reason, inside `Coupon`.
2. One exception family → one status: a coupon already used → 409 (proposed).
3. Combinations: a used coupon × counted or not; × typed another way; × the discount's other coupons. Concurrent
   changes to one discount: issue × redeem, issue × issue, redeem × change of rate, change × change, redeem ×
   redeem, count × count, count × redeem.
4. Round-trip: the existing lines; a refused use changes nothing kept.
5. Schemas no stricter than the domain: no schema changes; the refusal's body is the error schema.
6. One line per element the view shows: the refusal on the till.
7. One aggregate per transaction: each request keeps one Discount; none loses another's change to it.
8. New names, none declared yet: `CouponRedemptionRejected`, the coupon-already-used exception family and its
   caption in `discountTexts`. A different name moves its line; the lines stay.
9. No identity: a refusal records no one and no time.

## Dependencies

None new.
