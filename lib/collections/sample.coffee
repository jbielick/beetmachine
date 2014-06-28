Backbone     = require('backbone')
_            = require('underscore')
SampleModel  = require('../models/sample')

class SampleCollection extends Backbone.Collection

  initialize: (models, options = {}) ->
    { @group } = options

  model: SampleModel

  belongsTo: 'groups'

  url: '/samples'

  fetchRecursive: (@app, @parent, parentCallback) ->
    @fetch
      url: "/#{@belongsTo}/#{@parent.get('id')}#{@url}",
      success: (collection, models, options) =>
        parentCallback.call(@, null, models)
        # fetchTasks = []
        # @each (model) =>
        #   fetchTasks.push (callback) =>
        #     model.sounds.fetchRecursive model.id, callback
        # async.parallel fetchTasks, parentCallback
    , group: @parent, app, @app, reset: true

module.exports = SampleCollection