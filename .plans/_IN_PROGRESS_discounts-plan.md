# Discounts: slices and releases

The slices and releases of discounts (taught by nico, 2026-09-27; slice 0 by nico, 2026-09-30). The
stories, their marks, their scenarios and the rules of each epic are in the epic files; this plan only
orders the scenarios:

1. `.plans/mike-new-neighbourhood-epic.md`
2. `.plans/sue-fresh-produce-epic.md`
3. `.plans/stephanie-comeback-epic.md`
4. `.plans/rodrigo-counts-epic.md`

## Slices and releases

A slice is one scenario: committed red, turned green, committed — each slice leaves the system stable.
A release is imagined, not shipped: the point where each user sees something new for them. The
guideline behind the plan (not a rule): no user gains more than one value in a release; value to
Stephanie counts for Rodrigo; getting a coupon and redeeming it land together ("pragmatism is the
rule here"). Scenario names below are the epic files' — the files hold their text.

Within a release the slices go left to right. Entities arrive with the first slice that needs them:
the coupon's table and migration arrive with release 3's coupon slice; a `Coupon` entity arrives only
with coupon domain logic, and always inside the Discount aggregate. Feedback is left out of this
showcase ("adding feedback would be too onerous to be worth it").

| Release | Mike | Sue | Stephanie / Rodrigo |
|---|---|---|---|
| 1 (done) | *Slice 0, the walking skeleton*, then Mike publishes a new discount | Sue finds a discount on produce | *(through Mike's slice)* |
| 2 (done) | Mike raises a discount | Stephanie tells people what is new about her produce *(one slice, value to Sue and Stephanie)* | *(same slice)* |
| 3 (done) | Mike lowers a discount | Sue finds a store close to home | Sue decides to try Stephanie's produce + Stephanie redeems a coupon *(together)* |
| 4 (done) | Mike publishes a discount at any rate up to 100% | Sue finds more than one store | Rodrigo counts the discounted sales since his last count |
| 5 (done) | Mike's earlier discounts stay published | — | A coupon counts only once |
| 6 | Mike gives an invalid rate | — | A coupon for another store's discount |
| 7 | Mike leaves out required information | — | A coupon nobody issued |
| 8 | Mike leaves out all the required information | — | A new count starts from nothing |
| 9 | Mike's other discounts keep their rates | — | Each discount is counted on its own |
| 10 | Mike gives an invalid new rate | — | Stephanie ends her discount |
| 11 | Mike leaves out the new rate | — | A coupon for a discount that has ended |
| 12 | Mike's discount cannot be published right now | — | — |

Release 3's "together" cell is two slices, 7 and 8, landing in the same release.

## Slice 0: the walking skeleton

It comes first, ships inside release 1, and its user is the developer, a first-class user. It is
independent of the first feature (neither of release 1's scenarios is the skeleton) and it is the one
slice that is not a scenario: it has no acceptance criteria. Its test is one Vitest
`describe('walking skeleton')` with a single `it('should walk')` in `packages/sut/contract/`, running
through the real page, the real backend and the real database, with a read path and a write path.
"Deploy" is a GitHub Actions workflow that calls one repository script, `scripts/ci.sh`: build, start
with `docker compose`, run the tests; where there is no remote, the same script is run locally.

Done: the page shows the latest greeting and saves a new one through the backend into Postgres; the
backend serves the built web app; `scripts/ci.sh` builds, deploys the production image and runs the
tests, and the skeleton test is `packages/sut/contract/walking-skeleton/walking-skeleton.spec.ts`. The
architecture is drawn in `docs/architecture.md`.

## The slices in order

| Slice | Release | Scenario | Epic file · story | Gains the value |
|---|---|---|---|---|
| 0 | 1 | *The walking skeleton* (no scenario), done | — | the developer |
| 1 | 1 | Mike publishes a new discount, done | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike (and Stephanie, through it) |
| 2 | 1 | Sue finds a discount on produce, done | Sue · 1. Sue finds a produce discount at a store close to home | Sue |
| 3 | 2 | Mike raises a discount, done | Mike · 2. Mike raises a discount that is not working | Mike |
| 4 | 2 | Stephanie tells people what is new about her produce, done | Stephanie · 1. Stephanie gets her produce discount into people's hands | Sue and Stephanie |
| 5 | 3 | Mike lowers a discount, done | Mike · 2. Mike raises a discount that is not working | Mike |
| 6 | 3 | Sue finds a store close to home, done | Sue · 1. Sue finds a produce discount at a store close to home | Sue |
| 7 | 3 | Sue decides to try Stephanie's produce, done | Stephanie · 1. Stephanie gets her produce discount into people's hands | Stephanie (with slice 8) |
| 8 | 3 | Stephanie redeems a coupon, done | Stephanie · 2. Stephanie takes the coupon at the till | Stephanie (with slice 7) |
| 9 | 4 | Mike publishes a discount at any rate up to 100%, done | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |
| 10 | 4 | Sue finds more than one store, done | Sue · 1. Sue finds a produce discount at a store close to home | Sue |
| 11 | 4 | Rodrigo counts the discounted sales since his last count, done | Rodrigo · 1. Rodrigo counts the store's discounted sales since he last looked | Rodrigo |
| 12 | 5 | Mike's earlier discounts stay published, done | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |
| 13 | 5 | A coupon counts only once, done | Stephanie · 2. Stephanie takes the coupon at the till | Stephanie |
| 14 | 6 | Mike gives an invalid rate, done | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |
| 15 | 6 | A coupon for another store's discount | Stephanie · 2. Stephanie takes the coupon at the till | Stephanie |
| 16 | 7 | Mike leaves out required information | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |
| 17 | 7 | A coupon nobody issued | Stephanie · 2. Stephanie takes the coupon at the till | Stephanie |
| 18 | 8 | Mike leaves out all the required information | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |
| 19 | 8 | A new count starts from nothing | Rodrigo · 1. Rodrigo counts the store's discounted sales since he last looked | Rodrigo |
| 20 | 9 | Mike's other discounts keep their rates | Mike · 2. Mike raises a discount that is not working | Mike |
| 21 | 9 | Each discount is counted on its own | Rodrigo · 1. Rodrigo counts the store's discounted sales since he last looked | Rodrigo |
| 22 | 10 | Mike gives an invalid new rate | Mike · 2. Mike raises a discount that is not working | Mike |
| 23 | 10 | Stephanie ends her discount | Stephanie · 4. Stephanie ends the discount once the lost customers are back | Stephanie |
| 24 | 11 | Mike leaves out the new rate | Mike · 2. Mike raises a discount that is not working | Mike |
| 25 | 11 | A coupon for a discount that has ended | Stephanie · 2. Stephanie takes the coupon at the till | Stephanie |
| 26 | 12 | Mike's discount cannot be published right now | Mike · 1. Mike makes his new store known with a discount on what he is famous for | Mike |

Epic files: Mike `.plans/mike-new-neighbourhood-epic.md`, Sue `.plans/sue-fresh-produce-epic.md`,
Stephanie `.plans/stephanie-comeback-epic.md`, Rodrigo `.plans/rodrigo-counts-epic.md`.
