# Slice 8: Stephanie redeems a coupon — red-test outline

The acceptance criterion is the scenario "Stephanie redeems a coupon" of story 2 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rules: a coupon is single-use, identified by
its token alone, with no expiry, linked to no one, and redeemed only at the store whose discount it is for;
anyone can act for any store. Its text, and the cases it leaves implicit, are in
`packages/sut/acceptance/features/stephanie-takes-the-coupon-at-the-till.feature`, the feature of story 2 (new):
the scenario carries `@wip` while it is red; each case it leaves implicit is a `@todo` scenario with its steps
written and no step definitions, and is also an `it.todo` line below. The story's other scenarios ("A coupon
counts only once", "A coupon for another store's discount", "A coupon nobody issued", "A coupon for a discount
that has ended") are not in the file yet.

Files read: `AGENTS.md`, `.plans/stephanie-comeback-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-3-mike-raises-a-discount.md`,
`.plans/qa/_COMPLETE_slice-4-stephanie-tells-people-what-is-new-about-her-produce.md`,
`.plans/qa/_COMPLETE_slice-5-mike-lowers-a-discount.md`, `.plans/qa/slice-7-sue-decides-to-try-stephanies-produce.md`
with its outline and its scenarios, the feature of story 1, `packages/sut/cucumber.js`, the step patterns under
`packages/sut/acceptance/features/steps/`, the method names of `acceptance/support/discounts-page.ts` and
`acceptance/support/playwright-world.ts`, the exports of `packages/sut/support/example-discounts.ts`, the
`describe` and `it` names and the length of the specs this outline adds to, and the exported declarations of
`packages/backend/src/discounts/application/**`, `packages/backend/src/discounts/infra/{discounts.controller,schema}.ts`,
`packages/types/{discounts,rest-api}.ts`, `packages/frontend/src/stores/discounts-store.ts`,
`packages/frontend/src/discounts/texts.ts`, `packages/frontend/src/router/routes-discounts.ts` and the props of
`packages/frontend/src/discounts/components/*.vue`. No implementation body was read.

## Outlined

69 `it.todo` lines: 58 are built in this slice (the table below); 11 are recorded for later and stay `it.todo`
(*Recorded for later*). Twelve spec files are new; lines for three existing spec files are added inside each
file's top-level `describe`, in groups of their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 3 — counts as used once redeemed; raises `CouponRedeemed` with its discount's id and its token, asserted on a double of the event-publisher port; unused from its issue until redeemed | the scenario; single use is the coupon's own rule, so `Coupon` is an entity inside the aggregate from here (*Invariants assumed* 8); *Design rules* 4 (the event raised inside the entity that owns the rule) | edge-case-discovery (state) | `unit/backend/discounts/application/domain/coupon/redeem.spec.ts` (new) |
| 2 — redeems its coupon with the token given; leaves its other coupons unused | the scenario; coupons are reached only through `Discount` | edge-case-discovery (combination: one coupon of several) | `unit/backend/discounts/application/domain/discount/redeem-coupon.spec.ts` (new) |
| 7 — a code read as its token when typed as drawn, in lower case, in two groups with a space or a hyphen, with spaces around it; O read as zero; I and L read as one; lower-case o, i and l together | normalising a typed code is built here, at unit level, in the token's own reading of a typed code, each form an example (settled) | edge-case-discovery (type, combination) | `unit/backend/discounts/application/domain/coupon-token/read.spec.ts` (new) |
| 1 — any drawn token read back from the way the page shows it, in upper or lower case | the page shows the token in two groups of five; the till reads what it shows | property-based-testing (round-trip) | same file |
| 1 — rebuilds each kept coupon redeemed or unused, as kept | loading a discount with a redeemed coupon | database-testing (the load side of the round-trip) | `unit/backend/discounts/application/domain/discount-factory/reconstitute.spec.ts` (added) |
| 4 — keeps the discount that owns the coupon with it redeemed; announces `CouponRedeemed` once kept; answers with the discount's item; redeems from a code typed in lower case, in two groups | the scenario; "the discount applies" shows the discount's item, never a rate (settled); redeeming loads the Discount that owns the token through the Discount repository (settled) | edge-case-discovery (combination: the reading × the lookup) | `unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` (new) |
| 4 — finds the discount that owns the token among several with coupons; loads it with every coupon; nothing for a token no coupon has; nothing for a token with quotes, semicolons and SQL keywords, everything kept left as it was | the repository reads one discount by a coupon's token; the aggregate is loaded whole, so saving it back drops no coupon | database-testing (query); adversarial-testing (A2) | `contract/discounts/discount-by-coupon-token-in-postgres.spec.ts` (new) |
| 3 — a discount with a redeemed coupon saved and loaded back equal; its other coupons kept unused when one is redeemed and it is saved again; a redeemed coupon kept redeemed when another is issued and it is saved again | invariant 4; coupons persisted with their discount (*Design rules* 1–2) | database-testing (round-trip); edge-case-discovery (state) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |
| 1 — every constraint on a redemption traced to a rule of `Discount`, with no time and no one kept | invariant 5; nothing records when or by whom a coupon was redeemed | database-testing (constraint) | `contract/discounts/discount-constraints-in-postgres.spec.ts` (added) |
| 4 — Forward; Backward, lossy (every use is lost); Preservation (a coupon issued before reads back unused); Compatibility (the deployed version's round-trip of a discount with coupons on the migrated schema) | a coupon's use is new state, so a new migration; a lossy down is acceptable, its loss named in the Backward line, the down file's first comment line and here (settled) | database-testing (migration slots) | `contract/discounts/coupon-redemption-migration.spec.ts` (new) |
| 5 — 201 with the discount's item; body matching the redemption response schema; `CouponRedeemed` on the wired app's emitter; the coupon kept redeemed, the discount's other coupons unused; a code sent in lower case, in two groups, redeemed | the scenario; a redemption answers 201 with the item (settled) | api-testing (success, event, lifecycle) | `contract/discounts/post-redemptions.spec.ts` (new) |
| 2 — request schema no stricter than any text for a code and a store's name and address; response schema no stricter than a discount's item | invariant 5 | api-testing (strictness) | same file |
| 4 — 400 naming the code when missing or not text, never a 500; 400 for a non-object body; 400 for invalid JSON; every error body matches the error schema | client input is never answered with a 500 (settled); the malformed-request 400 as built for a change of rate | api-testing (malformed request); adversarial-testing (A1, A5) | same file |
| 1 — the answer carries no coupon token, its own or another's | the token is all a coupon is, so whoever learns one can use it | adversarial-testing (A3) | same file |
| 3 — lists a store once when it has more than one discount; a store with the same name at another address as another; no store when nothing is published | the till says its store by picking a pair of name and address taken from the published discounts, derived in the page, with no stores endpoint (settled) | edge-case-discovery (combination, empty) | `unit/frontend/stores/discounts-store/stores.spec.ts` (new) |
| 2 — hands the code as typed and the store picked over; holds what the redemption answers | the page reaches the redemption through the store; the till sends the store it picked (settled) | edge-case-discovery | `unit/frontend/stores/discounts-store/redeem-coupon.spec.ts` (new) |
| 5 — asks for the store under its caption; requires a store to be picked; offers each store as its name and address; asks for the code under its caption; offers to redeem under its caption | invariant 6; the captions `Your store`, `Coupon code` and `Redeem` in `discountTexts`, each store shown as "name, address" (settled); the store is a required field of the form until the store decides an outcome (settled) | edge-case-discovery | `unit/frontend/discounts/components/redeem-coupon-form/render.spec.ts` (new) |
| 4 — redeems the code as typed at the store picked; says the discount applies; names the discount's item; says nothing applies before a coupon is redeemed | the scenario ("When Sue uses it at Stephanie's store", "Then Stephanie is told the discount applies"); `The discount applies to` followed by the item, no rate (settled); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` (new) |
| 2 — loads the published discounts when the till opens, to offer their stores; offers the form to redeem a coupon | the till is a page of its own, `/till`, its route in a `routes-*` module (settled) | edge-case-discovery | `unit/frontend/discounts/views/till-view/render.spec.ts` (new) |

`POST /redemptions`, with `{ code, storeName, storeAddress }`, answers 201 with `{ item }`, the item of the
discount the coupon is for (settled). The store is sent and typed with the request, but nothing compares it with the
coupon's discount in this slice: the exact comparison of the pair, its test and its code arrive with "A coupon
for another store's discount", its first observable outcome, and the use case takes the code alone until then
(settled). No parameter is kept unused for the store meanwhile.

The step definitions: "Given Sue has a coupon for Stephanie's discount" publishes Stephanie's produce discount
through the page and gets Sue a coupon through it, as "Sue decides to try Stephanie's produce" does, keeping the
code Sue's page shows; "When Sue uses it at Stephanie's store" opens the till in a browser context of its own,
picks Stephanie's store by its name and address and types the code as Sue's page shows it, in two groups;
"Then Stephanie is told the discount applies" checks, on the till, that the discount applies and names the item
of Stephanie's discount. The till's address, the captions and the example values live in the page driver, not
in the steps.

Known gaps until the later scenarios of the story land: a coupon used a second time is told the discount
applies again ("A coupon counts only once"); a coupon is taken at any store ("A coupon for another store's
discount"); a code nobody issued, or one that cannot be a coupon's, answers whatever the code does, a 500
included ("A coupon nobody issued").

## Recorded for later

11 lines stay `it.todo`, each with its `@todo` scenario.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — the coupon could not be checked when its discount cannot be loaded or kept, the coupon staying unused | `unit/backend/discounts/application/discount-service/redeem-coupon.spec.ts` | `@todo` "The coupon cannot be checked right now"; settled: one line, could not check the coupon, try again, the coupon staying unused; recorded |
| 1 — 503 with the error schema when the coupon cannot be checked, the coupon unused | `contract/discounts/post-redemptions.spec.ts` | the same `@todo` scenario; 503 is a placeholder, fixed with the exception family |
| 1 — the store holds that the coupon could not be checked | `unit/frontend/stores/discounts-store/redeem-coupon.spec.ts` | the same `@todo` scenario |
| 1 — Stephanie told the coupon could not be checked and to try again | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` | the same `@todo` scenario |
| 1 — a code of 10 000 characters answered as for a coupon nobody issued, never a 500 | `contract/discounts/post-redemptions.spec.ts` | `@todo` "Stephanie takes a code that cannot be a coupon's"; built with "A coupon nobody issued" |
| 1 — the same answer to a malformed code and to a well-formed one nobody issued | the same file | the same `@todo` scenario; built with "A coupon nobody issued" |
| 1 — codes tried from one source throttled | the same file | `@todo` "Someone tries code after code at the till"; an open risk, listed with the throttling of publishing and of getting coupons |
| 1 — a coupon redeemed once when used twice at the same moment | the same file | `@todo` "Sue's coupon is used at two tills at the same moment"; built with "A coupon counts only once", the first refusal of a second use; the stress is tuned until the red is reliable |
| 1 — the answer carries the rate the coupon applies at | the same file | `@todo` "Stephanie is told the rate the coupon applies at"; open: which rate applies when the rate changes after the coupon was got |
| 1 — the till shows the rate the coupon applies at | `unit/frontend/discounts/components/redeem-coupon-form/redeem.spec.ts` | the same `@todo` scenario |
| 1 — Stephanie told to say which store she is at when none is picked, nothing redeemed | the same file | `@todo` "Stephanie does not say which store she is at"; settled: she is told to say which store she is at and the coupon stays unused, built with "A coupon for another store's discount", the first scenario where the store decides; until then the store is a required field of the form |

The `@todo` scenarios "Stephanie types the code the way she reads it", "Another coupon for the same discount
still applies", "Stephanie finds her store once at the till" and "A store with the same name at another address
is another store" are the acceptance-level record of lines built above.

## Out of scope

- A second use refused, a coupon refused at another store, a code nobody issued, a coupon of an ended discount:
  owned by "A coupon counts only once", "A coupon for another store's discount", "A coupon nobody issued" and
  "A coupon for a discount that has ended". Their rejected events are raised by those slices, each in the entity
  that owns its rule.
- The count's side of a redemption: owned by the counting scenarios; the stored redemption is what the count
  reads.
- The store missing or malformed in the request (a 400 naming it): arrives with the comparison of the store.
- When and by whom a coupon was redeemed: nothing records either; there is no identity, and the count does not
  care when.
- Which rate applies at the till: an open question for the people at the till; no rate is shown or answered
  meanwhile (recorded above).
- Normalising a code at acceptance level beyond the one `@todo` scenario: the unit lines carry the examples
  (settled).
- A code typed with a letter outside Crockford base32 (U, a symbol) or of another length: a code that cannot be
  a coupon's, owned by "A coupon nobody issued".
- Clearing the code once a coupon is redeemed, keeping the store picked between coupons, picking the store for
  Stephanie when only one is offered: plausible conveniences no persona asked for; if added, each is its own
  line, written first.
- A link from the discounts page to the till: no persona asked for one; the till's address is pinned by the
  acceptance scenario.
- What Sue's page shows once her coupon is used: no scenario reads it.
- An index for the token lookup: the unique constraint on the token already gives one.
- A1 input boundary beyond the recorded 10 000-character line: the code is the only free input acted on; the
  store's name and address are not read in this slice (n/a).
- A3 inverted: no accounts; the guessing, enumeration and throttling lines above replace the authorisation lines.
- A5 oversized body: the transport limit is application-wide and pinned by `POST /discounts`.
- A6 business-logic abuse: replaying a redemption, cheating the store and using an ended discount's coupon are
  the later scenarios above; anyone may act for any store (settled).
- Time: no rule of this slice depends on a date or a clock; a coupon has no expiry (n/a).
- The controller and the route wiring: thin, pinned by the contract lines and the scenario only.
- Styling of the till: its own commits, no test.

## Invariants assumed

1. Every rule emits an event: an accepted redemption raises `CouponRedeemed`, carrying the discount's id and
   the token, inside `Coupon`, published through the event-publisher port once the discount is kept. Its
   refusals arrive with the later scenarios; "could not be checked" is recorded.
2. One exception family → one status: a malformed redemption request → 400 naming the code; cannot be checked
   → placeholder 503 (recorded); a code nobody issued → owned by "A coupon nobody issued".
3. Combinations: one coupon of several on a discount × a redemption; a redeemed coupon × another issued and
   saved; a typed form × the lookup; a store with several discounts and two stores sharing a name, on the
   till's list. Other conditions give no distinct outcome here.
4. Round-trip: a discount with a redeemed and an unused coupon, saved and loaded back.
5. Schemas no stricter than the domain: the request and response schemas' lines; the redemption's constraints
   traced to a rule.
6. One line per element the view shows or asks for: the store, the code and the action on the till; that the
   discount applies, and its item, once redeemed.
7. The token is kept as its ten drawn characters, upper case, with no separator; reading a typed code turns it
   into that form before any lookup.
8. One aggregate: coupons are reached only through `Discount` and persisted with it; no coupon repository, no
   coupon port; redeeming loads the Discount that owns the token through the Discount repository, which speaks
   domain types only. Single use is the first rule a coupon owns, so the coupons the root handled until now
   become `Coupon` entities inside the aggregate with this slice, holding their token and whether they are used.
   Whether the use is a column of the coupons table or a table of its own is a choice for domain reasons; both
   lose the same thing on the way down.
9. New names, none declared yet: `Coupon` and its redeeming, `CouponRedeemed`, `Discount`'s redeeming of one of
   its coupons, `CouponToken`'s reading of a typed code, `DiscountService`'s redeeming, the Discount
   repository's read by a coupon's token, `POST /redemptions` with its request and response schemas in
   `@app/types`, the migration that lets a coupon be redeemed, the store's list of stores and its redeeming,
   `RedeemCouponForm`, `TillView` at `/till` in a `routes-*` module, and their captions in `discountTexts`. A different name
   moves its spec; the lines stay.
10. Wire types appear only in the controller layer.
11. No identity: a redemption records no one and no time.

## Dependencies

None new: the property line uses `fast-check`, already a dependency of `packages/sut`.
