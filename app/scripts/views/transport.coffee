define [
	'jquery'
	'underscore'
	'backbone'
	'templates'
], ($, _, Backbone, JST) ->
	class TransportView extends Backbone.View
		template: JST['app/scripts/templates/transport.ejs']
		initialize: (options) ->
			@render()
		render: () ->
			@el.innerHTML = @template()
		events:
			'click [data-behavior]'			: 'delegateAction'
		delegateAction: (e) ->
			behavior = $(e.currentTarget).data('behavior')
			if this[behavior]
				e.preventDefault()
				this[behavior].call this, e
		stop: (e) ->


	new TransportView(el: '.transport')