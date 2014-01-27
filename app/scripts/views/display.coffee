define [
	'jquery'
	'underscore'
	'backbone'
	'templates'
	'models/display'
	'ligaments'
], ($, _, Backbone, JST, DisplayModel) ->
	class DisplayView extends Backbone.View
		template: JST['app/scripts/templates/display.ejs']
		initialize: (options) ->
			@model = new DisplayModel()
			@render()
			new Backbone.Ligaments(model: @model, view: @)
		log: (options) ->
			if typeof options is 'string'
				message = options
			else
				message = options.message
			@model.messages.add(message: message)
			@render()
		render: () ->
			@el.innerHTML = @template(@model.toJSON())
			@$el.scrollTop(@$el.outerHeight())

	new DisplayView(el: '.display')