define [
	'underscore'
	'backbone'
	'models/sound'
	'async'
], (_, Backbone, SoundModel, async) ->

	class SoundCollection extends Backbone.Collection

		initialize: (models, options = {}) ->
			{ @group } = options

		model: SoundModel

		belongsTo: 'groups'

		url: '/sounds'

		fetchRecursive: (@app, @parent, parentCallback) ->
			@fetch
				url: "/#{@belongsTo}/#{@parent.get('id')}#{@url}",
				success: (collection, models, options) =>
					parentCallback.call(@, null, models)
					# fetchTasks = []
					# @each (model) =>
					# 	fetchTasks.push (callback) =>
					# 		model.sounds.fetchRecursive model.id, callback
					# async.parallel fetchTasks, parentCallback
			, group: @parent, app, @app, reset: true