'use strict';

define([
	'backbone',
	'collections/pattern'
], (Backbone, PatternCollection) -> 

	class PatternView extends Backbone.View

		el: '.patterns'

		initialize: (options) ->
			@app = options.parent
			@scaffold()

		scaffold: () ->
			i = 0
			cols = []
			while i < 13
				z = 0
				cols[i] = $('<div class="col col-1">')
				rows = []
				while z < 16
					if i is 0
						html = '<div data-bind="Sound.'+(z+1)+'.name" class="slot slot-label">Sound '+(z+1)+'</div>'
					else
						html = '<div class="slot">&nbsp;</div>'
					rows.push($(html))
					z++
				cols[i].append(rows)
				i++
			@$el.append(cols)

		render: () ->
			

)
