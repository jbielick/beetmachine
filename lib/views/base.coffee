Backbone      = require('backbone')
Backbone.$    = require('jquery')
_             = require('underscore')

class BaseView extends Backbone.BaseView

  constructor: () ->
    @events = _.extend(@events || {}, super::events)
    super.initialize()

  events:
    'click [data-behavior]': 'delegateBehavior'

  delegateBehavior: (e) ->
    behavior = $(e.currentTarget).data 'behavior'
    meta = $(e.currentTarget).data 'meta'
    if behavior? and _.isFunction @[behavior]
      @[behavior].call(@, e, meta)