# Slice 16: Mike leaves out required information — red-test outline

The acceptance criterion is the scenario outline "Mike leaves out required information" of story 1 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the epic's rules: a discount has an item, a rate,
and its store's name and address, all four required; every missing piece is reported at once. Text that is
empty or made only of blank space counts as left out (settled). Its text is appended to
`packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`, carrying `@wip`
while it is red; the case it leaves implicit is a `@todo` scenario with its steps written and no step
definitions.

What exists already: `POST /discounts` answers 400 with the one error schema, `fields` naming every missing or
mistyped field at once (`post-discounts.spec.ts`) and naming the rate when its rule refuses it
(`post-discounts-invalid-rate.spec.ts`). The rate's rule is `DiscountRate`, reached through
`Discount.publish(keep)`, which raises `DiscountPublicationRejected` (today carrying the rate and the reason
"not valid", built through `DiscountEvents.publicationRejected`) and throws `RateNotValidException`. The page
publishes a rate left empty or blank as left out (`publish-discount-form/publish.spec.ts`), and the store holds
`rateNotValid` once a publish is refused, from a rejection that names only the path and the status
(`discounts-store/publish.spec.ts`, `contract/types/rest-api/fetch-rest-api.spec.ts`). So today a rate left out
answers `fields: ['rate']`, the same as a rate of 150, and the page tells Mike the rate is not valid.

What this slice adds: the error body tells a piece missing apart from one not valid; Mike is told, on the page,
which piece is missing, beside its own field, and never that a rate he left out is not valid; and a piece sent
as empty or blank text is refused by the aggregate as missing instead of published.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-14-mike-gives-an-invalid-rate.md`, the feature of story 1, the step definitions of
"Mike gives an invalid rate"; the specs and supports `unit/backend/discounts/application/domain/discount/`
`publish.spec.ts`, `publish-at-a-rate.spec.ts` and `publishing-a-discount.ts`,
`unit/backend/discounts/application/discount-service/publish.spec.ts`, `contract/discounts/post-discounts.spec.ts`,
`post-discounts-invalid-rate.spec.ts`, `post-discounts-rate.spec.ts`, `contract/support/error-schema.ts`,
`unit/frontend/stores/discounts-store/publish.spec.ts`, `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts`,
the `describe` and `it` names and the `posting` lines of `contract/types/rest-api/fetch-rest-api.spec.ts`; and the exported declarations
of `packages/types/discounts.ts`, `rest-api.ts`, `rest-api-refusals.ts`, `packages/frontend/src/discounts/texts.ts`,
`packages/frontend/src/stores/discounts-store.ts`, and of `Discount`, `DiscountDetails`, `DiscountEvents`,
`DiscountRate`, `DiscountPublicationRejected`, `RateNotValidException` and `DiscountService`. No line below is
derived from an implementation body.

## Outlined

28 new `it.todo` lines, all built in this slice, plus 5 lines recorded with "Mike publishes a new discount" and
built here: 33 built. Three spec files are new; lines for three existing spec files are added inside each file's
top-level `describe`, in groups of their own; no existing line is changed or removed. The new spec files follow
the split by feature: a discount published with a piece left out beside `publish.spec.ts` and
`publish-at-a-rate.spec.ts`, and beside `post-discounts.spec.ts` and `post-discounts-invalid-rate.spec.ts`.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — raises `DiscountPublicationRejected` naming each piece left out as missing; raises no `DiscountPublished` | invariant 1, for the pieces the aggregate refuses: text that is empty or only blank space | edge-case-discovery | `unit/backend/discounts/application/domain/discount/publish-with-a-piece-left-out.spec.ts` (new) |
| 4 — refuses an item, a store name and a store address that is empty text, each named as missing; a rate that is empty text or only blank space named as missing, not as not valid | the scenario's rows, whatever the page sends for an empty field; a blank rate is a missing rate (settled) | edge-case-discovery (empty) | same file |
| 1 — an item and a store address both made only of blank space named as missing at once | every missing piece is reported at once (rule 3) | edge-case-discovery (combination) | same file |
| 2 — reports the pieces left out as missing; keeps nothing | the scenario ("the discount is not published") | edge-case-discovery | `unit/backend/discounts/application/discount-service/publish.spec.ts` (added) |
| 6 — 400 listing as missing each piece left out; a rate left out listed as missing and a rate of 150 not, `fields` naming the rate in both; 400 listing the item, store name and store address as missing when empty text; the error schema; nothing published, nothing listed afterwards; `DiscountPublicationRejected` on the wired app's emitter for a blank piece | the scenario; invariant 2; the error body lists the missing fields apart (settled) | api-testing (malformed request, schema, event); edge-case-discovery (empty) | `contract/discounts/post-discounts-with-a-piece-left-out.spec.ts` (new) |
| 4 — holds which pieces are missing as the refusal lists them; does not hold the rate as not valid when the refusal lists it as missing, nor when it lists only other pieces as missing; holds no piece as missing once the next discount is published | the page reaches the publish through the store, which holds what the page shows; "missing" or "not valid" is chosen per field from the refusal's list (settled) | edge-case-discovery (combination, state) | `unit/frontend/stores/discounts-store/publish.spec.ts` (added) |
| 1 — carries the fields a 400 lists as missing in the rejection | the store reads the missing pieces from the refusal; the declared `RestApi` rejection names only the path and the status ("should name the path and the status of the answer in the rejection") | api-testing (malformed request) | `contract/types/rest-api/fetch-rest-api.spec.ts` (added, in `posting`) |
| 4 — tells Mike the item, the rate, the store name, the store address is missing, each beside its own field once the publish is refused for it | the scenario's four rows ("he is told <information> is missing"); each message beside its own field (settled); invariant 6, one line per piece | edge-case-discovery | `unit/frontend/discounts/components/publish-discount-form/publish-with-a-piece-left-out.spec.ts` (new) |
| 2 — tells Mike nothing is missing before a publish is refused; no longer tells him once he gives the piece and the discount is published | after publishing, the form clears and stays, ready for the next discount (settled) | edge-case-discovery (state) | same file |
| 2 — tells Mike every piece missing at once, each beside its own field; tells him the rate is missing, never that it is not valid, when the refusal lists it as missing | all messages at once (rule 3; settled); a missing rate never shows the not-valid message (settled) | edge-case-discovery (combination) | same file |

Lines recorded with "Mike publishes a new discount" and built here (blank text counts as missing, settled):

| Line | Spec file (under `packages/sut/`) |
|---|---|
| refuses an item made only of blank space, its rejection naming the item as missing | `unit/backend/discounts/application/domain/discount/publish.spec.ts` |
| refuses a store name made only of blank space, its rejection naming the store name as missing | the same file |
| refuses a store address made only of blank space, its rejection naming the store address as missing | the same file |
| 400 naming the item, the store name and the store address when each is only blank space | `contract/discounts/post-discounts.spec.ts` |
| 400 naming the rate when the rate is only blank space | the same file |

Each of the five moves, when it is filled, into this slice's new spec file of the same subject
(`publish-with-a-piece-left-out.spec.ts`, `post-discounts-with-a-piece-left-out.spec.ts`): the specs are split by
feature, and these lines are the feature "a piece left out", not "publishing a discount". Filled where it
stands, `post-discounts.spec.ts` (182 lines) would also pass 200.

The error body tells a piece missing apart from a rate that is not valid (settled): the one error schema,
`requestRejection` in `@app/types/discounts`, keeps `statusCode`, `message` and `fields`, which still names every
offending field, and gains one optional key listing the fields that are missing, its name left open; the schema
stays one non-strict object, so every body already matching it still does (`bodiesNotMatchingTheErrorSchema`
keeps passing for the bodies of `post-discounts.spec.ts` and `post-discounts-invalid-rate.spec.ts`). `fields`
naming the rate in both answers is read with `theFieldsNamedBy` in `contract/support/error-schema.ts`. The page
picks "missing" or "not valid" per field from that list, never from the message. The first line asking for the
list is red against today's body. The messages are `The item is missing.`, `The rate is missing.`, `The store
name is missing.` and `The store address is missing.`, in `discountTexts`, each beside its own field, all at
once when several pieces are missing, shown only once a publish is refused (settled); a missing rate never
shows `discountTexts.rateNotValid`.

Which refusal decides what: a piece absent from the request is refused by the request schema, before any rule
runs, and raises no event (settled); a piece that is empty text or only blank space reaches the aggregate,
which refuses it as missing and raises `DiscountPublicationRejected` with the reason "missing" (settled); both
answers carry the same wire shape. A rate made only of blank space is missing, while a rate with blank space
around digits, such as ` 20 `, stays not valid (`publish-at-a-rate.spec.ts`, "should refuse a rate written in a
way not yet accepted"). Only shown text is trimmed; whether stored text is trimmed is not settled, and no line
here depends on it.

How this slice relates to the combination recorded with "Mike gives an invalid rate": the `@todo` scenario "Mike
leaves out the item and gives an invalid rate" and its line "should name at once the rate as not valid and the
item as missing when both are wrong" (`contract/discounts/post-discounts-invalid-rate.spec.ts`, `combination`)
stay recorded and unchanged. They are taken up with "Mike leaves out all the required information", together
with an absent piece and a blank one in one request. This slice builds what that line needs, the list of the
missing fields beside `fields`, and the page showing every listed piece at once; it decides nothing about
reporting a missing piece and a rate not valid in one answer.

The step definitions: "Given Mike tries to publish a discount" is the existing step, which fills in Mike's
example discount but the rate; "When he leaves out <information>" gives the rate and empties the field the row
names (for the row "the rate", gives none), then asks to publish; "Then he is told <information> is missing"
checks the form's message for that piece; "And the discount is not published" is the existing step. The four rows
map to the four fields in the page driver, with the captions; the example values stay out of the Gherkin.

Lengths with this outline's lines: `mike-publishes-a-discount-on-what-he-is-famous-for.feature` 201 lines (the
story has one feature; the scenario is appended to it), `unit/backend/discounts/application/discount-service/publish.spec.ts`
81, `unit/frontend/stores/discounts-store/publish.spec.ts` 60, `contract/types/rest-api/fetch-rest-api.spec.ts` 112; the three new files 12 to 21 lines as outlines.
The form's lines go to a new file because `publish-discount-form/publish.spec.ts` (161 lines) passes 200 once
they are filled.

Whether a line passes as soon as its steps exist: not the slice as a whole. The row "the rate" is already
refused end to end, but the page tells Mike the rate is not valid; the other rows depend on what the page sends
for an empty field, which no spec pins.

The `@todo` scenario "Mike gives what he left out and publishes" is the acceptance-level record of the state
lines built above; the existing `@todo` "Mike leaves out required information by giving only blank space" is
that of the five recorded lines built here.

## Recorded for later

None.

## Out of scope

- The scenario "Mike leaves out all the required information", an absent piece and a blank one in one
  request, and a piece left out together with a rate not valid: owned by that scenario (above).
- A piece absent from the request raising no `DiscountPublicationRejected`: the same partition as a body the
  request schema refuses before any rule decides, pinned in `post-discounts-invalid-rate.spec.ts`.
- The hook left out: it is optional; the existing lines publish without one.
- A piece sent as `null`: refused by the request schema like a mistyped piece (existing line); whether the
  list names it as missing is decided when the first contract line is filled, since the page never sends it.
- Checking for missing pieces in the page before publishing: the rule has one home, the server; the page
  shows what it answers.
- Keeping what Mike typed after a refusal: a convenience no persona asked for; if added, its line is written
  first.
- How each message is styled beside its field: its own commit, no test.
- A1 hostile types (an array, an object for a piece): refused by the request schema as mistyped, pinned by the
  existing malformed-request lines (n/a). A2: a refused piece reaches no query (n/a). A3: no handle (n/a). A4:
  a refusal keeps nothing (n/a). A5: the transport limit is pinned by `POST /discounts` (n/a). A6: going around
  the page with empty or blank text is the empty-text and blank lines above.
- Time: no rule depends on a date or a clock (n/a).
- Migration slots: nothing new is kept (n/a).

## Invariants assumed

1. Every rule emits an event: a piece refused by the aggregate as missing raises `DiscountPublicationRejected`,
   naming the pieces and the reason, and no `DiscountPublished`; a piece absent from the request is refused by
   the schema before any rule decides and raises none (settled). Today the event carries a rate and a reason,
   built through `DiscountEvents.publicationRejected(rate, reason)`; how it names the pieces is left open.
2. One exception family → one status: a piece missing → 400, the family of a field missing or mistyped and of a
   rate not valid, the error body listing the pieces missing apart from those not valid (settled).
3. Combinations: each piece × absent, empty, blank; two blank pieces; several pieces shown at once; a rate left
   out × the not-valid message, in the store and in the form; a blank rate × a rate with blank space around it;
   refused × published once given.
4. Round-trip: the existing lines; a refusal keeps nothing.
5. Schemas no stricter than the domain: the request schema keeps every piece as any text; refusing empty and
   blank text is the aggregate's rule, not a schema refinement.
6. One line per element the view shows: the message for each of the four pieces.
7. New names, none declared yet: the reason "missing" and the pieces on `DiscountPublicationRejected`, the
   refusal `Discount.publish` throws for a missing piece, the key listing the missing fields in
   `requestRejection`, how the `RestApi` rejection carries them, what the store holds for the missing pieces, the four messages in `discountTexts`. A
   different name moves its line; the lines stay.
8. No identity: a refusal records no one.

## Dependencies

None new.
