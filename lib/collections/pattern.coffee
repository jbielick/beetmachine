Backbone 			= require('backbone')
_							= require('underscore')
PatternModel 	= require('../models/pattern')

class PatternCollection extends Backbone.Collection

	initialize: (models = {}, options = {}) ->
		{ @group } = options

	comparator: 'position'

	model: PatternModel

	belongsTo: 'groups'

	url: '/patterns'

	fetchRecursive: (@app, @parent, parentCallback) ->
		@fetch
			url: "/#{@belongsTo}/#{@parent.get('id')}#{@url}",
			success: (collection, models, options) =>
				parentCallback.call(@, null, models)
				# fetchTasks = []
				# @each (model) =>
				# 	fetchTasks.push (callback) =>
				# 		model.sounds.fetchRecursive @app, model.id, callback
				# async.parallel fetchTasks, parentCallback
			, group: @parent, app, @app, reset: true

module.exports = PatternCollection