Backbone 			= require('backbone')
_							= require('underscore')

class DisplayModel extends Backbone.Model
	defaults:
		one: 'Welcome'
		time: 0
	initialize: (options) ->

module.exports = DisplayModel