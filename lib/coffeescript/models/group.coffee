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
			@sounds = new SoundCollection attrs.sounds, group: @
			@patterns = new PatternCollection attrs.patterns || {}, app: @app, pads: @pads, group: @
			@currentPattern = @patterns.at(0)

		enable: (patternNumber) ->
			if patternNumber
				@currentPattern = @patterns.findWhere(position: patternNumber)

			@currentPattern.view.$el.show()


		toJSON: () ->
			shallow = _.extend({}, @attributes)
			# shallow.patterns = @patterns.toJSON()
			# shallow.sounds = @sounds.toJSON()
			deep = shallow
			return deep

		url: () ->
			if @get('recipe_id')
				return "/recipes/#{@get('recipe_id')}/groups"
			else
				return "/groups"