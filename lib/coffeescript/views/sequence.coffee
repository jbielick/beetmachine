'use strict';

define [
	'jquery'
	'underscore'
	'backbone'
	'text!/js/templates/sequence.ejs'
], ($, _, Backbone, SequenceTemplate) ->

	class SequenceView extends Backbone.View

		template: _.template SequenceTemplate

		el: '.sequence'

		initialize: (options) ->
			{ @app } = options
			@buildSequence()

		buildSequence: ->
			column = 0
			cols = []
			while column < 13
				row = 0
				cols[column] = $('<div class="col col-1">')
				rows = []
				while row < 8
					if column is 0
						html = '<div class="slot slot-label">Group ' + ( row + 1 ) + '</div>'
					else
						html = '<div class="slot">&nbsp;</div>'
					rows.push($(html))
					row++
				cols[column].append(rows)
				column++
			@$el.append(cols)