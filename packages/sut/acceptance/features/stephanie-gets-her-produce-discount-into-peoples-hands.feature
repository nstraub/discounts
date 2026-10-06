Feature: Stephanie gets her produce discount into people's hands

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

  Scenario: Sue decides to try Stephanie's produce
    Given Sue has found Stephanie's discount on produce
    When Sue decides to try it
    Then she gets a coupon to use at Stephanie's till

  @todo
  Scenario: Sue's coupon says where to use it and what it is for
    Given Sue has found Stephanie's discount on produce
    When Sue decides to try it
    Then her coupon shows the address of Stephanie's store
    And it shows the item it is for

  @todo
  Scenario: Sue decides to try the same discount twice
    Given Sue has got a coupon for Stephanie's discount
    When Sue decides to try it again
    Then she gets a second coupon, different from the first

  @todo
  Scenario: Sue's decision to try a discount arrives twice
    Given Sue has found Stephanie's discount on produce
    When Sue decides to try it and her decision arrives twice
    Then she gets one coupon

  # How Sue brings her coupon to the till is a question for Sue that is still open.
  @todo
  Scenario: Sue still has her coupon when she comes back to the page
    Given Sue has got a coupon for Stephanie's discount
    When Sue looks for a new store with fresh produce again
    Then she still sees her coupon

  @todo
  Scenario: Sue cannot get a coupon right now
    Given Sue has found Stephanie's discount on produce
    And coupons cannot be given right now
    When Sue decides to try it
    Then she is told she could not get a coupon and to try again
    And no coupon is given

  @todo
  Scenario: A coupon is asked for a discount that does not exist
    When a coupon is asked for a discount that does not exist
    Then it is told there is no such discount
    And no coupon is given

  # The code is all a coupon is, so whoever sees it can use it.
  @todo
  Scenario: Nobody else sees Sue's coupon
    Given Sue has got a coupon for Stephanie's discount
    When someone else looks for a new store with fresh produce
    Then they do not see Sue's coupon

  # Anyone can get a coupon without an account, so nothing stands in the way of taking coupons by
  # the thousand but a limit on speed.
  @todo
  Scenario: Someone takes coupons far faster than anyone would
    When someone gets coupons far faster than anyone deciding to try a discount would
    Then they are slowed down
