# Slice 2: Sue finds a discount on produce — red-test outline

The acceptance criterion is the scenario "Sue finds a discount on produce" of story 1 in
`.plans/sue-fresh-produce-epic.md`, read together with the story's rules: every published discount is shown,
from every store, each with its store's name and address; Sue works out for herself which store is near her;
no filter separates spices from produce. Its text, and the cases it leaves implicit, are in
`packages/sut/acceptance/features/sue-finds-a-produce-discount-close-to-home.feature`: the scenario carries
`@wip` while it is being built; each case it leaves implicit is a `@todo` scenario with its steps written and
no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/sue-fresh-produce-epic.md`, `.plans/mike-new-neighbourhood-epic.md`,
`.plans/discounts-plan.md`, `.plans/qa/_COMPLETE_slice-1-mike-publishes-a-new-discount.md`, the spec files it
lists (their `describe` and `it` names), `packages/sut/cucumber.js`, and
`packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`. No
implementation body was read.

## Outlined

No line is built in this slice. Every clause of the scenario is already covered by a line built for "Mike
publishes a new discount", so the scenario is expected to pass as soon as its step definitions exist; a
working-tree break of the page (hiding the store name, then the rate) shows each `Then` failing on its own,
and is restored.

| Clause | Covered by (slice 1, under `packages/sut/`) |
|---|---|
| Given Mike has published a discount on produce | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` (publishes the four pieces); `contract/discounts/post-discounts.spec.ts` (201 with the discount); `contract/discounts/discount-kept-in-postgres.spec.ts` (round-trip) |
| When Sue looks for a new store with fresh produce | `contract/discounts/get-discounts.spec.ts` (200 with every published discount); `unit/frontend/discounts/views/discounts-view/render.spec.ts` (the published discounts when the page opens); `unit/frontend/stores/discounts-store/load.spec.ts` |
| Then she finds Mike's store | `unit/frontend/discounts/components/published-discounts/render.spec.ts`: "should show its store name" |
| And she sees the discount it offers | the same file: "should show its item", "should show its rate as a percentage" |

The step definitions observe the page as someone other than Mike, in a fresh browser context. "Then she finds
Mike's store" checks the store's name only, and "And she sees the discount it offers" the item and the rate,
so each `Then` fails for its own reason.

The 10 lines below are added to four existing spec files, each in `describe` groups of their own inside the
file's top-level `describe`; no existing line is changed or removed.

## Recorded for later

10 lines stay `it.todo`, each with its `@todo` scenario; none is built in this slice.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — a discount on any item, produce or not, is listed | `contract/discounts/get-discounts.spec.ts` | `@todo` "Sue also sees discounts that are not on produce"; settled: no filter, recorded at the read only, since the page shows whatever the read answers |
| 1 — the discounts listed in the order the product promises | `contract/discounts/get-discounts.spec.ts` | `@todo` "Sue sees the discounts in order"; open product question (proposal: the order they were published, oldest first); the built scenarios assert presence, never position |
| 1 — 503 with the error schema when the discounts cannot be read | `contract/discounts/get-discounts.spec.ts` | `@todo` "Sue looks while the discounts cannot be read"; 503 is a placeholder, fixed with the exception family when the case is taken up |
| 1 — the service reports that the discounts cannot be read | `unit/backend/discounts/application/discount-service/published.spec.ts` | the same `@todo` scenario |
| 1 — the store holds that the discounts cannot be shown | `unit/frontend/stores/discounts-store/load.spec.ts` | the same `@todo` scenario |
| 2 — one short line saying the discounts cannot be shown right now and to try again; never the nothing-published line | `unit/frontend/discounts/components/published-discounts/render.spec.ts` | the same `@todo` scenario; settled: that line, distinct from the nothing-published line |
| 1 — every published discount answered when a very large number are published | `contract/discounts/get-discounts.spec.ts` | `@todo` "Sue looks when a great many discounts are published"; settled: no cap and no pagination; the size of the response is an open risk |
| 1 — every discount readable in full with the text enlarged | `unit/frontend/discounts/components/published-discounts/render.spec.ts` | `@todo` "Sue looks with her text enlarged"; open product question: accessibility as a requirement. jsdom lays nothing out, so the line moves to a real-browser level when taken up |
| 1 — each discount one entry for a screen reader | `unit/frontend/discounts/components/published-discounts/render.spec.ts` | `@todo` "Someone looks with a screen reader"; the same open question |

## Out of scope

- Showing the stores near Sue first, and how the product would know where she is: not planned; Sue judges the
  distance from the address.
- Sue finding nothing: outside this feature ("Sue finds a produce discount close to home"); the empty page is
  slice 1's one-short-line line.
- More than one store, and which discount belongs to which store: owned by "Sue finds more than one store".
- Whether the produce is fresh, and its price: Sue judges both in the store; the product holds neither.
- A store being new to Sue: the product holds no history of who looked at what (no identity).
- Long free text on the page: slice 1's open length question.
- A2 injection: the read takes no input; markup in the text shown is slice 1's built line.
- A3: no handle is read in this slice (n/a). A4: a read while a discount is being published sees it or not;
  one row is written per publish, so there is no half-written discount to see (n/a). A6: a read changes
  nothing (n/a). A1: no input (n/a). A5: the unbounded response is recorded above; the read failing is the
  dependency-failure lines.
- Time: no rule depends on a date or a clock (n/a).
- Semantic markup (the discounts as a real list): ordinary front-end code, not a rule of its own; the
  screen-reader line covers what it is for when the case is taken up.

## Invariants assumed

1. Every rule emits an event: no rule decides anything in a read (n/a).
2. One exception family → one status: the read failing is the one family, recorded with a placeholder 503.
3. Combinations: one store and one discount; no condition crosses another in this scenario (n/a).
4. Round-trip: slice 1's.
5. Schemas no stricter than `Discount`: no schema changes.
6. One line per element the view shows: slice 1's four lines (item, rate, store name, store address).
7. The names are slice 1's: `DiscountService.published()`, the discounts store, `PublishedDiscounts`,
   `GET /discounts`.
8. No identity: Sue and Mike see the same page; nothing records who looked.

## Dependencies

None new.
