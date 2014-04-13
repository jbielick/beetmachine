define [
	'jquery'
	'bootstrap'
	'underscore'
	'backbone'
	'ligaments'
	'views/display'
	'text!/js/templates/editor.ejs'
], ($, bootstrap, _, Backbone, ligaments, Display, EditorTemplate) ->
	class EditorView extends Backbone.View

		template: _.template EditorTemplate

		attributes:
			'class'					: 'modal fade'

		initialize: (options) ->
			@viewVars = {}
			{ @model, @pad } = options
			
			@render()

			_.bindAll @, 'redrawCanvas'
			new Backbone.Ligaments(model: @model, view: @)
			@listenTo @model, 'change', @redrawCanvas

		events:
			'click [data-behavior]'				: 'delegateBehavior'
			'click canvas'								: 'play'
			'change input.eq'							: 'eq'

		delegateBehavior: (e) ->
			behavior = $(e.currentTarget).data 'behavior'
			if behavior? and _.isFunction this[behavior]
				this[behavior].call this, e

		eq: (e) ->
			param = e.currentTarget.getAttribute('data-param')
			freq = @model.get('fx.eq.params.'+param)
			freq[2] = parseInt($(e.currentTarget).val(), 10)
			@model.set('fx.eq.params.'+param, freq)
			console.log(freq)

		tab: (e) ->
			tabClass = $(e.currentTarget).data 'tab'
			$(e.currentTarget).addClass('active').siblings().removeClass('active')
			this.$('.tab-pane').hide()
			this.$('.tab-pane'+tabClass).show()

		toggleEffect: (e) ->
			effect = $(e.currentTarget).data('effect')
			if not @model.get "fx.#{effect}"
				@viewVars.show = effect
				@addEffect effect
			else
				delete @viewVars.show
				@removeEffect effect

		addEffect: (effect) ->
			switch effect
				when 'reverb'
					fx =
						room			: 0
						damp			: 0
						mix				: 0.5
				when 'delay'
					fx =
						time			: 100
						fb				: 0.2
						mix				: 0.33
				when 'chorus'
					fx =
						type			: 'sin'		# or 'tri'
						delay			: 20			# 0.5 ... 80
						rate			: 4				# 0 ... 10
						depth			: 20 			# 0 ... 100
						fb				: 0.2 		# -1 ... 1
						wet				: 0.33		# 0 ... 1

			@model.set "fx.#{effect}", fx

			@render()

		removeEffect: (effect) ->
			@model.unset "fx.#{effect}"
			@render()

		play: (e) ->
			e.preventDefault()
			@pad.trigger('press')

		show: () ->
			@$el.modal 'show'

		hide: () ->
			@$el.modal 'hide'

		render: () ->
			@el.innerHTML = @template(
				data: @model.toJSON()
				view: @viewVars
			)
			@redrawCanvas
			
		redrawCanvas: () ->
			unless @$canvas
				@$canvas = this.$('.waveform')
			if @pad.model?.T?.raw
				@pad.model.T.raw.plot(
					target: @$canvas.get(0)
					background: 'rgb(70,70,70)'
					foreground: '#f08a24'
				)