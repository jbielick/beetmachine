Backbone 							= require('backbone')
Backbone.NestedModel 	= require('backbone-nested').NestedModel
_											= require('underscore')
$ 										= require('jquery')
PatternGridView	 			= require('../views/pattern.grid')

class PatternModel extends Backbone.NestedModel

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
		attrs = $.extend {}, @attributes
		attrs.zoom = parseInt(attrs.zoom, 10) || 2
		attrs.step = parseInt(attrs.step, 10) || 64
		attrs

module.exports = PatternModel