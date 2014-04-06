define [
	'jquery'
	'bootstrap'
	'underscore'
	'backbone'
	'models/modal',
	'ligaments',
	'text!/js/templates/modal.ejs'
], ($, _, foundation, Backbone, ModalModel, ModalTemplate) ->
	class ModalView extends Backbone.View
		template: _.template(ModalTemplate),
		attributes:
			'class'					: 'modal fade'
		initialize: (options = {}) ->
			@model = new ModalModel(options.data)
			@render()
			new Backbone.Ligaments(model: @model, view: this)
		show: () ->
			@$el.modal('show');
		close: () ->
			@$el.modal('hide');
		render: () ->
			@el.innerHTML = @template(@model.toJSON())