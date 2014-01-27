define [
	'backbone'
], (Backbone) ->
	class AppRouter extends Backbone.Router
		routes: {
			''						: 'main'
		},
		main: ->

	new AppRouter()
