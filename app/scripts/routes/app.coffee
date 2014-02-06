define [
	'backbone'
], (Backbone, App) ->
	class AppRouter extends Backbone.Router
		routes: {
			''						: 'main'
			'pad/:num'		: 'soundEditor'
		},
		main: ->

		soundEditor: (padNumber) ->
			

	new AppRouter()
