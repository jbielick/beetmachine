define [
	'jquery'
	'underscore'
	'backbone'
	'text!/scripts/templates/transport.ejs'
], ($, _, Backbone, TransportTemplate) ->
	class TransportView extends Backbone.View
		template: _.template TransportTemplate
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