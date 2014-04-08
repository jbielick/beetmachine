'use strict';

define [
	'jquery'
	'underscore'
	'backbone'
	'text!/js/templates/sequence.ejs'
], ($, _, Backbone, SequenceTemplate) ->

	SLOT_LABEL_CLASSES 				= 'slot slot-label'
	SLOT_COL_CLASSES					= 'col col-1'
	SLOT_CLASSES							= 'slot'

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
				cols[column] = $("<div class=\"#{SLOT_COL_CLASSES}\">")
				rows = []
				while row < 8
					if column is 0
						html = "<div class=\"#{SLOT_CLASSES}\">Group #{row + 1}</div>"
					else
						html = "<div class=\"#{SLOT_CLASSES}\">&nbsp;</div>"
					rows.push($(html))
					row++
				cols[column].append(rows)
				column++
			@$el.append(cols)