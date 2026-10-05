# Brief: Stephanie wins her produce customers back (epic and its stories)

cwd: ~/src/discounts

The store owner's epic, the one that brings coupons into the product. Written by the dev-team
orchestrator from nico's guidelines (2026-09-27), as practice for interviewing a real user; nico played
Stephanie. Stories are system-agnostic; whether our software solves a story is marked on it. The other
epics: `.plans/mike-new-neighbourhood-epic.md`, `.plans/sue-fresh-produce-epic.md`.

## nico's guidelines (verbatim)

> meet Stephanie, a Venezuelan immigrant that has been living in Chile for the better part of 10
> years, and runs one of the other stores in Mike's neighbourhood. She has seen produce sales drop, and
> has heard comments about the lack of quality in her produce. after changing suppliers, she needs to
> make a comeback, and a discount is part of her multi-tiered strategy to get to where she needs to be

> one more thing: she has a boss, and the boss is looking at her very closely, after changing
> suppliers increased the cost. this gives her a reason to want to track coupons precisely

## The epic

Stephanie came to Chile from Venezuela almost ten years ago, and for the last six she has run a grocery
store in the neighbourhood for its owner, two blocks from where Mike is opening his. She learnt the
trade in Chile and stocks what her customers ask for — Chilean spices and herbs, the staples, and
produce. The produce was the part that went wrong: the supplier's quality slipped, sales of fruit and
vegetables dropped month after month, and at the till she started hearing it — the tomatoes are
floury, the lettuce doesn't last. Three weeks ago she changed suppliers. The produce is good now, but it
costs more, and her boss has been looking at every number since. The people who stopped buying produce
don't know it has changed, and some of them now walk further to shop somewhere else. With the Peruvian
store opening down the street, she can't wait for word of mouth to fix it. So she has a plan in
several parts: the new supplier is the first; the produce now sits at the front of the store, where
people can see it from the street; she has asked her regular customers to tell their neighbours; and
there is a discount on fruit and vegetables, to get the people who left to come back and try it. When
she ran a discount years ago, she printed small paper vouchers and handed them out on the street; every
voucher that came back to the till went into a jar, and on Saturday nights she counted them. This time
counting the jar is not enough. Her boss is already paying more for the produce, and now she is asking
him to give part of it away as well. She has to show him, precisely, how many people the discount
brought back and what it cost — or the discount is the first part of the plan to go, and maybe the new
supplier after it.

Invented by the orchestrator, beyond the guidelines (flagged to nico): the paper vouchers and the jar;
the other parts of the plan (produce at the front, regulars spreading the word); Mike's opening as the
urgency; the numbers (six years, three weeks, two blocks, Saturday nights); the risk to the supplier.

## What Stephanie told us (verbatim, nico playing Stephanie, 2026-09-27)

1. What success looks like: "the increased cost is being weighed against the amount of produce
   purchased. it will have succeeded when I get the customers we lost back, and the discount should
   last at least until then"
2. Who she wants in the store: "I don't really care who comes. I would like to see the familiar faces
   again, but I'm happy as long as I can make up for the increase in cost"
3. What "precisely" means: "I give my boss a weekly tally with the amount of stock sold, and the total
   amount of revenue each SKU drove. my boss is adamant in knowing how many of those sales included a
   discount, but they don't care when each coupon was redeemed"

Decisions (nico, 2026-09-27): the count is per discount — she maps it to her SKUs herself; a count
covers everything since her last count; she can end a discount. A coupon exists to make a discounted
sale countable: single-use (one coupon, one sale — the voucher in the jar), identified by its token
alone, never linked to anyone. No expiry: no persona has asked for one. A discount may carry a hook —
one optional free-text field where the store says why it is worth a look ("whatever fixes stephanie's
problem, and is the cheapest to implement"). Ending a discount stops new coupons and refuses the ones
already handed out. A count restarts for all of the store's discounts (the count is Rodrigo's — see his epic). Anyone can act for any store — there is no
store key and no identity; "her store" is the store the person at the till says they are at (nico,
2026-09-27, after the question was raised and discussed; `docs/adr/0002-anyone-can-act-for-any-store.md`).

## The stories

### 1. Stephanie gets her produce discount into people's hands — solve

She publishes the discount and says why it is worth a look — the produce comes from a new supplier —
so that anyone, old customer or new, comes to try it. Whoever decides to try it gets a coupon, which is
her voucher.

```gherkin
Feature: Stephanie gets her produce discount into people's hands

  Scenario: Stephanie tells people what is new about her produce
    Given Stephanie has published a discount on produce
    And her discount says the produce comes from a new supplier
    When Sue looks for a new store with fresh produce
    Then she finds Stephanie's store
    And she sees what is new about its produce
    And she sees the discount it offers

  Scenario: Sue decides to try Stephanie's produce
    Given Sue has found Stephanie's discount on produce
    When Sue decides to try it
    Then she gets a coupon to use at Stephanie's till
```

### 2. Stephanie takes the coupon at the till — solve

A coupon is taken once, and it has to be one of hers.

```gherkin
Feature: Stephanie takes the coupon at the till

  Scenario: Stephanie redeems a coupon
    Given Sue has a coupon for Stephanie's discount
    When Sue uses it at Stephanie's store
    Then Stephanie is told the discount applies

  Scenario: A coupon counts only once
    Given Sue has used her coupon at Stephanie's store
    When Sue tries to use it again
    Then Stephanie is told it has already been used

  Scenario: A coupon for another store's discount
    Given Sue has a coupon for Mike's discount
    When Sue tries to use it at Stephanie's store
    Then Stephanie is told it is not for her store

  Scenario: A coupon for a discount that has ended
    Given Sue has a coupon for Stephanie's discount
    And Stephanie has ended the discount
    When Sue uses it at Stephanie's store
    Then Stephanie is told the discount has ended

  Scenario: A coupon nobody issued
    Given Stephanie is taking a coupon at the till
    When the coupon was never issued
    Then Stephanie is told it is not valid
```

### 3. Stephanie counts the discounted sales for her boss's weekly tally — moved

Counting became her boss Rodrigo's own story (nico, 2026-09-27): `.plans/rodrigo-counts-epic.md`.
It was never Stephanie's need but his, done by her on his behalf.

### 4. Stephanie ends the discount once the lost customers are back — solve

```gherkin
Feature: Stephanie ends her discount

  Scenario: Stephanie ends her discount
    Given Stephanie has published a discount on produce
    When she ends it
    Then nobody can get a new coupon for it
```

### 5. Stephanie writes her boss's weekly tally (stock sold, revenue per SKU) — told, not solved

It comes from her till and her stock; our count feeds it.

### 6. Stephanie's other moves — told, not solved

The new supplier, the produce at the front, the regulars spreading the word.
