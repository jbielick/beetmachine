define [
	'underscore'
	'backbone'
	'collections/message'
], (_, Backbone, MessageCollection) ->
	'use strict';

	class DisplayModel extends Backbone.Model
		defaults:
			one: 'Welcome'
		initialize: (options) ->
			@messages = new MessageCollection()
		toJSON: () ->
			data = @attributes
			data.messages = @messages.toJSON()
			data