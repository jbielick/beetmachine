'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'collections/sound'
	'collections/pattern'
], (_, Backbone, deepmodel, SoundCollection, PatternCollection) ->

	class GroupModel extends Backbone.DeepModel

		initialize: (attrs = {}, options = {}) ->
			{ @app, @pads } = options.collection
			@sounds = new SoundCollection attrs.sounds || [{pad: 1}], group: @
			@patterns = new PatternCollection attrs.patterns || [{position: 1}], group: @

		url: () ->
			if @isNew() && @get('recipe_id')
				return "/recipes/#{@get('recipe_id')}/groups"
			else
				if @isNew()
					return "/groups"
				else
					return "/groups/#{@get('id')}"