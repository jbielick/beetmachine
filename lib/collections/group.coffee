Backbone 		= require('backbone')
_						= require('underscore')
GroupModel 	= require('../models/group')
async 			= require('async')

class GroupCollection extends Backbone.Collection

	model: GroupModel

	comparator: 'position'

	url: '/groups'

	belongsTo: 'recipes'

	initialize: (attrs = {}, options = {}) ->
		{ @app } = options

	fetchRecursive: (@app, @parent, parentCallback) ->
		@fetch
			url: "/#{@belongsTo}/#{@parent.get('id')}#{@url}",
			success: (collection, models, options) =>
				fetchTasks = []
				@each (model) =>
					fetchTasks.push (callback) =>
						model.sounds.fetchRecursive @app, model, callback
					fetchTasks.push (callback2) =>
						model.patterns.fetchRecursive @app, model, callback2
				async.parallel fetchTasks, parentCallback
		, reset: true

module.exports = GroupCollection