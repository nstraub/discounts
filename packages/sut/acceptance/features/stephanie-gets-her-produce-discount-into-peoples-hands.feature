Feature: Stephanie gets her produce discount into people's hands

  @wip
  Scenario: Stephanie tells people what is new about her produce
    Given Stephanie has published a discount on produce
    And her discount says the produce comes from a new supplier
    When Sue looks for a new store with fresh produce
    Then she finds Stephanie's store
    And she sees what is new about its produce
    And she sees the discount it offers

  @todo
  Scenario: Sue finds a discount that says nothing new
    Given Mike has published a discount on produce
    When Sue looks for a new store with fresh produce
    Then she sees the discount it offers
    And nothing is said about what is new about it

  @todo
  Scenario: Sue sees what is new only about the store that said it
    Given Mike has published a discount on produce
    And Stephanie has published a discount on produce
    And her discount says the produce comes from a new supplier
    When Sue looks for a new store with fresh produce
    Then she sees what is new about Stephanie's produce on Stephanie's discount only

  @todo
  Scenario: Stephanie says what is new with accents and apostrophes
    When Stephanie publishes a discount that says what is new with accents and apostrophes
    Then people can see what is new exactly as she wrote it

  @todo
  Scenario: Stephanie gives only blank space for what is new
    Given Stephanie tries to publish a discount
    When she gives only blank space for what is new
    Then people can see her discount
    And nothing is said about what is new about it

  # Only a caller other than the page can send this. Not settled; the proposal beside the
  # question: the discount is not published and the caller is told what is new is not valid.
  @todo
  Scenario: What is new is sent as something other than text
    When a discount is published with something other than text for what is new
    Then it is told what is new is not valid
    And the discount is not published

  # Whether free text has a maximum length is not settled. The proposal beside the question:
  # no limit, with long text accepted and shown without breaking the page.
  @todo
  Scenario: Stephanie says more about what is new than allowed
    Given Stephanie tries to publish a discount
    When she says what is new at greater length than allowed
    Then she is told what is new is too long
    And the discount is not published

  # Anyone can publish for any store, so what a discount says reaches every visitor as it was sent.
  @todo
  Scenario: What is new is written as code
    When Stephanie publishes a discount that says what is new in text that looks like code
    Then people can see that text exactly as she wrote it, never run as code

  @todo
  Scenario: What is new names a web address
    When Stephanie publishes a discount that says what is new with a web address in it
    Then people can see the web address as plain text, never as a link

  # Whether line breaks in what is new are kept is not settled. The proposal beside the question:
  # keep them.
  @todo
  Scenario: Stephanie says what is new on several lines
    When Stephanie publishes a discount that says what is new on several lines
    Then people can see it on the lines she wrote it on

  @todo
  Scenario: A discount keeps what it says when its rate changes
    Given Stephanie has published a discount on produce
    And her discount says the produce comes from a new supplier
    When she raises its rate
    Then people can see the new rate
    And they still see what is new about its produce

  @todo
  Scenario: A change to a discount's rate carries something else to say
    Given Stephanie has published a discount on produce
    And her discount says the produce comes from a new supplier
    When a change to its rate also carries something else to say about it
    Then people can see the new rate
    And they still see that the produce comes from a new supplier
