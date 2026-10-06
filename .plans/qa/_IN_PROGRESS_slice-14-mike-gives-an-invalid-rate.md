# Slice 14: Mike gives an invalid rate — red-test outline

The acceptance criterion is the scenario outline "Mike gives an invalid rate" of story 1 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the rate's rule: a rate is valid when it is above
0 % and at most 100 %, with at most one decimal place (12.5 % is valid, 12.25 % is not). This is the first
scenario where the rule decides, so the rule arrives here, inside the Discount aggregate; whether it lives in
a value object for the rate is a design call left open. Its text is appended to
`packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`, carrying `@wip`
while it is red; the cases it leaves implicit are `@todo` scenarios with their steps written and no step
definitions.

Files read: `.plans/mike-new-neighbourhood-epic.md`, the feature of story 1 and the outlines appended to it for
"Mike publishes a discount at any rate up to 100%" and "Mike's earlier discounts stay published", the outline
and spec drafts of the former, the `describe` and `it` names and the length of the specs this outline adds to,
the arrange of the `GET /discounts` line that lists a rate written as 12,5, and the recorded rulings on the rate.
No implementation body was read.

## Outlined

27 new `it.todo` lines: 26 built in this slice, 1 recorded. The slice also builds 6 lines recorded with "Mike
publishes a discount at any rate up to 100%" (below): 32 built. One spec file is new; lines for five existing
spec files are added inside each file's top-level `describe`, in groups of their own; no existing line is
changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — raises `DiscountPublicationRejected` with the rate and that it is not valid; raises no `DiscountPublished` | invariant 1: the rule emits its rejection | edge-case-discovery | `unit/backend/discounts/application/domain/discount/publish.spec.ts` (added) |
| 9 — accepts 20, 12.5, 100 and 0.1; refuses 0, −10, 100.1, 150 and 12.25, each rejection naming the rate as not valid | the scenario's rows and the rule's bounds: 0.1 the lowest, 100 the highest, 100.1 the tightest off-point above it (settled) | edge-case-discovery (boundary) | same file |
| 3 — refuses a rate that is not a number, such as "a fifth"; refuses 12,25; refuses 0,0 | a rate that is not a number is not valid (settled); a decimal comma reads as the decimal point, so 12,25 has two decimals and 0,0 is zero (settled) | edge-case-discovery (type) | same file |
| 3 — reports the rate as not valid; keeps nothing; announces `DiscountPublicationRejected` | the scenario ("the discount is not published") | edge-case-discovery | `unit/backend/discounts/application/discount-service/publish.spec.ts` (added) |
| 5 — 400 naming the rate as not valid for the scenario's five rates; body matching the error schema; nothing published; the rejection on the wired app's emitter; no rejection raised for a body the request schema refuses before any rule decides | the scenario; invariant 2; only a rule that decides raises its rejection (settled) | api-testing (exception family, event) | `contract/discounts/post-discounts-invalid-rate.spec.ts` (new; `post-discounts.spec.ts` is near 200 lines) |
| 1 — a discount kept before the rules at a rate they refuse listed as written, matching the response schema | the rules apply on write only; the column stays text and the response schema is not tightened (settled); invariant 5 | database-testing (state); api-testing (strictness) | `contract/discounts/get-discounts.spec.ts` (added) |
| 1 — holds that the rate is not valid | the page reaches the publish through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/publish.spec.ts` (added) |
| 2 — tells Mike the rate is not valid once refused; says nothing of it before | the scenario ("he is told the rate is not valid"); the message `The rate must be above 0 % and at most 100 %, with at most one decimal.` in `discountTexts`, shown only once a publish is refused (settled); invariant 6 | edge-case-discovery (state) | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` (added) |

Lines recorded with "Mike publishes a discount at any rate up to 100%" and built here:

| Line | Spec file (under `packages/sut/`) |
|---|---|
| refuses 1e2, 0x14 or Infinity as not valid | `unit/backend/discounts/application/domain/discount/publish.spec.ts` |
| a rate sent as a JSON number answered 400 naming the rate or published, never a 500 | `contract/discounts/post-discounts-rate.spec.ts` |
| a rate of 10 000 characters answered 400 naming the rate | the same file |
| a rate of 33.3 kept and loaded back exactly | `contract/discounts/discount-kept-in-postgres.spec.ts` |
| rates published before the rate rules read back as written | the same file |
| accepts a rate written with a decimal comma as the rate it names | `unit/backend/discounts/application/domain/discount/publish.spec.ts` |

A decimal comma reads as the decimal point: 12,5 is valid as 12.5, and is kept and shown as written (settled).
Lines already built that depend on it:
`contract/discounts/get-discounts.spec.ts` "should list a rate exactly as it was written, such as 12,5" (it
publishes 12,5 through `POST /discounts`) and `contract/discounts/rate-as-written-migration.spec.ts`'s forward
line.

The step definitions: "Given Mike tries to publish a discount" opens Mike's page and fills in his example
discount but the rate; "When he gives a rate of <rate>" types the example's rate, its `%` stripped (settled), and
asks to publish; "Then he is told the rate is not valid" checks the form's message; "And the discount is not
published" checks that a page opened by someone else does not show it. These steps are first defined here, and
the existing `@todo` scenarios "Mike gives a rate in a computer's notation" and "Mike gives a rate far longer
than any rate" use them; they stay tagged `@todo` as the acceptance-level record of lines built above, as do the
new ones "Mike gives the lowest rate a discount may have", "Mike gives a rate just above 100%" and "Mike gives a
rate that is not a number".

## Recorded for later

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — names at once the rate as not valid and the item as missing | `contract/discounts/post-discounts-invalid-rate.spec.ts` | `@todo` "Mike leaves out the item and gives an invalid rate"; open, the proposal beside it: every problem reported at once; taken up with "Mike leaves out all the required information" |

The other ways of writing a rate (a percent sign, surrounding spaces, a trailing zero, a rate shown without a
needless .0, and the rows .5 %, 05 %, +20 %) stay recorded (settled) under `@todo` "Mike writes a rate in another way".

## Out of scope

- A new rate that is not valid when a rate is changed: owned by "Mike gives an invalid new rate". If the rule
  sits in a rate value object that a change also goes through, that slice may pass as soon as its steps exist.
- A rate left out or only blank space: owned by "Mike leaves out required information".
- 100.5 %: the same partition as 100.1 (above 100); the scenario's row covers it at acceptance level.
- Checking the rate in the page before publishing: the rule has one home, the aggregate; the page shows what it
  answers.
- Keeping what Mike typed after a refusal: a convenience no persona asked for; if added, its line is written first.
- A2 injection: the rate reaches the database through the repository's parameters (n/a). A3: no handle (n/a).
  A4: a refusal keeps nothing (n/a). A5: the transport limit is pinned by `POST /discounts` (n/a). A6: cheating
  the rule is the scenario itself.
- Time: no rule depends on a date or a clock (n/a).
- Migration slots: the column stays text, so there is no schema change (settled).

## Invariants assumed

1. Every rule emits an event: a rate refused raises `DiscountPublicationRejected`, carrying the rate as given and
   the reason, inside the aggregate, and no `DiscountPublished`; a body the request schema refuses before any rule
   decides raises none (settled).
2. One exception family → one status: a rate not valid → 400 naming the rate, the error schema's `fields`
   naming it; the same family as a field missing or mistyped.
3. Combinations: the rate's value × its bounds and its decimals; a comma × two decimals; a rule-refused rate
   already kept × a list. A rate not valid × a field missing is recorded.
4. Round-trip: the existing lines; 33.3 exactly.
5. Schemas no stricter than the domain: the request keeps the rate as text; the response lists rates kept before
   the rules.
6. One line per element the view shows: the message that the rate is not valid.
7. New names, none declared yet: `DiscountPublicationRejected`, the rate's rule and its home, the message in
   `discountTexts`. A different name moves its line; the lines stay.
8. No identity: a rejection records no one.

## Dependencies

None new.
