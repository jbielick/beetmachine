define [
	'jquery'
	'bootstrap'
	'underscore'
	'backbone'
	'templates'
	'models/modal',
	'ligaments'
], ($, _, foundation, Backbone, JST, ModalModel) ->
	class ModalView extends Backbone.View
		template: JST['app/scripts/templates/modal.ejs']
		attributes:
			'class'					: 'modal fade'
		initialize: (options) ->
			options or options = {}
			@model = new ModalModel(options.data)
			@render()
			new Backbone.Ligaments(model: @model, view: this)
		show: () ->
			@$el.modal('show');
		close: () ->
			@$el.modal('hide');
		render: () ->
			@el.innerHTML = @template(@model.toJSON())