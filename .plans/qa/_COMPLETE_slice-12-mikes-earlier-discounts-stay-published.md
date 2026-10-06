# Slice 12: Mike's earlier discounts stay published — red-test outline

The acceptance criterion is the scenario "Mike's earlier discounts stay published" of story 1 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the epic's rule that a published discount is visible
immediately. Its text, and the one case it leaves implicit, are appended to
`packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`: the scenario
carries `@wip` while it is red; the case it leaves implicit is a `@todo` scenario with its steps written and no
step definitions.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, the feature of story 1 and the outline of "Mike
publishes a discount at any rate up to 100%" appended to it, the step definitions of
`acceptance/features/steps/mike-{publishes,raises}-a-discount.steps.ts`, the method names of
`acceptance/support/discounts-page.ts`, the exports of `packages/sut/support/example-discounts.ts`, and the
`describe` and `it` names of every spec that lists, keeps or shows several discounts. No implementation body
was read.

## Outlined

1 `it.todo` line, added inside the top-level `describe` of an existing spec file in a group of its own; no
existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 1 — an earlier discount and its coupons, redeemed, unused and counted, left as they were when another discount is kept | keeping a discount writes its coupons with it, so a write scoped wrongly would take another discount's coupons with it; `@todo` "Mike's earlier discount keeps its coupons when he publishes another" is its acceptance-level record | database-testing (state); edge-case-discovery (combination: an earlier discount with coupons × a new one kept) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |

The scenario asks for no new behaviour: every layer already pins that publishing adds a discount beside the
ones published before —
- `unit/backend/discounts/application/discount-service/publish.spec.ts`: "should keep the discount Mike
  publishes among the published discounts";
- `contract/discounts/published-discounts-in-postgres.spec.ts`: "should list every kept discount";
- `contract/discounts/get-discounts.spec.ts`: "should answer 200 with every published discount as JSON";
- `unit/frontend/stores/discounts-store/load.spec.ts`: "should hold every discount published";
- `unit/frontend/discounts/components/published-discounts/render.spec.ts`: "should show one entry per discount
  when several are published".

So the scenario is expected to pass as soon as its step definitions exist, with no production code. It is
committed passing; its report shows a working-tree break that proves it can fail (a line of production code
changed, the failing run with its exit code, and the revert). The line above is expected to pass at once too,
and is committed with the same proof.

The step definitions: "Given Mike has published a discount on an item" is the existing step; "When Mike
publishes a discount on another item" publishes, through Mike's page, a second discount of Mike's store on
another item, a new example beside `spicesDiscount` in `@sut/support/example-discounts`; "Then people can see
both" opens someone else's page and checks each of the two discounts on its own entry. The example values stay
out of the Gherkin.

## Out of scope

- Mike publishing the same discount twice, his publish arriving twice, seeing his discount without looking
  again, a flood of discounts, a great many discounts, the order they are shown in: each already a `@todo`
  scenario of its own.
- An earlier discount keeping its rate when another is changed: owned by "Mike's other discounts keep their
  rates".
- An earlier discount of another store: the same behaviour as one of Mike's; the store plays no part in
  publishing.
- Rates published before the rate rules: owned by "Mike gives an invalid rate" (settled).
- Two discounts published at the same moment: pinned by `contract/discounts/post-discounts.spec.ts`, "should keep
  both of two discounts published at the same moment" (A4).
- A1, A2, A3, A5, A6: the scenario adds no input, sink, handle or rule; the publish lines already cover them (n/a).
- Time: no rule depends on a date or a clock (n/a).

## Invariants assumed

1. Every rule emits an event: publishing raises `DiscountPublished` (existing lines); no new rule.
2. One exception family → one status: no new family (n/a).
3. Combinations: an earlier discount, with or without coupons, × another discount kept. Other conditions give
   no distinct outcome.
4. Round-trip: existing lines; the line above checks the other discount, not the one kept.
5. Schemas no stricter than the domain: no schema changes (n/a).
6. One line per element the view shows: no new element (n/a).
7. One aggregate per transaction: keeping one Discount writes only that Discount and its coupons.
8. No identity: nothing records who published.

## Dependencies

None new.
