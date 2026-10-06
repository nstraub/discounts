# Slice 3: Mike raises a discount — red-test outline

The acceptance criterion is the scenario "Mike raises a discount" of story 2 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the story's rules: only the rate changes, under
story 1's rules, and anyone can act for any store (no store key, no identity). Its text, and the cases it
leaves implicit, are in `packages/sut/acceptance/features/mike-raises-a-discount-that-is-not-working.feature`,
the feature of story 2: the scenario carries `@wip` while it is red; each case it leaves implicit is a
`@todo` scenario with its steps written and no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, `.plans/discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-1-mike-publishes-a-new-discount.md`,
`.plans/qa/_COMPLETE_slice-2-sue-finds-a-discount-on-produce.md`, the `describe` and `it` names of every spec
under `packages/sut/unit` and `packages/sut/contract`, `packages/sut/support/example-discounts.ts`, the step
patterns under `packages/sut/acceptance/features/steps/`, and the exported declarations of
`packages/backend/src/discounts/**`, `packages/types/{discounts,rest-api}.ts`,
`packages/frontend/src/stores/discounts-store.ts` and the props of `packages/frontend/src/discounts/components/*.vue`.
No implementation body was read.

## Outlined

46 `it.todo` lines: 32 are built in this slice (the table below); 14 are recorded for later and stay
`it.todo` (*Recorded for later*). Lines for three existing spec files are added inside each file's top-level
`describe`, in groups of their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 3 — holds the new rate; raises `DiscountRateChanged` with its id and new rate; keeps item, store name and address | the scenario; *Design rules* 1 and 4 (the rule decided inside `Discount`, its event published through the port) | edge-case-discovery | `unit/backend/discounts/application/domain/discount/change-rate.spec.ts` (new) |
| 1 — holds the later rate when changed twice | the story: 20 %, then 25 %, later 30 % | edge-case-discovery (state) | same file |
| 2 — keeps the discount named at its new rate; announces `DiscountRateChanged` once kept | the scenario | edge-case-discovery | `unit/backend/discounts/application/discount-service/change-rate.spec.ts` (new) |
| 3 — 204 with no body; listed once at the new rate afterwards; `DiscountRateChanged` on the wired app's emitter | the scenario; a successful change answers 204 with no body (settled); the discount is shown exactly once, at its new rate, so a change made as a second discount cannot pass (settled) | api-testing (success, lifecycle, event) | `contract/discounts/patch-discounts-id.spec.ts` (new) |
| 4 — 400 naming the rate when missing or not text, never a 500; 400 for a non-object body; 400 for invalid JSON; every error body matches the error schema | client input is never answered with a 500 (settled); the malformed-request 400 as built for publishing | api-testing (malformed request); adversarial-testing (A1, A5) | same file |
| 1 — change request schema no stricter than `Discount` | invariant 5 | api-testing (strictness) | same file |
| 2 — finds the discount with that id among several; nothing for an id no discount has | the repository reads one discount to change it | database-testing (query) | `contract/discounts/discount-by-id-in-postgres.spec.ts` (new) |
| 1 — a discount at a changed rate saved and loaded back equal | invariant 4 | database-testing (round-trip) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |
| 1 — only the discount named changes, the other keeps its rate | an update without the discount's id would change every discount (settled: built now) | database-testing; edge-case-discovery (combination) | same file |
| 3 — sends the body as JSON with PATCH; resolves on an ok answer with no content; rejects on one that is not ok | the page reaches the change through the REST client, tested against the wired backend (settled) | contract-testing | `contract/types/rest-api/fetch-rest-api.spec.ts` (added) |
| 3 — asks for the new rate under its caption; offers to change it under its caption; names the discount it changes in its label | a change-the-rate control on each entry, captioned `New rate (%)` and `Change rate` from the feature's texts module, each labelled so a person or a screen reader knows which discount it changes (settled); invariant 6 | edge-case-discovery | `unit/frontend/discounts/components/change-rate-form/render.spec.ts` (new) |
| 2 — changes its own discount to the rate Mike gives; exactly as written | the scenario; the rate is kept as written | edge-case-discovery (type) | `unit/frontend/discounts/components/change-rate-form/change.spec.ts` (new) |
| 1 — a blank rate is changed to as left out, never as zero | a blank new rate counts as missing (settled); the control must not turn it into a rate | edge-case-discovery (empty) | same file |
| 3 — hands the discount and new rate over; holds the discount at its new rate once changed; on that discount only | the entry shows the rate Mike gave after a successful change (settled); the other discounts untouched | edge-case-discovery (combination) | `unit/frontend/stores/discounts-store/change-rate.spec.ts` (new) |
| 2 — the control on each entry; an entry's text kept apart from its control | the control sits on each entry; the entry's text in its own element, apart from the controls (settled) | edge-case-discovery; invariant 6 | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added) |

The step definitions check "people can see the new rate" from someone other than Mike, in a fresh browser
context: the discount is shown exactly once, at its new rate.

`PATCH /discounts/:id` with a body of the rate; `Location` from a publish names `/discounts/<id>`, which this
route now acts on. No `GET /discounts/<id>` is built: no scenario reads one discount.

## Recorded for later

14 lines stay `it.todo`, each with its `@todo` scenario.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — a change to the rate it already has is accepted, the discount staying as it is | `unit/backend/discounts/application/domain/discount/change-rate.spec.ts` | `@todo` "Mike changes a discount to the rate it already has"; settled: accepted, no message |
| 1 — a blank new rate refused as missing, the rate kept | the same file | `@todo` "Mike gives only blank space for the new rate"; settled: a blank new rate counts as left out; built with "Mike leaves out the new rate" |
| 1 — a new rate that is not a number refused as not valid, the rate kept | the same file | `@todo` "Mike gives a new rate that is not a number"; settled: not a number is not valid; built with "Mike gives an invalid new rate" |
| 1 — 400 naming the rate when it is only blank space | `contract/discounts/patch-discounts-id.spec.ts` | `@todo` "Mike gives only blank space for the new rate" |
| 1 — 400 naming the rate when it is not a number | the same file | `@todo` "Mike gives a new rate that is not a number" |
| 1 — no such discount reported, nothing changed | `unit/backend/discounts/application/discount-service/change-rate.spec.ts` | `@todo` "Mike changes a discount that does not exist"; settled: he is told there is no such discount, a not-found family (404) |
| 1 — 404 for an id no discount has, changing no discount | `contract/discounts/patch-discounts-id.spec.ts` | the same `@todo` scenario |
| 1 — changes from one source throttled | the same file | `@todo` "Someone floods the discounts with changes"; settled: not adopted, an open risk |
| 2 — two changes at once: one holds, whole; a change from an out-of-date page applies, the last change holding | the same file | `@todo` "Two changes to one discount arrive at once" and "Mike raises a discount from a page that is out of date"; settled: last write wins, no versioning |
| 1 — 503 with the error schema when the change cannot be kept, the rate unchanged | the same file | `@todo` "Mike's new rate cannot be kept right now"; settled: he is told it could not be changed and to try again; 503 is a placeholder, fixed with the exception family |
| 1 — the service reports the rate could not be changed | `unit/backend/discounts/application/discount-service/change-rate.spec.ts` | the same `@todo` scenario |
| 1 — the store holds that the rate could not be changed, the discount keeping its rate | `unit/frontend/stores/discounts-store/change-rate.spec.ts` | the same `@todo` scenario |
| 1 — only the rate changes; item, store name and address in the request unused | `contract/discounts/patch-discounts-id.spec.ts` | `@todo` "A change to a discount's rate carries other information"; settled: ignored |

A known gap among the cases that must never answer with a 500: until the 404 line is built, a change to an id
no discount has answers whatever the code does — a 204 that changes nothing, or a 500. No line asserts that
a malformed id and a well-formed absent one get the same answer.

## Out of scope

- Lowering a rate: owned by "Mike lowers a discount"; a change of rate does not depend on its direction.
- The rate's rules (above 0 %, at most 100 %, one decimal place) for a new rate: owned by "Mike gives an invalid
  new rate"; a new rate left out: "Mike leaves out the new rate".
- Other discounts keeping their rates as a scenario: owned by "Mike's other discounts keep their rates"; the
  database and store lines above guard the one change touching one discount.
- Anyone changing any discount: settled, anyone can act for any store; there is no key and nothing records who
  changed what. The risk of vandalism this brings is a product question, not a line.
- A sequential or guessable id: settled as acceptable; the guessing line is recorded above, and no
  enumeration line is outlined.
- The oversized body: the transport limit is application-wide and pinned by `POST /discounts`.
- A2 injection: the rate reaches the database through the repository's parameters, as the publish lines show
  for text (n/a here).
- Coupons: they do not exist at this point of the epic.
- Time: no rule of this slice depends on a date or a clock (n/a).
- Migration slots: no schema change; the rate column exists and keeps the rate as written.
- The controller and module wiring: covered by the contract lines only.
- Restructuring the entry so its text has an element of its own apart from its controls: a refactor of
  existing code, done before the control is added; the line above keeps the entry's text as it reads.
- Styling of the control: its own commit, no test.

## Invariants assumed

1. Every rule emits an event: changing the rate raises `DiscountRateChanged` inside `Discount`; its
   rejections (blank, not a number) are recorded for later.
2. One exception family → one status: a malformed change → 400 naming the rate; no such discount → 404
   (recorded); cannot be kept → placeholder 503 (recorded).
3. Combinations: one discount among several × the change; changed twice. Other conditions make the rest
   irrelevant (a malformed change changes nothing).
4. Round-trip: a discount at a changed rate, saved and loaded back.
5. Schemas no stricter than `Discount`: the change request schema's line.
6. One line per element the view shows or asks for: the new rate and the action to change it; the control on
   each entry.
7. New names, none declared yet: `Discount.changeRate()`, `DiscountRateChanged`, `DiscountService.changeRate()`,
   a repository read of one discount by id, `PATCH /discounts/:id` and its request schema in `@app/types`,
   `FetchRestApi.patch()`, `ChangeRateForm`, the store's change of rate. A different name moves its spec; the
   lines stay.
8. Wire types appear only in the controller layer; the repository speaks domain types only; one repository,
   for `Discount`.
9. No identity: nothing records who changed a rate.

## Dependencies

None new.
