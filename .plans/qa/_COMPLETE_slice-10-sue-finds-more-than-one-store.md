# Slice 10: Sue finds more than one store — red-test outline

The acceptance criterion is the scenario "Sue finds more than one store" of story 1 in
`.plans/sue-fresh-produce-epic.md`, read together with the story's rules: every published discount is shown,
from every store, each with its store's name and address; Sue works out for herself which store is near her.
Its text, and the case it leaves implicit, are appended to
`packages/sut/acceptance/features/sue-finds-a-produce-discount-close-to-home.feature`: the scenario carries
`@wip` while it is being built; the case it leaves implicit is a `@todo` scenario with its steps written and
no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/sue-fresh-produce-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-6-sue-finds-a-store-close-to-home.md`, the feature of story 1, the step patterns of
`packages/sut/acceptance/features/steps/sue-finds-a-produce-discount.steps.ts`, and the `describe` and `it`
names and the length of `contract/discounts/{get-discounts,published-discounts-in-postgres}.spec.ts`,
`unit/backend/discounts/application/discount-service/published.spec.ts`,
`unit/frontend/stores/discounts-store/load.spec.ts` and
`unit/frontend/discounts/components/published-discounts/render.spec.ts`. No implementation body was read.

## Outlined

**No new behaviour is needed.** Every published discount, from every store, is already listed and shown with
its own store, so the scenario is expected to pass as soon as its step definitions exist; a working-tree break
of the page (one store's rate shown on the other store's entry) shows "she sees the discount each one
offers" failing, and is restored.

One line recorded earlier is built here: "should show each entry with its own store address when two stores
share a name" in `unit/frontend/discounts/components/published-discounts/render.spec.ts`, recorded for this
scenario. More than one store on the page is this scenario's condition, and two stores sharing a name is the
combination of it where only the address tells them apart. The line is expected to pass at once for the same
reason as the scenario; a break that shows one address on both entries proves it can fail.

| Clause | Covered by (under `packages/sut/`) |
|---|---|
| Given Mike and Stephanie have published discounts on produce | publishing through the page, as "Mike has published a discount on produce" and "Stephanie has published a discount on produce" do; `contract/discounts/post-discounts.spec.ts` ("should keep both of two discounts published at the same moment") |
| When Sue looks for a new store with fresh produce | the existing step; `contract/discounts/get-discounts.spec.ts` ("should answer 200 with every published discount as JSON"); `contract/discounts/published-discounts-in-postgres.spec.ts` ("should list every kept discount, as the in-memory repository does"); `unit/backend/discounts/application/discount-service/published.spec.ts` ("should answer with every discount published when there are several"); `unit/frontend/stores/discounts-store/load.spec.ts` ("should hold every discount published") |
| Then she finds Mike's store and Stephanie's store | the existing check of a store's name, once per store; `unit/frontend/discounts/components/published-discounts/render.spec.ts` ("should show one entry per discount when several are published, two identical discounts included", "should show other pieces for another discount") |
| And she sees the discount each one offers | the same file; the line built here |

The step definitions: "Given Mike and Stephanie have published discounts on produce" publishes both produce
discounts through the page, each with its own store name, address and rate; "Then she finds Mike's store and
Stephanie's store" checks each store's name, nothing else; "And she sees the discount each one offers" checks,
once per discount, that the entry naming that store shows that discount's item and rate. A store and a rate
found apart on the page do not count, so a page showing Stephanie's rate under Mike's store fails, though both
items are produce; no address is checked, which belongs to "she sees where it is" (settled). "She finds
<store>" already checks the store's name only.

## Recorded for later

2 lines stay `it.todo`.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — each discount of one store on an entry of its own, each naming the store | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added) | `@todo` "Sue sees each discount of one store on its own"; settled: one entry per discount, no grouping under the store |
| 1 — every other discount listed when one kept before the rules would be refused by them | `contract/discounts/get-discounts.spec.ts` (added) | a technical guard with no persona behind it; built with "Mike gives an invalid rate", decided there with the rates kept before the rules, and covering every field whose rules arrive later (settled) |

## Out of scope

- Showing the stores near Sue first: not part of this story and not planned.
- The order of the discounts: recorded with "Sue finds a discount on produce" (`@todo` "Sue sees the discounts
  in order").
- A great many stores or discounts: recorded with "Sue finds a discount on produce" (`@todo` "Sue looks when a
  great many discounts are published").
- Grouping the discounts under their store: settled, no grouping; the recorded line above keeps one entry per
  discount.
- Two stores discounting the same item at different rates: covered by the step's whole-entry check and the
  lines on one entry per discount.
- Coupons on the page with several stores: owned by "Sue decides to try Stephanie's produce".
- Adversarial categories A1–A6: the slice adds no input, handle, shared state or rule (n/a).
- Time: no rule of this slice depends on a date or a clock (n/a).

## Invariants assumed

1. Every rule emits an event: no new rule.
2. One exception family → one status: no new family.
3. Combinations: two stores × their own discounts, and two stores of the same name × their addresses, are
   lines; one store × several discounts is recorded.
4. Round-trip: unchanged.
5. Schemas no stricter than `Discount`: unchanged; the recorded GET line keeps old rows from being refused.
6. One line per element the view shows or asks for: no new element.
7. No new names in production code.
8. No identity and no location: nothing records where Sue is.

## Dependencies (the developer installs them)

None new.
