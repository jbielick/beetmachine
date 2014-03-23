define [
	'underscore'
	'backbone'
	'models/pattern'
], (_, Backbone, PatternModel) ->

	class PatternCollection extends Backbone.Collection
		model: PatternModel