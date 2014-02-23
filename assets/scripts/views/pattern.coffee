'use strict';

define([
	'backbone',
	'collections/pattern'
], (Backbone, PatternCollection) -> 

	class PatternView extends Backbone.View

		initialize: (options) ->
			@app = options.parent
			@collection = new PatternCollection options.patterns
			@app.sequence = @collection

)
