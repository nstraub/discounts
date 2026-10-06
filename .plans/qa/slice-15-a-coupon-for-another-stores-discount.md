# Slice 15: A coupon for another store's discount — red-test outline

The acceptance criterion is the scenario "A coupon for another store's discount" of story 2 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rules: a coupon is redeemed only at the store
whose discount it is for; "her store" is the store the person at the till says they are at, and anyone can act
for any store. Its text is appended to
`packages/sut/acceptance/features/stephanie-takes-the-coupon-at-the-till.feature`, carrying `@wip` while it is
red; the cases it leaves implicit are `@todo` scenarios with their steps written and no step definitions, in
that feature and in `rodrigo-counts-the-discounted-sales.feature`.

This is the first scenario where the store decides an outcome, so the store the till sends arrives at the
backend here: the till's pair of name and address is compared exactly with the name and address of the
coupon's discount, and a store with the same name at another address is another store (settled). The refusal
depends on the discount's state, so `Discount` decides it and raises it (settled). The case of a till that
says no store, recorded with "Stephanie redeems a coupon", is built here too (settled): Stephanie is told to
say which store she is at, and the coupon stays unused.

Files read: `AGENTS.md`, `.plans/stephanie-comeback-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-4-stephanie-tells-people-what-is-new-about-her-produce.md`, the outlines
and scenarios of "Stephanie redeems a coupon", "Rodrigo counts the discounted sales since his last count" and
"A coupon counts only once", the step patterns under `packages/sut/acceptance/features/steps/`, the method
names of `packages/sut/acceptance/support/discounts-page.ts`, the exported declarations of
`packages/types/discounts.ts` and `packages/frontend/src/discounts/texts.ts`, and the file list of
`packages/backend/src/discounts/**`. No implementation body was read.

## Outlined

27 new `it.todo` lines, all built in this slice, plus 1 line recorded with "Stephanie redeems a coupon" and
built here: 28 built. One spec file is new; lines for seven existing spec files are added inside each file's
top-level `describe`, in groups of their own; no existing line is changed. One recorded line and its `@todo`
scenario are removed (*Removed*).

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 4 — redeems its coupon at its own store; refuses it at another store, the coupon staying unused; raises `CouponRedemptionRejected` with its id, the token and that the coupon is not for that store; raises no `CouponRedeemed` | the scenario; the refusal depends on the discount's state, so `Discount` raises it (settled); invariant 1 | edge-case-discovery (state) | `unit/backend/discounts/application/domain/discount/redeem-coupon.spec.ts` (added) |
| 4 — refuses it at a store with the same name at another address; with another name at the same address; with a name that differs only in its capitals; with spaces around a name its own has not | the pair is compared exactly (settled) | edge-case-discovery (boundary) | same file |
| 1 — redeems at its own store a coupon refused at another store before | a refusal keeps nothing | edge-case-discovery (state) | same file |
| 1 — a coupon already used, tried at another store, refused as not for that store | used × another store: the store is checked before the coupon's own single use (settled as a proposal; the question stays open, beside its `@todo`) | edge-case-discovery (combination) | same file |
| 4 — redeems at the store given when it is its discount's; reports the coupon is not for that store; keeps nothing; announces `CouponRedemptionRejected` | the scenario | edge-case-discovery | `unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` (added) |
| 4 — 422 with the error schema, a family of its own (settled); the coupon kept unused, the discount as it was; `CouponRedemptionRejected` on the wired app's emitter; refused at a store with the same name at another address | the scenario; invariant 2; the family joins the error-schema line in the unit that adds it | api-testing (exception family, event); edge-case-discovery (combination) | `contract/discounts/post-redemptions-at-another-store.spec.ts` (new; `post-redemptions.spec.ts` nears 200 lines once its lines are filled) |
| 2 — 400 naming the store's name and address when missing or not text, never a 500; 400 naming them when empty or only blank space; the coupon unused | no store said (settled); blank text counts as missing (settled) | api-testing (malformed request); edge-case-discovery (empty) | same file |
| 1 — a store name of 10 000 characters refused as not for that store, never a 500 | the store is free text from anyone | adversarial-testing (A1) | same file |
| 1 — a coupon refused at another store's till counted with neither store | the count reads stored state (settled) | database-testing (state) | `contract/discounts/post-stores-counts.spec.ts` (added) |
| 1 — a coupon redeemed at its own store kept redeemed when it is tried at another store at the same moment | saving one discount never loses a change another request kept meanwhile (settled) | adversarial-testing (A4) | `contract/discounts/changes-to-one-discount-at-the-same-moment.spec.ts` (added) |
| 1 — each store listed with its name and address exactly as published, spaces around them included | shown text is trimmed (settled) × the pair compared exactly (settled): a till that sent the trimmed pair would be refused at its own store | edge-case-discovery (combination) | `unit/frontend/stores/discounts-store/stores.spec.ts` (added) |
| 1 — holds that the coupon is not for the store picked | the page reaches the redemption through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/redeem-coupon.spec.ts` (added) |
| 2 — tells Stephanie the coupon is not for her store; does not say the discount applies | the scenario ("Stephanie is told it is not for her store"); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` (added) |

Line recorded with "Stephanie redeems a coupon" and built here:

| Line | Spec file (under `packages/sut/`) |
|---|---|
| tells Stephanie to say which store she is at when none is picked, redeeming nothing | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` |

A coupon not for the store given answers 422, a family of its own, apart from a coupon already used (409) and
a code nobody issued (404): the till tells the three apart by status alone, with no code added to the error
schema (settled). The till's message is `This coupon is not for your store.`, and the one for no store picked
`Say which store you are at.`, both in `discountTexts` (settled); the store's name and address are a required
part of the request, 400 when absent.

The step definitions: "Given Sue has a coupon for Mike's discount" publishes Mike's discount through the page
and gets Sue a coupon for it, as "Sue has a coupon for Stephanie's discount" does for Stephanie's; "When Sue
tries to use it at Stephanie's store" opens the till, picks Stephanie's store, which has published a discount
of its own so that the till offers it, and types the code as Sue's page shows it; "Then Stephanie is told it
is not for her store" checks the till's answer. The captions, the till's address and the example values live
in the page driver, not in the steps.

Expected lengths once the outlines of "Stephanie redeems a coupon", "Rodrigo counts the discounted sales since
his last count" and "A coupon counts only once" are applied, with this outline's lines added:
`stephanie-takes-the-coupon-at-the-till.feature` about 139 lines, `rodrigo-counts-the-discounted-sales.feature`
about 133 (after the removal below); `unit/backend/discounts/application/domain/discount/redeem-coupon.spec.ts` 37,
`unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` 29,
`unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` 32,
`unit/frontend/stores/discounts-store/redeem-coupon.spec.ts` 20, `unit/frontend/stores/discounts-store/stores.spec.ts`
18, `contract/discounts/post-stores-counts.spec.ts` 51 (after the removal below), `contract/discounts/changes-to-one-discount-at-the-same-moment.spec.ts`
15 — all as outlines; none passes 200 lines once filled at the length of the specs already filled.

The `@todo` scenarios "A coupon refused at another store still applies at its own", "A store with the same name
at another address cannot take the coupon", "A used coupon tried at another store", "Sue's coupon is tried at
another store while it is used at its own" and "A coupon refused at another store's till is not a discounted
sale" are the acceptance-level record of lines built above; so is "Stephanie does not say which store she is
at", already in the feature.

## Removed

Wrong-store coupons are refused from this slice on, so a coupon redeemed at another store's till can no
longer be counted with any store. The recorded line and the `@todo` scenario that asked which store counts it
are removed in this slice's outline commit; no built line is touched.

| File | Lines removed (as outlined; check them on the tree) |
|---|---|
| `packages/sut/contract/discounts/post-stores-counts.spec.ts` | 40–43: the group `describe('a coupon taken at another store\'s till', …)`, its one line `it.todo('should count a coupon redeemed at another store\'s till with the store of its discount')`, its closing `});` and the blank line after it |
| `packages/sut/acceptance/features/rodrigo-counts-the-discounted-sales.feature` | 77–86: the three comment lines asking which store's count includes a coupon taken at another store's till, `@todo`, `Scenario: A coupon taken at another store's till` with its four steps, and the blank line after it |

## Recorded for later

None.

## Out of scope

- A store with several discounts: the comparison is with the coupon's own discount, so the store's other
  discounts change nothing; "Another coupon for the same discount still applies" and the store listed once
  already cover the till's side.
- A coupon nobody issued tried at any store: owned by "A coupon nobody issued"; with no discount there is no
  store to compare.
- A coupon of an ended discount at another store: owned by "A coupon for a discount that has ended".
- Telling "not for her store" apart from "nobody issued" lets whoever holds a code learn it is a coupon of
  some store: the scenario asks for it, and the store list is public, so the holder could try every store
  anyway; throttling code after code stays recorded with "Stephanie redeems a coupon".
- Which store a coupon taken at the wrong till is counted with: the case no longer arises once a coupon is
  refused at another store (*Removed*); the count line above pins that nothing is counted.
- Checking the store in the page before redeeming: the rule has one home, the aggregate; the page shows what
  it answers.
- A2 injection: the store is compared inside `Discount`, after the discount is loaded by the coupon's token;
  it reaches no query (n/a). A3 inverted: no accounts; see the row on telling refusals apart. A5: the transport
  limit is application-wide and pinned by `POST /discounts` (n/a). A6: cheating the store is the scenario
  itself; anyone may act for any store (settled).
- Time: no rule of this slice depends on a date or a clock (n/a).
- The controller: thin, pinned by the contract lines only.
- Migration slots: the comparison reads the discount's existing name and address; nothing new is kept (n/a).

## Invariants assumed

1. Every rule emits an event: a coupon refused at another store raises `CouponRedemptionRejected`, carrying the
   discount's id, the token and the reason, inside `Discount`, and no `CouponRedeemed`.
2. One exception family → one status: a coupon not for the store given → 422 (settled); no store given → 400
   naming the store's name and address, the malformed-request family.
3. Combinations: the pair × name or address differing, capitals, surrounding spaces; refused × redeemed later
   at its own store; used × another store (proposal built, question open); shown trimmed × compared exactly; refused × counted;
   tried at another store × redeemed at its own at the same moment.
4. Round-trip: the existing lines; a refusal changes nothing kept.
5. Schemas no stricter than the domain: the request schema already takes any text for the store's name and
   address; requiring them is the domain's rule that a coupon is redeemed at a store.
6. One line per element the view shows: the refusal on the till; the request to say which store.
7. One aggregate per transaction: a refused attempt keeps nothing, and never overwrites a redemption kept
   meanwhile.
8. New names, none declared yet: the store taken by `DiscountService`'s and `Discount`'s redeeming, the
   not-for-this-store exception family and the two captions in `discountTexts`. A different name moves its
   line; the lines stay.
9. No identity: a refusal records no one and no time; the store tried is not kept.

## Dependencies

None new.
