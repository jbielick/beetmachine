'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'collections/sample'
	'collections/pattern'
], (_, Backbone, deepmodel, SampleCollection, PatternCollection) ->

	class GroupModel extends Backbone.DeepModel

		initialize: (attrs = {}, options = {}) ->
			{ @app, @pads } = options.collection
			@samples = new SampleCollection attrs.samples || [{pad: 1}], group: @
			@patterns = new PatternCollection attrs.patterns || [{position: 1}], group: @

		url: () ->
			if @isNew() && @get('recipe_id')
				return "/recipes/#{@get('recipe_id')}/groups"
			else
				if @isNew()
					return "/groups"
				else
					return "/groups/#{@get('id')}"