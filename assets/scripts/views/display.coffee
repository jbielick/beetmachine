define [
	'jquery'
	'underscore'
	'backbone'
	'models/display'
	'ligaments',
	'text!/scripts/templates/display.ejs'
], ($, _, Backbone, DisplayModel, ligaments, DisplayTemplate) ->
	class DisplayView extends Backbone.View
		template: _.template(DisplayTemplate),
		initialize: (options) ->
			@model = new DisplayModel()
			@render()
			@$canvas = this.$('#waveform')
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