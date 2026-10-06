# Slice 7: Sue decides to try Stephanie's produce — red-test outline

The acceptance criterion is the scenario "Sue decides to try Stephanie's produce" of story 1 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rules: a coupon exists to make a discounted
sale countable; it is single-use, identified by its token alone, with no expiry, linked to no one, and
redeemed only at the store whose discount it is for. Its text, and the cases it leaves implicit, are appended
to `packages/sut/acceptance/features/stephanie-gets-her-produce-discount-into-peoples-hands.feature`: the
scenario carries `@wip` while it is red; each case it leaves implicit is a `@todo` scenario with its steps
written and no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/stephanie-comeback-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`, the
feature of story 1, the step patterns under `packages/sut/acceptance/features/steps/`, the `describe` and `it`
names and the length of every spec under `packages/sut/unit` and `packages/sut/contract`, the migration
directory's file names, and the exported declarations of `packages/backend/src/discounts/application/**`. No
implementation body was read.

## Outlined

48 `it.todo` lines: 36 are built in this slice (the table below); 12 are recorded for later and stay
`it.todo` (*Recorded for later*). Nine spec files are new; lines for six existing spec files are added
inside each file's top-level `describe`, in groups of their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — holds the coupon it issues, with the token it is given; raises `CouponIssued` with its id and the token, asserted on a double of the event-publisher port | the scenario; *Design rules* 1 (the root issues and holds its coupons) and 4 | edge-case-discovery | `unit/backend/discounts/application/domain/discount/issue-coupon.spec.ts` (new) |
| 4 — ten upper-case characters with no separator; Crockford base32 only, never I, L, O or U; no character favoured over many draws from an even source; another token from other random values | the token is the coupon's only identity (settled: 10 characters of Crockford base32, drawn from a random source the generator is given) | adversarial-testing (A3: a guessed handle); property-based-testing (no bias over many draws) | `unit/backend/discounts/application/domain/coupon-token/draw.spec.ts` (new) |
| 1 — rebuilds a kept discount with the coupons it has issued | loading a discount with coupons | database-testing (the load side of the round-trip) | `unit/backend/discounts/application/domain/discount-factory/reconstitute.spec.ts` (added) |
| 3 — keeps the discount named with its new coupon; announces `CouponIssued` once kept; answers with the token and the store it is for | the scenario ("a coupon to use at Stephanie's till": the code and the store, settled) | edge-case-discovery | `unit/backend/discounts/application/discount-service/issue-coupon.spec.ts` (new) |
| 3 — 201 with the token and the store's name; body matching the coupon response schema; `CouponIssued` on the wired app's emitter | the scenario | api-testing (success, event) | `contract/discounts/post-discounts-id-coupons.spec.ts` (new) |
| 1 — the coupon response schema no stricter than the coupon | invariant 5 | api-testing (strictness) | same file |
| 2 — a token of its own, ignoring one sent in the request; the coupon issued only, never another coupon's token | the token is all a coupon is, so whoever learns one can use it | adversarial-testing (A3) | same file |
| 1 — no coupon token listed with any discount once coupons are issued | the same | adversarial-testing (A3) | `contract/discounts/get-discounts.spec.ts` (added) |
| 2 — a discount with its coupons saved and loaded back equal; earlier coupons kept when another is issued and the discount saved again | invariant 4; coupons persisted with their discount (*Design rules* 1–2) | database-testing (round-trip); edge-case-discovery (state) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |
| 3 — two coupons with one token refused (23505); a coupon without a token (23502); a coupon of no kept discount (23503) | identified by its token alone; a coupon belongs to its discount | database-testing (constraint) | `contract/discounts/discount-constraints-in-postgres.spec.ts` (added) |
| 4 — Forward; Backward, lossy (every coupon is lost); Preservation (a discount kept before reads back with no coupon); Compatibility (the deployed version's round-trip on the migrated schema) | the coupons table is a new migration | database-testing (migration slots) | `contract/discounts/coupons-table-migration.spec.ts` (new) |
| 1 — the control to get a coupon on each entry | Sue decides to try a discount she has found; invariant 6 | edge-case-discovery | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added) |
| 2 — offers to get a coupon under its caption; names its discount in its label | invariant 6; the caption `Get a coupon` (settled); each entry's control labelled for a person and a screen reader, as the change-rate control is | edge-case-discovery | `unit/frontend/discounts/components/get-coupon-button/render.spec.ts` (new) |
| 1 — asks for a coupon for its own discount | the scenario ("When Sue decides to try it") | edge-case-discovery | `unit/frontend/discounts/components/get-coupon-button/get.spec.ts` (new) |
| 3 — shows its code; as two groups of five characters; the store it is for under its caption | the scenario; `Your coupon, to use at` and the store name above the code in two groups of five (settled) | edge-case-discovery; invariant 6 | `unit/frontend/discounts/components/issued-coupon/render.spec.ts` (new) |
| 1 — the coupon shown once Sue decides | right after she decides, the page shows the coupon (settled) | edge-case-discovery | `unit/frontend/discounts/views/discounts-view/render.spec.ts` (added) |
| 2 — hands the discount over to get a coupon; holds the coupon once issued | the page reaches the coupon through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/get-coupon.spec.ts` (new) |

`POST /discounts/:id/coupons`, with no body, answers 201 with the coupon's token and its store's name. No
coupon is read back by its token in this slice: "Stephanie redeems a coupon" loads the Discount that owns the
token through the Discount repository (settled).

The step definitions: "Given Sue has found Stephanie's discount on produce" publishes Stephanie's produce
discount through the page, as "Stephanie has published a discount on produce" does, and Sue opens the page and
finds its entry; "When Sue decides to try it" uses the control on that entry; "Then she gets a coupon to use at
Stephanie's till" checks, on Sue's page, a code of ten Crockford base32 characters in two groups of five and
Stephanie's store name beside it.

The token generator is given its random source: the unit lines use a fake source; that production draws from
`crypto.getRandomValues` is a wiring choice the composition root shows, not something a test proves (settled).

## Recorded for later

12 lines stay `it.todo`, each with its `@todo` scenario.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — a second coupon with a token of its own when tried twice, both held | `unit/backend/discounts/application/domain/discount/issue-coupon.spec.ts` | `@todo` "Sue decides to try the same discount twice"; settled: two decisions give two coupons, a fresh token on every issue already giving it |
| 1 — two coupons, each with a token of its own, for two requests | `contract/discounts/post-discounts-id-coupons.spec.ts` | the same `@todo` scenario |
| 1 — one coupon when the same request arrives twice | the same file | `@todo` "Sue's decision to try a discount arrives twice"; settled: one decision arriving twice gives one coupon, recorded only |
| 1 — asks once when Sue decides twice before the first answer | `unit/frontend/discounts/components/get-coupon-button/get.spec.ts` | the same `@todo` scenario |
| 1 — no such discount reported, nothing issued | `unit/backend/discounts/application/discount-service/issue-coupon.spec.ts` | `@todo` "A coupon is asked for a discount that does not exist"; a not-found family, as for a change of rate |
| 1 — 404 for an id no discount has, issuing no coupon | `contract/discounts/post-discounts-id-coupons.spec.ts` | the same `@todo` scenario |
| 1 — the coupon could not be got when it cannot be kept, nothing issued | `unit/backend/discounts/application/discount-service/issue-coupon.spec.ts` | `@todo` "Sue cannot get a coupon right now"; settled: one line, could not get a coupon, try again |
| 1 — 503 with the error schema when the coupon cannot be kept, none issued | `contract/discounts/post-discounts-id-coupons.spec.ts` | the same `@todo` scenario; 503 is a placeholder, fixed with the exception family |
| 1 — the store holds that a coupon could not be got | `unit/frontend/stores/discounts-store/get-coupon.spec.ts` | the same `@todo` scenario |
| 1 — coupons asked from one source throttled | `contract/discounts/post-discounts-id-coupons.spec.ts` | `@todo` "Someone takes coupons far faster than anyone would"; settled: not now, an open risk |
| 1 — the address of its store and the item it is for shown with the coupon | `unit/frontend/discounts/components/issued-coupon/render.spec.ts` | `@todo` "Sue's coupon says where to use it and what it is for"; settled: recorded, the coupon built in its sparsest form |
| 1 — the coupon kept when the page is opened again | `unit/frontend/stores/discounts-store/get-coupon.spec.ts` | `@todo` "Sue still has her coupon when she comes back to the page"; open: how Sue brings the coupon to the till |

The `@todo` scenario "Nobody else sees Sue's coupon" is the acceptance-level record of the A3 lines built above.

A known gap among the cases that must never answer with a 500: until the 404 line is built, a coupon asked for
an id no discount has answers whatever the code does. Every error family these lines add joins the existing
"every error body matches the error schema" check in the unit that adds it.

## Out of scope

- Redeeming a coupon, single use and the store it is redeemed at: owned by "Stephanie redeems a coupon" and the
  later coupon scenarios; finding a coupon by its token arrives with the first.
- Normalising a typed token (case, O read as 0, I and L as 1, the separator): recorded until a coupon is typed
  in, at redemption.
- Which rate applies at the till when the rate changes after a coupon is got: an open question for the
  people at the till; no rate is copied onto the coupon.
- A coupon for a discount that has ended: owned by "Stephanie ends her discount" and "A coupon for a discount
  that has ended".
- Expiry: no persona asked for one.
- Who got a coupon, and when: nothing records either; there is no identity, and Rodrigo does not care when.
- Printing, a QR code or sending the coupon: not asked for; the page shows the code.
- A short line telling Sue to keep the coupon and show it at the till: optional copy; if added, its line is
  `should tell Sue to keep the coupon and show it at the till`, written first.
- Unlimited coupons on a discount at 100 %: an open risk, not a rule.
- Two drawn tokens colliding: about 50 bits make it unlikely at this scale, and the unique constraint refuses
  the second rather than issuing a duplicate.
- Enumerating or guessing tokens at the till: owned by "A coupon nobody issued".
- A request body: the route reads none; a token sent in it is ignored (line above).
- A1 input boundary and A2 injection: the only input is the discount's id in the path, read through the
  repository's parameters, as for a change of rate (n/a).
- Time: no rule of this slice depends on a date or a clock (n/a).
- A `Coupon` entity: coupons bring no domain logic of their own in this slice, so the root handles them
  (*Invariants assumed* 8).
- The controller: thin, pinned by the contract lines only.
- Styling of the control and the coupon: their own commits, no test.

## Invariants assumed

1. Every rule emits an event: issuing a coupon raises `CouponIssued` inside `Discount`; its refusals (no such
   discount, cannot be kept) are recorded for later.
2. One exception family → one status: no such discount → 404 (recorded); cannot be kept → placeholder 503
   (recorded).
3. Combinations: a discount with earlier coupons × another issued; two coupons × one token. Other conditions
   give no distinct outcome here.
4. Round-trip: a discount with its coupons, saved and loaded back.
5. Schemas no stricter than the domain: the coupon response schema's line; the table's constraints each trace
   to a rule above.
6. One line per element the view shows or asks for: the control to get a coupon; the code, its grouping and
   the store on the coupon shown.
7. The token is kept as its ten drawn characters, upper case, with no separator; two groups of five is how the page shows it.
8. One aggregate: coupons are reached only through `Discount` and persisted with it, in a coupons table written
   and read only as part of a Discount; no coupon repository and no coupon port; no `Coupon` entity while
   coupons carry no domain logic. The token generator is a domain value, not an entity.
9. New names, none declared yet: `Discount`'s issuing of a coupon, `CouponIssued`, `CouponToken`,
   `DiscountService`'s issuing, `POST /discounts/:id/coupons` and its response schema in `@app/types`, the
   coupons table and its migration, `GetCouponButton`, `IssuedCoupon`, the store's getting of a coupon, and
   their captions in `discountTexts` (`Get a coupon`, `Your coupon, to use at`). A different name moves its spec; the lines stay.
10. Wire types appear only in the controller layer; the repository speaks domain types only.
11. No identity: a coupon is linked to no one, and nothing records who got it.

## Dependencies

None new: the random source is the platform's `crypto.getRandomValues`.
