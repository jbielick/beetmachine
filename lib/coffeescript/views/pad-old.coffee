define [
	'jquery'
	'underscore'
	'backbone'
	'models/sample'
	'views/editor'
	'ligaments'
	'text!/js/templates/pad.ejs'
], ($, _, Backbone, SoundModel, SoundEditor, ligaments, PadTemplate) ->

	PAD_CLASSES 						= 'small-3 columns pad-container'
	PAD_RELEASE_TIMEOUT			= 50

	class PadView extends Backbone.View

		attributes:
			class: PAD_CLASSES

		template: _.template PadTemplate

		initialize: (options) ->
			{ @parent, @name, @number } = options

			_.bindAll(@, 'listenToModelEvents', 'press')

			@on 'press', @press

			@render()

		events:
			'contextmenu .pad'		: 'edit'
			'mousedown .pad'			: 'press'
			'mouseup .pad'				: 'release'
			'dragover'						: 'prevent'
			'dragenter'						: 'prevent'
			'drop'								: 'uploadSample'

		listenToModelEvents: () ->
			@stopListening @model, 'press'
			@listenTo @model, 'press', @press

			@stopListening @model, 'loaded'
			@listenTo @model, 'loaded', () =>
				@$('.pad').addClass('mapped')
				@parent.app.display.log((@model.get('name') || @name) + ' loaded')


		bootstrapWithModel: (soundModel) ->
			if not soundModel and not soundModel instanceof SoundModel
				throw new Error 'Must provide a SoundModel instance when mapping a pad.'

			(@model = soundModel).pad = @

			@listenToModelEvents()

			if (keyCode = @model.get('keyCode'))
				@model.set 'key', keyCode

			new Backbone.Ligaments(model: @model, view: @)

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e = {}) ->
			return true if e? and e.button is 2
			@$('.pad').addClass 'active'

			# if e.originalEvent and e.originalEvent not instanceof MouseEvent
			setTimeout =>
				@$('.pad').removeClass 'active'
			, PAD_RELEASE_TIMEOUT

			if @model?.loaded
				@parent.trigger('press', @) if not e.silent
				@model.play()

		release: (e) ->
			# @$('.pad').removeClass 'active'

		###
		 # creates a new model if one doesn't exist for this pad
		 # Adds itself to the current group's SampleCollection
		###
		createOrFindModel: (attrs = {}) ->
			unless (@model = @parent.app.groups.findWhere(position: @groupNumber).samples.findWhere(pad: @number))
				@model = new SoundModel _.extend pad: @$el.index() + 1, attrs
				@parent.app.current.group.samples.add @model
				@bootstrapWithModel(@model)
			@model

		uploadSample: (e) ->
			e = e.originalEvent
			e.preventDefault()
			e.stopPropagation()

			@createOrFindModel() if not @model

			objectUrl = window.URL?.createObjectURL?(e.dataTransfer?.files?[0])

			@model.set('src', objectUrl)

			@parent.app.display.log("File: #{e.dataTransfer.files[0].name} uploaded on pad #{@name}")

		edit: (e) ->
			e.preventDefault()
			if not @editor
				@editor = new SoundEditor(
					model: @model or @createOrFindModel()
					pad: this
				)
			@editor.show()

		render: () ->
			@el.innerHTML = @template(name: @name)