'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'views/pattern.grid'
], (_, Backbone, deepmodel, PatternGridView) ->

	class PatternModel extends Backbone.DeepModel

		defaults: () ->
			attrs = 
				triggers: {}
				len: 4
				position: 1
				zoom: 2
				step: 64

		url: () ->
			if @isNew() && @get('groupId')
				return "/groups/#{@get('groupId')}/patterns"
			else
				if @isNew()
					return "/patterns"
				else
					return "/patterns/#{@get('id')}"

		initialize: (attrs = {}, options = {}) ->
			@view = new PatternGridView model: @

		toJSON: ->
			attrs = _.deepClone @attributes
			attrs.zoom = parseInt(attrs.zoom, 10) || 2
			attrs.step = parseInt(attrs.step, 10) || 64
			attrs