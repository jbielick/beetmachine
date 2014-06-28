define [
	'underscore'
	'backbone'
	'models/sample'
	'async'
], (_, Backbone, SampleModel, async) ->

	class SampleCollection extends Backbone.Collection

		initialize: (models, options = {}) ->
			{ @group } = options

		model: SampleModel

		belongsTo: 'groups'

		url: '/sampless'

		fetchRecursive: (@app, @parent, parentCallback) ->
			@fetch
				url: "/#{@belongsTo}/#{@parent.get('id')}#{@url}",
				success: (collection, models, options) =>
					parentCallback.call(@, null, models)
					# fetchTasks = []
					# @each (model) =>
					# 	fetchTasks.push (callback) =>
					# 		model.sampless.fetchRecursive model.id, callback
					# async.parallel fetchTasks, parentCallback
			, group: @parent, app, @app, reset: true