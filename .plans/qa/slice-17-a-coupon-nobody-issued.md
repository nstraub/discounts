# Slice 17: A coupon nobody issued — red-test outline

The acceptance criterion is the scenario "A coupon nobody issued" of story 2 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rule that a coupon is identified by its
token alone. Its text is appended to
`packages/sut/acceptance/features/stephanie-takes-the-coupon-at-the-till.feature`, carrying `@wip` while it is
red; the cases it leaves implicit are `@todo` scenarios with their steps written and no step definitions.

A code nobody issued is a target not found, apart from a coupon already used (409) and a coupon for another
store (422) (settled): `POST /redemptions` answers 404 with a body matching the error schema, no rule of the
aggregate runs, so no domain event is raised, and the lookup by token answers with nothing rather than failing.
A code that cannot be a coupon's (another length, a letter no token has) gets the same answer as a well-formed
code nobody issued, recorded with "Stephanie redeems a coupon" and built here. The till tells the three
refusals apart by status alone, with nothing added to the error schema (settled).

The 404 narrows the redemption's refusals by family: today `POST /redemptions` answers 422 for a coupon not for
this store and 409 for any other failure, so a code nobody issued is answered as a coupon already used. Once
this slice is built, 409 is the answer to a coupon already used only.

`PATCH /discounts/:id` and `POST /discounts/:id/coupons` already answer 404 for an id no discount has, through
`NoSuchDiscountException` and `infra/missing-discount.ts`. A code names no discount, so the lines below are
named by what Stephanie is told ("no coupon has the code"), not by that family; whether the code's refusal
reuses it or is a not-found family of its own is not settled (*Invariants assumed*, 7). Either way it answers
404, and the lines hold.

Files read: `AGENTS.md`, `.plans/stephanie-comeback-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-15-a-coupon-for-another-stores-discount.md`, the feature
`stephanie-takes-the-coupon-at-the-till.feature`, the step patterns under
`packages/sut/acceptance/features/steps/`, the spec files the lines are added to, the line names of
`contract/discounts/post-redemptions.spec.ts`, `post-redemptions-already-used.spec.ts`,
`post-redemptions-at-another-store.spec.ts`, `post-discounts-id-coupons.spec.ts`, `patch-discounts-id.spec.ts`
and `contract/types/rest-api/fetch-rest-api.spec.ts`, the unit lines for an unknown id in
`unit/backend/discounts/application/discount-service/change-rate.spec.ts` and `issue-coupon.spec.ts`,
`packages/sut/support/example-stores.ts`, `packages/sut/contract/support/error-schema.ts`, the exports of
`packages/sut/support/example-discounts.ts`, `contract/support/redemptions.ts`, `contract/support/discounts-table.ts`
and `contract/support/app.ts`, `packages/sut/cucumber.js`, and the exported declarations of
`packages/types/request-rejection.ts`, `packages/types/discounts.ts`, `packages/types/rest-api-refusals.ts`,
`packages/frontend/src/discounts/texts.ts`, `packages/frontend/src/discounts/till-answers.ts`,
`packages/frontend/src/stores/till-store.ts` (the names it returns), and, under
`packages/backend/src/discounts/`, `application/discount-service.ts`, `application/discount-changes.ts`,
`application/domain/coupon-token.ts`, `application/domain/discount-repository.ts`,
`application/domain/no-such-discount-exception.ts`, `application/domain/coupon-already-used-exception.ts`,
`application/domain/coupon-not-for-this-store-exception.ts`, `infra/missing-discount.ts` and
`infra/redemptions.controller.ts`, with the file list of `packages/backend/src/discounts/**`. No implementation
body was read.

## Outlined

22 new `it.todo` lines: 21 are built in this slice, 1 is recorded for later and stays `it.todo` (*Recorded for
later*). The slice also builds 2 lines recorded with "Stephanie redeems a coupon": 23 built. One spec file is
new; lines for six existing spec files are added inside each file's top-level `describe`, in groups of their
own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — no token read from a code of nine characters; of eleven | a token is ten characters (settled) | edge-case-discovery (boundary) | `unit/backend/discounts/application/domain/coupon-token/read.spec.ts` (added; `CouponToken.read`) |
| 2 — no token read from a code with a U; with a symbol, an accented letter or an emoji | a token is Crockford base32, with no I, L, O or U (settled; I, L and O are read as digits) | edge-case-discovery (type); adversarial-testing (A1 encoding) | same file |
| 3 — reports that no coupon has the code; reports a code that cannot be a coupon's the same way; keeps nothing and announces nothing | the scenario; a target not found raises no domain event | edge-case-discovery | `unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` (added; `redeemCoupon(code, store)`, arranged with `atTheSpicesStore`) |
| 3 — 404 with a body matching the error schema for a well-formed code nobody issued; every discount and coupon as it was; nothing on the wired app's emitter | the scenario; invariant 2; the 404 joins "should answer every error with a body matching the error schema" in `post-redemptions.spec.ts` in the unit that adds it (`bodiesNotMatchingTheErrorSchema`) | api-testing (exception family, event) | `contract/discounts/post-redemptions-of-a-code-nobody-issued.spec.ts` (new, beside `post-redemptions-already-used.spec.ts` and `post-redemptions-at-another-store.spec.ts`; `post-redemptions.spec.ts` is at 167 lines) |
| 1 — 400 naming the code when it is empty or only blank space | blank text counts as missing (settled); the code missing or not text already answers 400 naming it | edge-case-discovery (empty) | same file (`theFieldsNamedBy`) |
| 1 — a code written as SQL answered as a code nobody issued, everything kept as it was | the code is free text from anyone | adversarial-testing (A2) | same file |
| 1 — 404 for a code one character away from an issued coupon's, that coupon unused | a guessed code finds nothing, never another coupon | adversarial-testing (A3 guessing) | same file |
| 3 — holds that the coupon is not valid; does not hold it as already used; no longer holds it as not valid once the next coupon is redeemed | the page reaches the redemption through the till's store, which holds one answer of `discounts/till-answers.ts`; the same three lines each refusal before it has | edge-case-discovery (state) | `unit/frontend/stores/till-store/redeem-coupon.spec.ts` (added) |
| 2 — tells Stephanie the coupon is not valid; does not say the discount applies | the scenario ("Stephanie is told it is not valid"); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` (added) |
| 1 — requires the coupon's code to be typed before the coupon is redeemed | until the till tells Stephanie to type the code, the code is a required field of the form (settled) | edge-case-discovery (empty) | `unit/frontend/discounts/components/redeem-coupon-form/render.spec.ts` (added) |
| 2 — a 404 rejected with an exception of its own; an answer other than 404 not rejected as not found | the till tells a code nobody issued by its status alone (settled), as it tells a 422 | edge-case-discovery (type) | `contract/types/rest-api/fetch-rest-api.spec.ts` (added) |

Lines recorded with "Stephanie redeems a coupon" and built here:

| Line | Spec file (under `packages/sut/`) |
|---|---|
| a code of 10 000 characters answered as for a coupon nobody issued, never a 500 | `contract/discounts/post-redemptions.spec.ts:129` |
| the same answer to a malformed code and to a well-formed one nobody issued | the same file, `:141` |

`post-redemptions.spec.ts` is at 167 lines; each of these two moves, when it is filled, into
`post-redemptions-of-a-code-nobody-issued.spec.ts`, under the group of its name (A1 input boundary, A3 handle
guessing).

The till's message is `This coupon is not valid.`, in `discountTexts` (settled), told by an answer of its own
in `discounts/till-answers.ts` beside `CouponAlreadyUsed` and `CouponNotForThisStore`; the 404 joins the
error-schema line, and no domain event is raised (settled).

The till's store tells the refusals apart by the refusal `FetchRestApi` throws, as it does a 422 with
`UnprocessableContentException`; a 404 gets a refusal of its own in `@app/types/rest-api-refusals`, outlined
beside the 422 lines.

The step definitions: "Given Stephanie is taking a coupon at the till" opens the till with a store picked,
which has published a discount so that the till offers it (the till's store list exists, so nothing is faked
for the Given); "When the coupon was never issued" types a well-formed code no coupon has and redeems it;
"Then Stephanie is told it is not valid" checks the till's answer. The code, the captions and the till's
address live in the page driver, not in the steps.

Expected lengths, as outlines today and once filled at the length of the lines beside them:
`stephanie-takes-the-coupon-at-the-till.feature` 157;
`unit/backend/discounts/application/domain/coupon-token/read.spec.ts` 69, about 80 filled;
`unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` 117, about 140;
`unit/frontend/stores/till-store/redeem-coupon.spec.ts` 121, about 145;
`unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` 146, about 160;
`unit/frontend/discounts/components/redeem-coupon-form/render.spec.ts` 61, about 65;
`contract/discounts/post-redemptions-of-a-code-nobody-issued.spec.ts` 21, about 110 with the two lines moved
in; `contract/types/rest-api/fetch-rest-api.spec.ts` 152, about 170. None passes 200 lines.

Whether the scenario passes as soon as its steps exist: no. Until this slice a code nobody issued is answered
409, and the till tells Stephanie the coupon has already been used, so the scenario fails on its Then.

The `@todo` scenarios "A code one character away from Sue's is not valid" and "Stephanie takes a code that
cannot be a coupon's", in the feature, are the acceptance-level record of lines built above.

## Recorded for later

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — Stephanie told to type the coupon's code when she redeems with none typed, nothing redeemed | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` | `@todo` "Stephanie redeems with no code typed"; open, the proposal beside it: she is told to type the code, and nothing is redeemed; until then the code is a required field of the form (settled) |

Throttling code after code stays recorded with "Stephanie redeems a coupon" (`post-redemptions.spec.ts:142`).

## Out of scope

- A code nobody issued at any store: with no discount there is no store to compare; it is not valid wherever it
  is tried.
- A code typed with letters read as digits (O, I, L), in lower case or in two groups: read as its token before
  the lookup, pinned by the reading's lines; a code that reads as nobody's token after that is the scenario.
- Telling "not valid" apart from "already used" and "not for her store": the scenarios ask for each; a used or
  refused code buys nothing more than its holder already had.
- A domain event for a code nobody issued: no rule of the aggregate runs on a target not found; it is
  operational telemetry, which no criterion asks for.
- A property over every string that is not a token: the boundary and alphabet lines cover each partition the
  reading has.
- A failure that is no refusal at all (the database down) while redeeming: the 404 takes a code nobody issued
  out of the 409; what such a failure answers is the recorded line "should answer 503 with a body matching the
  error schema when the coupon cannot be checked" (`post-redemptions.spec.ts:161`), not this slice.
- A4 concurrency: a code nobody issued changes nothing (n/a). A5: the transport limit is application-wide and
  pinned by `POST /discounts` (n/a). A6: guessing is the A3 line; replaying a code nobody issued gets the same
  answer each time.
- Time: no rule of this slice depends on a date or a clock (n/a).
- The controller: thin, pinned by the contract lines only.
- Migration slots: nothing new is kept (n/a).

## Invariants assumed

1. Every rule emits an event: no rule decides here; a target not found raises no domain event.
2. One exception family → one status: a code nobody issued, or one that cannot be a coupon's → 404; the code
   empty or only blank space → 400 naming it, the malformed-request family; 409 stays the coupon already used
   only, 422 the coupon not for this store.
3. Combinations: a code's length × its alphabet; malformed × well-formed nobody's; one character away from an
   issued code. Other conditions give no distinct outcome here.
4. Round-trip: the existing lines; a code nobody issued changes nothing kept.
5. Schemas no stricter than the domain: the request schema keeps the code as any text; the reading decides
   what can be a token.
6. One line per element the view shows or asks for: the message that the coupon is not valid; the code required.
7. New names, none declared yet: the not-found refusal for a code (or `NoSuchDiscountException` reused, its
   404 through `infra/missing-discount.ts`); `CouponToken.read`'s refusal of a code that cannot be a token; the
   till's answer that the coupon is not valid in `discounts/till-answers.ts`; the caption in `discountTexts`;
   the refusal `FetchRestApi` throws for a 404. A different name moves its line; the lines stay.
8. No identity: a code tried records no one and no time.

## Dependencies

None new.
