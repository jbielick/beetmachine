'use strict';

define([
	'backbone'
	'ligaments'
	'text!/js/templates/sequence.ejs'
], (Backbone, ligaments, SequenceTemplate) ->

	class SequenceView extends Backbone.View

		el: '.sequence'

		template: _.template SequenceTemplate

		initialize: (options) ->
			@render()

		render: () ->
			@$el.html(@template())

	new SequenceView()

)
