Backbone 			= require('backbone')
_							= require('underscore')

class AppRouter extends Backbone.Router
	routes: {
		''						: 'main'
		'pad/:num'		: 'soundEditor'
		'beet/:id'		: 'open'
	}

	initialize: (options) ->
		{ @app } = options

	main: ->

	soundEditor: (padNumber) ->
		
	open: (id) ->
		console.log('open '+id)

module.exports = AppRouter