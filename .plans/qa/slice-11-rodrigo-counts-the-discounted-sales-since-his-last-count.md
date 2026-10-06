# Slice 11: Rodrigo counts the discounted sales since his last count — red-test outline

The acceptance criterion is the scenario "Rodrigo counts the discounted sales since his last count" of story 1
in `.plans/rodrigo-counts-epic.md`, read together with the epic's rules: the count is per discount; a count
covers everything since the last count and restarts for all of the store's discounts, each discount's restart
kept on its own, the store's discounts becoming consistent eventually, not at once; when or by whom a coupon
was redeemed is not counted; anyone can act for any store. Its text, and the cases it leaves implicit, are in
`packages/sut/acceptance/features/rodrigo-counts-the-discounted-sales.feature`, the feature of story 1 (new):
the scenario carries `@wip` while it is red; each case it leaves implicit is a `@todo` scenario with its steps
written and no step definitions, and is also an `it.todo` line below. The story's other scenarios ("A new
count starts from nothing", "Each discount is counted on its own") are not in the file yet.

Files read: `AGENTS.md`, `.plans/rodrigo-counts-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-4-stephanie-tells-people-what-is-new-about-her-produce.md`,
`.plans/qa/_IN_PROGRESS_slice-7-sue-decides-to-try-stephanies-produce.md`, the outline and the scenarios of
"Stephanie redeems a coupon", `packages/sut/cucumber.js`, the first lines and the scenario names and tags of
every feature file, the step patterns under `packages/sut/acceptance/features/steps/`, the exports of
`packages/sut/support/example-discounts.ts`, the `describe` and `it` names and the length of the specs this
outline adds to, and the exported declarations of `packages/backend/src/discounts/application/**`,
`packages/backend/src/discounts/infra/discounts.controller.ts`, `packages/types/{discounts,rest-api}.ts`,
`packages/frontend/src/stores/discounts-store.ts`, `packages/frontend/src/discounts/texts.ts` and
`packages/frontend/src/router/routes-discounts.ts`. No implementation body was read.

## Outlined

59 `it.todo` lines: 46 are built in this slice (the table below); 13 are recorded for later and stay `it.todo`
(*Recorded for later*). Nine spec files are new; lines for three existing spec files are added inside each
file's top-level `describe`, in groups of their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — counts three sales when three of its coupons were redeemed since its last count; raises `DiscountedSalesCounted` with its id and the number counted, asserted on a double of the event-publisher port | the scenario; the count is per discount, so `Discount` owns it; *Design rules* 4 | edge-case-discovery | `unit/backend/discounts/application/domain/discount/count.spec.ts` (new) |
| 3 — leaves out the coupons redeemed before its last count; counts a coupon issued before its last count and redeemed after it; does not count a coupon issued and not yet redeemed | "since his last count": the restart is what the scenario's Given makes observable; a coupon's three states (unused, redeemed since, redeemed and counted) | edge-case-discovery (state) | same file |
| 1 — counts every coupon redeemed since it was published when it has never been counted | the count with no last count | edge-case-discovery (boundary) | same file |
| 1 — rebuilds each kept redeemed coupon counted or not yet counted | loading a discount with counted sales | database-testing (the load side of the round-trip) | `unit/backend/discounts/application/domain/discount-factory/reconstitute.spec.ts` (added) |
| 3 — keeps the store's discount with its sales counted; announces `DiscountedSalesCounted` once kept; answers with the discount's id, item and rate and the number counted | the scenario; the store's discounts are loaded through the Discount repository | edge-case-discovery | `unit/backend/discounts/application/discount-service/count.spec.ts` (new) |
| 4 — finds the kept discounts of a store by its name and address, leaving out another store's; leaves out a store with the same name at another address; loads each with every one of its coupons; nothing for a pair no discount has | the count is of one store; a store is a pair of name and address (settled with the till) | database-testing (query) | `contract/discounts/discounts-of-a-store-in-postgres.spec.ts` (new) |
| 1 — nothing for a store name and address with quotes, semicolons and SQL keywords, everything kept left as it was | the pair is free text from anyone and reaches a query | adversarial-testing (A2) | same file |
| 2 — a discount with a counted and an uncounted redeemed coupon saved and loaded back equal; a counted coupon kept counted when another is redeemed and the discount saved again | invariant 4; the counted state is the aggregate's, persisted with it | database-testing (round-trip); edge-case-discovery (state) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |
| 1 — every constraint on counting traced to a rule of `Discount`, with no time and no one kept | invariant 5; nothing records when or by whom | database-testing (constraint) | `contract/discounts/discount-constraints-in-postgres.spec.ts` (added) |
| 4 — Forward; Backward, lossy (every count is lost, so the sales counted before count again); Preservation (coupons redeemed before the migration count in the first count after it, settled); Compatibility | what has been counted is new state, so a new migration | database-testing (migration slots) | `contract/discounts/coupon-count-migration.spec.ts` (new) |
| 4 — 201 with the discount's id, item, rate and number; body matching the count response schema; `DiscountedSalesCounted` on the wired app's emitter; a count after another answers only what was redeemed since | the scenario; a count answers 201 (settled) | api-testing (success, event, lifecycle) | `contract/discounts/post-stores-counts.spec.ts` (new) |
| 2 — request schema no stricter than any text for a store's name and address; response schema no stricter than a discount's id, item, rate and a number | invariant 5 | api-testing (strictness) | same file |
| 4 — 400 naming the store's name and address when missing or not text, never a 500; 400 for a non-object body; 400 for invalid JSON; every error body matches the error schema | client input is never answered with a 500 (settled) | api-testing (malformed request); adversarial-testing (A1, A5) | same file |
| 1 — the answer carries no coupon token | the count reads coupons; a token is all a coupon is | adversarial-testing (A3) | same file |
| 2 — hands the store picked over to be counted; holds what the count answers | the page reaches the count through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/count-discounted-sales.spec.ts` (new) |
| 4 — asks for the store under its caption; requires a store; offers each store as its name and address; offers to count under its caption | the count page in its sparsest form, at `/count`, the store picked as at the till under the caption `Store`, the action under `Count discounted sales`, in `discountTexts` (settled); invariant 6 | edge-case-discovery | `unit/frontend/discounts/components/count-discounted-sales-form/render.spec.ts` (new) |
| 5 — counts the store picked; names each discount's item; shows each discount's rate; shows the number counted under its caption; shows no count before counting | the scenario ("he sees 3 discounted sales for that discount"); a discount is told apart by its item and rate as on the discounts page, its number under `Discounted sales` (settled; interim, held with Rodrigo); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/count-discounted-sales-form/count.spec.ts` (new) |
| 2 — loads the published discounts when the count opens, to offer their stores; offers the form to count | the count is a page of its own, its route in `router/routes-discounts.ts` | edge-case-discovery | `unit/frontend/discounts/views/count-view/render.spec.ts` (new) |

`POST /stores/counts`, with `{ storeName, storeAddress }`, answers 201 with one entry per discount counted:
its id, item and rate and the number of sales counted. The use case loads the store's discounts through the
Discount repository, has each count its sales, and keeps each in a save of its own (*Design rules* 1, 2, 5).

The step definitions: "Given Rodrigo has counted Stephanie's discounted sales before" publishes Stephanie's
produce discount through the page, has Sue get a coupon and use it at Stephanie's till, and counts Stephanie's
store on the count page, so that a sale redeemed before the last count exists and the restart is observed;
"And Sue has used 3 coupons for Stephanie's discount since then" gets three coupons and uses each at
Stephanie's till, as "Stephanie redeems a coupon" does; "When Rodrigo counts the discounted sales" opens the
count page, picks Stephanie's store by its name and address and counts; "Then he sees 3 discounted sales for
that discount" checks the number on the entry of Stephanie's discount, found by its item. The count page's
address, the captions and the example values live in the page driver, not in the steps.

Known gaps until later lines land: a discount with no sales since the last count answers whatever the forced
code does, unpinned (settled: no code is written for it); two counts, or a count and a redemption, at the same
moment may count a sale twice or lose it, until "A coupon counts only once"; a store nobody published at answers whatever the code does, a 500
included.

## Recorded for later

13 lines stay `it.todo`, each with its `@todo` scenario.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — no such store reported when no published discount names it, nothing counted | `unit/backend/discounts/application/discount-service/count.spec.ts` | `@todo` "Rodrigo counts a store nobody published a discount at"; settled: refused as no such store, recorded only, because the page's picker cannot name such a store |
| 1 — 404 for a store no published discount names, nothing counted | `contract/discounts/post-stores-counts.spec.ts` | the same `@todo` scenario; 404 proposed (settled) |
| 1 — a store name of 10 000 characters answered as for a store nobody published at, never a 500 | the same file | the same `@todo` scenario |
| 1 — the sales could not be counted when the store's discounts cannot be loaded, nothing restarted | `unit/backend/discounts/application/discount-service/count.spec.ts` | `@todo` "The discounted sales cannot be counted right now" |
| 1 — 503 with the error schema when the store's discounts cannot be counted, nothing restarted | `contract/discounts/post-stores-counts.spec.ts` | the same `@todo` scenario; 503 is a placeholder, fixed with the exception family (settled) |
| 1 — the store holds that the sales could not be counted | `unit/frontend/stores/discounts-store/count-discounted-sales.spec.ts` | the same `@todo` scenario |
| 1 — Rodrigo told the sales could not be counted and to try again | `unit/frontend/discounts/components/count-discounted-sales-form/count.spec.ts` | the same `@todo` scenario |
| 1 — the discounts kept before one that cannot be kept stay counted; that one's sales wait for the next count | `unit/backend/discounts/application/discount-service/count.spec.ts` | `@todo` "One of the store's discounts cannot be counted right now"; open: what Rodrigo is told when one discount's count fails after another is kept |
| 1 — each redeemed coupon counted once between two counts arriving at the same moment | `contract/discounts/post-stores-counts.spec.ts` | `@todo` "Rodrigo and Stephanie count at the same moment"; built with "A coupon counts only once": saving one discount never loses a change another request kept meanwhile, with no refusal shown for a change made since, and a change of rate stays last-write-wins (settled); the developer tunes the stress until the red is reliable |
| 1 — a coupon redeemed during a count counted once, in that count or the next | the same file | `@todo` "A coupon is used while Rodrigo counts"; the same guarantee and note |
| 1 — counts once when Rodrigo counts twice before the first count answers | `unit/frontend/discounts/components/count-discounted-sales-form/count.spec.ts` | `@todo` "Rodrigo counts twice before the first count answers"; open with Rodrigo, the proposal beside it |
| 1 — a discount with no sales since the last count shown with none counted | the same file | `@todo` "A discount nobody used a coupon for since the last count"; open with Rodrigo; showing it with none counted is the proposal, not built (settled) |
| 1 — a coupon redeemed at another store's till counted with the store of its discount | `contract/discounts/post-stores-counts.spec.ts` | `@todo` "A coupon taken at another store's till"; open with Rodrigo, the proposal beside it; no code is written for it, and it stops arising once "A coupon for another store's discount" refuses such coupons (settled) |

The `@todo` scenarios "A coupon got but not used is not a discounted sale", "A coupon got before the last count
and used after it is counted", "Another store's discounted sales wait for that store's count" and "Rodrigo's
count shows no coupon codes" are the acceptance-level record of lines built above. "Someone else counts
Stephanie's discounted sales before Rodrigo does" and "Rodrigo tells which discount each number is for" record
two of the five questions held with Rodrigo whose proposals are what the built lines already do: a count is the store's,
whoever makes it; a discount is told apart by its item and its rate.

## Out of scope

- A count with no sales since the last one ("he sees no discounted sales"): owned by "A new count starts from
  nothing", whose outline takes up the zero lines of the domain, the API and the page.
- A store with several discounts, each counted and each kept in a save of its own: owned by "Each discount is
  counted on its own", whose outline takes up the service line "keeps each of the store's discounts in a save of its
  own", which pins *Design rules* 5 and needs two discounts to fail.
- A coupon redeemed twice adding one, not two, to the count: owned by "A coupon counts only once", whose outline
  adds a built line where the count reads stored state (settled).
- The sales of a discount that has ended: owned by "Stephanie ends her discount"; the reading taken is that a
  discount's sales since the last count are counted whether it has ended or not.
- When a coupon was redeemed, who redeemed it, who counted and when: nothing records any of them; there is no
  identity, and Rodrigo does not care when.
- Seeing an earlier count again: no persona asked for it; a count is shown once, when it is made.
- How the number is worded ("1 discounted sale" against "3 discounted sales"): the number is shown under a
  caption, so no plural is formed.
- Rodrigo's weekly look at whether produce sales pay for the new supplier: story 2, told, not solved.
- A3 inverted: no accounts. Guessing and enumeration have no secret to find, since every store's name and
  address is shown on the discounts page; throttling is not asked for. That anyone can restart any store's count
  is the question held with Rodrigo, recorded above.
- A5 oversized body: the transport limit is application-wide and pinned by `POST /discounts`.
- A6 business-logic abuse: restarting a store's count to hide its sales from Rodrigo is the held question
  above; replaying a count is the A4 line "two counts at the same moment".
- Time: no rule of this slice depends on a date or a clock; "since the last count" is an order of events, not a
  time (n/a).
- An index for the store lookup: no behaviour depends on its speed at this scale.
- The controller and the route wiring: thin, pinned by the contract lines and the scenario only (settled).
- Styling of the count page: its own commits, no test.

## Invariants assumed

1. Every rule emits an event: counting a discount's sales raises `DiscountedSalesCounted`, carrying the
   discount's id and the number counted, inside `Discount`, published through the event-publisher port once the
   discount is kept. One event per discount, since each discount's count is kept on its own. Its refusals (no
   such store, cannot be counted) are recorded; no such store loads no aggregate to raise it, so where its
   event is raised is decided when that line is built.
2. One exception family → one status: a malformed count request → 400 naming the store's name and address; no
   such store → 404 (recorded); cannot be counted → placeholder 503 (recorded).
3. Combinations: a coupon unused, redeemed since the last count, or redeemed before it; a coupon issued before
   the last count and redeemed after it; a store and another store, or a store with the same name at another
   address, on the store lookup. Other conditions give no distinct outcome here.
4. Round-trip: a discount with a counted and an uncounted redeemed coupon, saved and loaded back.
5. Schemas no stricter than the domain: the request and response schemas' lines; the count's constraints traced
   to a rule.
6. One line per element the view shows or asks for: the store and the action on the count page; the item, the
   rate and the number of each discount counted.
7. The count reads stored state: the stored redemptions are the system of record, and what has been counted is
   kept with each discount (settled). Whether a coupon carries its own counted mark or the discount keeps what
   it has counted is a choice for domain reasons; the lines read the same either way.
8. One aggregate per transaction: each of the store's discounts is counted and kept in a save of its own, and
   the store's discounts become consistent eventually (*Design rules* 5). One repository: the store's discounts
   are read through the Discount repository, which speaks domain types only; no count repository and no sales
   port.
9. New names, none declared yet: `Discount`'s counting of its sales, `DiscountedSalesCounted`, the Discount
   repository's read of a store's discounts, `DiscountService`'s counting, `POST /stores/counts` with its
   request and response schemas in `@app/types`, the migration that lets a discount's sales be counted, the
   store's counting, `CountDiscountedSalesForm`, `CountView` and its route, and their captions in
   `discountTexts`. A different name moves its spec; the lines stay.
10. Wire types appear only in the controller layer.
11. No identity: a count records no one and no time.

## Dependencies

None new.

The new migration joins `theMigrationsAfterIt` in each earlier migration spec (`AGENTS.md` §7).
