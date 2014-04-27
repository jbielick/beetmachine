Backbone 				= require('backbone')
Backbone.$			= require('jquery')
Ligament 				= require('backbone-ligaments')
_								= require('underscore')
ModalModel 			= require('../models/modal')
ModalTemplate 	= require('../templates/modal')

class ModalView extends Backbone.View

	template: ModalTemplate

	attributes:
		'class'					: 'modal fade'

	initialize: (options = {}) ->
		@model = new ModalModel(options.data)
		@render()
		new Ligament(model: @model, view: this)

	show: () ->
		@$el.modal('show');
	close: () ->
		@$el.modal('hide');
	render: () ->
		@el.innerHTML = @template(@model.toJSON())

module.exports = ModalView