Backbone 			= require('backbone')
_							= require('underscore')

class ModalModel extends Backbone.Model
	defaults:
		cancel: true
		action: true
		title: ''
		body: ''