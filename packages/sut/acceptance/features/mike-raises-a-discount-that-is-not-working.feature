Feature: Mike raises a discount that is not working

  @wip
  Scenario: Mike raises a discount
    Given Mike has published a discount on an item
    When he raises its rate
    Then people can see the new rate immediately

  @todo
  Scenario: Mike raises a discount again
    Given Mike has published a discount on an item
    And he has raised its rate
    When he raises its rate again
    Then people can see the latest rate immediately

  @todo
  Scenario: Mike changes a discount to the rate it already has
    Given Mike has published a discount on an item
    When he changes its rate to the rate it already has
    Then people can see it at that rate
    And he is told nothing about it

  @todo
  Scenario: Mike gives only blank space for the new rate
    Given Mike has published a discount on an item
    And he tries to change its rate
    When he gives only blank space for the rate
    Then he is told the rate is missing
    And the discount keeps its previous rate

  @todo
  Scenario: Mike gives a new rate that is not a number
    Given Mike has published a discount on an item
    And he tries to change its rate
    When he gives a rate that is not a number
    Then he is told the rate is not valid
    And the discount keeps its previous rate

  @todo
  Scenario: Mike changes a discount that does not exist
    When Mike changes the rate of a discount that does not exist
    Then he is told there is no such discount
    And no discount changes

  @todo
  Scenario: Mike's new rate cannot be kept right now
    Given Mike has published a discount on an item
    And discounts cannot be changed right now
    When he raises its rate
    Then he is told it could not be changed and to try again
    And the discount keeps its previous rate

  # Anyone can act for any store, so two people may change one discount at the same moment; the
  # last change to arrive is the one that holds.
  @todo
  Scenario: Two changes to one discount arrive at once
    Given Mike has published a discount on an item
    When two changes to its rate arrive at the same moment
    Then people can see one of the two new rates, whole

  @todo
  Scenario: Mike raises a discount from a page that is out of date
    Given Mike has published a discount on an item
    And its rate has been changed since Mike's page was loaded
    When he raises its rate from that page
    Then people can see the rate Mike gave

  @todo
  Scenario: A change to a discount's rate carries other information
    Given Mike has published a discount on an item
    When a change to its rate also carries another item, store name and address
    Then people can see the new rate
    And the discount keeps its item, store name and address

  # Anyone can change any discount without an account, so nothing stands in the way of a flood of
  # changes but a limit on speed.
  @todo
  Scenario: Someone floods the discounts with changes
    When someone changes discounts far faster than any store owner would
    Then they are slowed down
    And people can still see every discount as it was before the flood
