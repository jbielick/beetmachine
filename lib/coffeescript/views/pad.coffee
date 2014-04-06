define [
	'jquery'
	'underscore'
	'backbone'
	'models/sound'
	'views/editor'
	'ligaments'
	'text!/js/templates/pad.ejs'
], ($, _, Backbone, SoundModel, SoundEditor, ligaments, PadTemplate) ->

	class PadView extends Backbone.View

		attributes:
			class: 'small-3 columns pad-container'

		template: _.template PadTemplate

		initialize: (options) ->
			{ @parent, @name, @number } = options

			_.bindAll @, 'listenToModelEvents', 'press'

			@on 'press', @press

			@render()

		listenToModelEvents: () ->
			@stopListening @model, 'press'
			@listenTo @model, 'press', @press

			@stopListening @model, 'loaded'
			@listenTo @model, 'loaded', () =>
				@$('.pad').addClass('mapped')
				@parent.app.display.log(@name+' loaded')

		bootstrapWithModel: (soundModel) ->
			if not soundModel and not soundModel instanceof SoundModel
				then throw new Error 'Must provide a SoundModel instance when mapping a pad.'

			(@model = soundModel).pad = @

			@listenToModelEvents()

			if (keyCode = @model.get('keyCode'))
				@model.set 'key', String.fromCharCode(keyCode)

			new Backbone.Ligaments model: @model, view: @

		render: () ->
			@el.innerHTML = @template name: @name

		events:
			'contextmenu .pad'		: 'edit'
			'mousedown .pad'			: 'press'
			'mouseup .pad'				: 'release'
			'dragover'						: 'prevent'
			'dragenter'						: 'prevent'
			'drop'								: 'uploadSample'

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e = {}) ->
			return true if e? and e.button is 2
			@$('.pad').addClass 'active'

			# if e.originalEvent and e.originalEvent not instanceof MouseEvent
			setTimeout(() =>
				@$('.pad').removeClass 'active'
			, 50)

			if @model?.loaded
				@parent.trigger('press', @) if not e.silent
				@model.play()

		release: (e) ->
			# @$('.pad').removeClass 'active'

		###
		 # creates a new model
		 # Adds itself to the current group's SoundCollection
		###
		createModel: (attrs = {}) ->
			@model = new SoundModel _.extend pad: @$el.index() + 1, attrs
			@parent.currentGroup.sounds.add @model
			@listenToModelEvents()
			@model

		uploadSample: (e) ->
			e = e.originalEvent
			e.preventDefault()
			e.stopPropagation()

			@createModel() if not @model

			objectUrl = window.URL?.createObjectURL?(e.dataTransfer?.files?[0])

			@model.set 'src', objectUrl

			@parent.app.display.log("File: #{e.dataTransfer.files[0].name} uploaded on pad #{@name}")

		edit: (e) ->
			e.preventDefault()
			if not @editor
				@editor = new SoundEditor(
					model: @model or @createModel()
					pad: this
				)
			else
				@editor.show()