define [
	'jquery'
	'underscore'
	'backbone'
	'views/pad'
	'collections/group'
	'text!/js/templates/pads.ejs'
], ($, _, Backbone, PadView, GroupCollection, PadsTemplate) ->

	class PadsView extends Backbone.View

		el: '.pads'

		template: _.template PadsTemplate

		colorMap: 
			'1': '#ADD5FF'
			'2': '#FF8D8D'
			'3': '#BBBBD4'
			'4': '#EBECF2'
			'5': '#FFE97F'

		initialize: (options) ->
			@app = options.parent
			@groups = new GroupCollection {position: 1}, view: @
			@currentGroup = @groups.at(0)
			@createPads()
			@bootstrapGroupPads(@currentGroup)
			@render()

			@listenTo(@groups, 'reset', (collection) =>
				collection.each((model) => 
					@bootstrapGroupPads(model)
				)
				@render(1)
			)

			@listenTo(@groups, 'add', (model) =>
				@bootstrapGroupPads(model)
				@render(model.get('position'))
			)

		createPads: () ->
			@pads = []
			i = 1
			z = 0
			while i <= 128
				options = 
					name: 'c'+(i - z * 16)
					parent: @
				@pads.push new PadView options

				z++ if i % 16 is 0
				i++

		bootstrapGroupPads: (group) ->
			pos = group.get('position') - 1 or 0
			pads = @pads.slice(pos * 16, pos * 16 + 16)
			_.each(pads, (pad, i) ->
				if group.sounds.at(i)?
					pad.bootstrapWithModel(group.sounds.at(i))
			)

		record: (pad) ->
			if @app.transport._recording and pad.model
				tick = @app.transport.getTick()
				console.log('recordHit at %s', tick)
				# trigger = 

				@app.transport.pattern or (@app.transport.pattern = {})
				@app.transport.pattern[tick] or (@app.transport.pattern[tick] = [])
				@app.transport.pattern[tick].push(pad.model.get('pad'))

		toggleGroupSelectButtons: (group) ->
			$('[data-behavior="selectGroup"]').removeClass('active').filter('[data-meta="'+group+'"]').addClass('active');

		render: (group = 1) ->
			@$('.pad-container').detach()
			@toggleGroupSelectButtons(group)

			zeroedIndex = group - 1
			active = @groups.findWhere(position: group)

			if active is 'undefined'
				active = @groups.create position: group

			@currentGroup = active
			@currentPads = @pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16)
			@app.display.model.set('right', 'Group '+group)
			@$el.append(_.pluck(@currentPads, 'el'))