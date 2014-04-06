define [
	'backbone'
	'views/app'
	'views/pads'
], (Backbone, App, Pads) ->

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
