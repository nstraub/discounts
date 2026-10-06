# Slice 6: Sue finds a store close to home — red-test outline

The acceptance criterion is the scenario "Sue finds a store close to home" of story 1 in
`.plans/sue-fresh-produce-epic.md`, read together with the story's rules: every published discount is shown,
from every store, each with its store's name and address; Sue works out for herself which store is near her;
showing the stores near her first is not part of this story. Its text, and the case it leaves implicit, are
appended to `packages/sut/acceptance/features/sue-finds-a-produce-discount-close-to-home.feature`: the
scenario carries `@wip` while it is being built; the case it leaves implicit is a `@todo` scenario with its
steps written and no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/sue-fresh-produce-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-2-sue-finds-a-discount-on-produce.md`, the feature of story 1,
`packages/sut/acceptance/features/steps/sue-finds-a-produce-discount.steps.ts`,
`packages/sut/acceptance/support/discounts-page.ts`, and the `describe` and `it` names of
`packages/sut/unit/frontend/discounts/components/published-discounts/render.spec.ts`. No implementation body
was read.

## Outlined

**No line needs building in this slice.** Each entry of the page already shows its store's address, built for
"Mike publishes a new discount", so the scenario is expected to pass as soon as its step definitions exist; a
working-tree break of the page (the address hidden) shows "she sees where it is" failing on its own, and is
restored.

| Clause | Covered by (under `packages/sut/`) |
|---|---|
| Given Mike's store is within walking distance of Sue's home | publishing through the page, as "Mike has published a discount on produce" does: `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts`, `contract/discounts/post-discounts.spec.ts`, `contract/discounts/discount-kept-in-postgres.spec.ts` |
| When Sue looks for a new store with fresh produce | the existing step; `contract/discounts/get-discounts.spec.ts`, `unit/frontend/discounts/views/discounts-view/render.spec.ts` |
| Then she finds Mike's store | the existing step, which checks the store's name only; `unit/frontend/discounts/components/published-discounts/render.spec.ts` ("should show its store name") |
| And she sees where it is | the same file ("should show its store address") |
| And she sees the discount it offers | the existing step, which checks the item and the rate; the same file ("should show its item", "should show its rate as a percentage") |

The step definitions:

- "Given Mike's store is within walking distance of Sue's home" publishes Mike's produce discount, with his
  store's address, through the page, and sets no location: the product holds none, and Sue judges the
  distance from the address herself. A one-line comment in the step says so.
- "And she sees where it is" checks the store's address on the entry of the store found, and nothing else.
  The page driver gains that check beside the existing name-only and item-and-rate checks, so each `Then`
  owns one fact and fails for its own reason.

## Recorded for later

1 line stays `it.todo`, with its `@todo` scenario; none is built in this slice.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — each entry with its own store address when two stores share a name | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added, a group of its own inside the top-level `describe`) | `@todo` "Sue tells apart two stores with the same name by where they are"; built with "Sue finds more than one store" |

## Out of scope

- Showing the stores near Sue first, and how the product would know where she is: not part of this story and
  not planned.
- The address as a link to a map, or any location beyond the address as written: the story asks that Sue know
  where the store is, and the address tells her.
- Several stores on the page: owned by "Sue finds more than one store".
- An address left out, made only of blank space or longer than allowed: recorded with "Mike publishes a new
  discount".
- An address with accents, apostrophes or markup: kept verbatim and shown as plain text by lines built for
  "Mike publishes a new discount".
- An address on several lines: the form asks for it on one line.
- Hearing where a store is with a screen reader: under the open accessibility question recorded with
  "Sue finds a discount on produce".
- Adversarial categories A1–A6: the slice adds no input, handle, shared state or rule; the address's abuse
  cases are those of publishing (n/a here).
- Time: no rule of this slice depends on a date or a clock (n/a).

## Invariants assumed

1. Every rule emits an event: no new rule.
2. One exception family → one status: no new family.
3. Combinations: two stores of the same name × their addresses is recorded; other conditions give no
   distinct outcome.
4. Round-trip: unchanged; the address is part of the discount saved and loaded back.
5. Schemas no stricter than `Discount`: unchanged.
6. One line per element the view shows or asks for: the address on each entry is already a line.
7. No new names in production code.
8. No identity and no location: nothing records where Sue is.

## Dependencies

None new.
