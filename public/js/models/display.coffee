define [
	'underscore'
	'backbone'
], (_, Backbone) ->
	'use strict';

	class DisplayModel extends Backbone.Model
		defaults:
			one: 'Welcome'
			time: 0
		initialize: (options) ->