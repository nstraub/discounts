Feature: Mike publishes a discount on what he is famous for

  Scenario: Mike publishes a new discount
    When Mike publishes a discount on an item
    Then people can see it immediately

  @todo
  Scenario Outline: Mike leaves out required information by giving only blank space
    Given Mike tries to publish a discount
    When he gives only blank space for <information>
    Then he is told <information> is missing
    And the discount is not published

    Examples:
      | information              |
      | the item it applies to   |
      | the rate                 |
      | the name of his store    |
      | the address of his store |

  # Whether free text has a maximum length is not settled. The proposal beside the question:
  # no limit, with long text accepted and shown without breaking the page.
  @todo
  Scenario Outline: Mike gives information longer than allowed
    Given Mike tries to publish a discount
    When he gives <information> longer than allowed
    Then he is told <information> is too long
    And the discount is not published

    Examples:
      | information              |
      | the item it applies to   |
      | the name of his store    |
      | the address of his store |

  @todo
  Scenario: Mike publishes a discount written with accents and apostrophes
    When Mike publishes a discount whose item and store are written with accents and apostrophes
    Then people can see it exactly as he wrote it

  @todo
  Scenario: Mike publishes the same discount twice
    Given Mike has published a discount on an item
    When he publishes the same discount again
    Then people can see it twice

  # How a publish that arrives twice is recognised is not settled.
  @todo
  Scenario: Mike's publishing arrives twice
    When Mike publishes a discount on an item and his publishing arrives twice
    Then people can see it once

  # Not built yet: the page showing a discount its publisher has just published without being
  # loaded again.
  @todo
  Scenario: Mike sees the discount he has just published
    When Mike publishes a discount on an item
    Then he can see it without looking again

  # An open risk: nothing yet limits how fast anyone can publish.
  @todo
  Scenario: Someone floods the page with discounts
    When someone publishes discounts far faster than any store owner would
    Then they are slowed down
    And people can still see every discount published before
