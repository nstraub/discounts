# Brief: Rodrigo checks the discount's numbers himself (epic and its stories)

cwd: ~/src/discounts

The epic of Stephanie's boss. Written by the dev-team orchestrator from nico's guideline (2026-09-27),
as practice for interviewing a real user. It exists because slicing showed a symptom: one release
carried three stories that depended on each other, and counting — Stephanie's story 3 — was never her
need but her boss's, done by her on his behalf. The other epics: `.plans/mike-new-neighbourhood-epic.md`,
`.plans/sue-fresh-produce-epic.md`, `.plans/stephanie-comeback-epic.md`.

## nico's guideline (verbatim)

> I think we're missing an epic, release 3 is too large, and the fact that 3 stories depend on each
> other is a symptom that we aren't splitting them right. how about introducing Stephanie's boss to
> the app, and having him count the coupons

## The epic

Rodrigo owns the grocery store Stephanie runs, and two more in nearby neighbourhoods. He does not work
the till any more; he spends his week going over each store's numbers. When Stephanie told him the
produce had to change supplier he agreed, but the new supplier costs more, and every week he checks
whether produce sales are rising enough to pay for it. Now she wants to give part of that produce away
as a discount. He said yes, on one condition: he wants to see for himself, every week, how many of the
store's sales included the discount. Until now that number came from Stephanie's tally, counted from a
jar of paper vouchers. He trusts Stephanie, but it is his money, and a number he can check himself is
one he does not have to take on anyone's word. He does not care when a coupon was used or by whom —
only how many, discount by discount, since he last looked.

Invented by the orchestrator, beyond the guideline (flagged to nico, who kept the draft): his name, his
two other stores, that he no longer works the till, that he would rather check the number himself than
trust the jar.

Rules (nico, 2026-09-27, carried over from Stephanie's epic): the count is per discount; a count covers
everything since the last count and restarts for all of the store's discounts; when or by whom
a coupon was redeemed is not counted. Anyone can act for any store (`docs/adr/0002-anyone-can-act-for-any-store.md`).
For release planning, value to Stephanie counts for Rodrigo.

## The stories

### 1. Rodrigo counts the store's discounted sales since he last looked — solve

```gherkin
Feature: Rodrigo counts the discounted sales

  Scenario: Rodrigo counts the discounted sales since his last count
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo counts the discounted sales
    Then he sees 3 discounted sales for that discount

  Scenario: A new count starts from nothing
    Given Rodrigo has just counted Stephanie's discounted sales
    When Rodrigo counts them again
    Then he sees no discounted sales

  Scenario: Each discount is counted on its own
    Given Stephanie has discounts on fruit and on vegetables
    And Sue has used a coupon for each since Rodrigo's last count
    When Rodrigo counts the discounted sales
    Then he sees 1 discounted sale for each discount
```

### 2. Rodrigo checks whether produce sales pay for the new supplier — told, not solved

His weekly look at the numbers; the discount count is one input to it.
