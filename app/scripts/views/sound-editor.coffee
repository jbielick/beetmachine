define [
	'jquery'
	'bootstrap'
	'underscore'
	'backbone'
	'ligaments'
	'templates'
], ($, bootstrap, _, Backbone, ligaments, JST) ->
	class SoundEditorView extends Backbone.View
		template: JST['app/scripts/templates/sound-editor.ejs']
		attributes:
			'class'					: 'modal fade'
		initialize: (options) ->
			@model = options.model
			@render()
			new Backbone.Ligaments(model: @model, view: @)

		show: () ->
			@$el.modal('show')

		hide: () ->
			@$el.modal('hide')

		render: () ->
			@el.innerHTML = @template(@model.toJSON())