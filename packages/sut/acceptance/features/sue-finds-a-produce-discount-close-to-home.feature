Feature: Sue finds a produce discount close to home

  Scenario: Sue finds a discount on produce
    Given Mike has published a discount on produce
    When Sue looks for a new store with fresh produce
    Then she finds Mike's store
    And she sees the discount it offers

  @todo
  Scenario: Sue also sees discounts that are not on produce
    Given Mike has published a discount on spices
    When Sue looks for a new store with fresh produce
    Then she sees the discount on spices too

  # The order the discounts appear in is not settled. The proposal beside the question:
  # the order they were published, oldest first.
  @todo
  Scenario: Sue sees the discounts in order
    Given Mike and Stephanie have published discounts on produce
    When Sue looks for a new store with fresh produce
    Then she sees their discounts in the order the page promises

  @todo
  Scenario: Sue looks while the discounts cannot be read
    Given discounts cannot be read right now
    When Sue looks for a new store with fresh produce
    Then she is told the discounts cannot be shown right now and to try again

  # Every published discount is shown, with no cap and no pages, so what Sue loads grows with
  # every discount anyone publishes.
  @todo
  Scenario: Sue looks when a great many discounts are published
    Given a great many discounts have been published
    When Sue looks for a new store with fresh produce
    Then she sees every one of them

  # Whether accessibility is a requirement is not settled. The proposal beside the question:
  # adopt it, with the bar it must meet set as part of that decision.
  @todo
  Scenario: Sue looks with her text enlarged
    Given Sue reads with her text enlarged
    When Sue looks for a new store with fresh produce
    Then she can read every discount in full

  @todo
  Scenario: Someone looks with a screen reader
    When someone using a screen reader looks for a new store with fresh produce
    Then they hear each discount with its store

  Scenario: Sue finds a store close to home
    Given Mike's store is within walking distance of Sue's home
    When Sue looks for a new store with fresh produce
    Then she finds Mike's store
    And she sees where it is
    And she sees the discount it offers

  # Where a store is, not its name, is what tells two stores of the same name apart.
  @todo
  Scenario: Sue tells apart two stores with the same name by where they are
    Given two stores with the same name at different addresses have published discounts on produce
    When Sue looks for a new store with fresh produce
    Then she sees where each of them is, on its own discount
