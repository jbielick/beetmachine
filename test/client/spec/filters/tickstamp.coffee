'use strict'

describe 'Filter: tickstamp', () ->

  # load the filter's module
  beforeEach module 'beetmachine'

  # initialize a new instance of the filter before each test
  tickstamp = {}
  beforeEach inject ($filter) ->
    tickstamp = $filter 'tickstamp'

  it 'should return the input prefixed with "tickstamp filter:"', () ->
    text = 'angularjs'
    expect(tickstamp text).toBe ('tickstamp filter: ' + text)
