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
			@app = options.parent
			@buildSequence()

		

		buildSequence: () ->
			i = 0
			cols = []
			while i < 13
				z = 0
				cols[i] = $('<div class="col col-1">')
				rows = []
				while z < 8
					if i is 0
						html = '<div class="slot slot-label">Group '+(z+1)+'</div>'
					else
						html = '<div class="slot">&nbsp;</div>'
					rows.push($(html))
					z++
				cols[i].append(rows)
				i++
			@$el.append(cols)