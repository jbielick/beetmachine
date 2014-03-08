define [
	'underscore'
	'backbone'
], (_, Backbone) ->
	'use strict';

	class ModalModel extends Backbone.Model
		defaults:
			cancel: true
			action: true
			title: ''
			body: ''