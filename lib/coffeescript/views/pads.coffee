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
			{ @app } = options
			@groups = new GroupCollection {position: 1}, pads: @, app: @app
			@currentGroup = @groups.at(0)
			@createPads()
			@bootstrapGroupPads @currentGroup
			@render()

			@listenTo(@groups, 'reset', (collection) =>
				collection.each((model) => 
					@bootstrapGroupPads(model)
				)
				@render()
			)

			@listenTo(@groups, 'add', (model) =>
				@bootstrapGroupPads(model)
			)

		createPads: () ->
			@pads = []
			z = 0
			for i in [1..128]
				options = 
					name: 'c'+(i - z * 16)
					parent: @
					number: (i - z * 16)
				@pads.push new PadView options

				z++ if i % 16 is 0

		bootstrapGroupPads: (group) ->
			pos = if group.get('position') - 1 then group.get('position') else 0
			pads = @pads.slice(pos * 16, pos * 16 + 16)

			pad.bootstrapWithModel group.sounds.at(i) for pad, i in pads if group.sounds.at(i)?
			# _.each pads, (pad, i) ->
			# 	if group.sounds.at(i)?
			# 		pad.bootstrapWithModel(group.sounds.at(i))

		toggleGroupSelectButtons: (group) ->
			@app.$('[data-behavior="selectGroup"]')
				.removeClass 'active'
				.filter "[data-meta=\"#{group}\"]"
				.addClass 'active'

		render: (groupNumber = 1) ->

			# remove current pads from DOM
			# TODO don't create 128 pads, just re-use and re-map the same 16
			@$('.pad-container').detach()

			groupNumber = groupNumber * 1

			# deselect inactive group buttons, highlight selected
			@toggleGroupSelectButtons groupNumber

			# groups have position 1-8, but pads cache is broken into a zero-indexed array
			zeroedIndex = groupNumber - 1

			# set the currentGroup to the one selected
			@currentGroup = @groups.findWhere(position: groupNumber)

			# if there wasn't a group at this position, create one real quick.
			if not @currentGroup
				@groups.add position: groupNumber
				@currentGroup = @groups.findWhere(position: groupNumber)

			@app.$('.patterns .grid').hide()

			# show this group's pattern
			@currentGroup.enable()

			# slice the pads cache to the 16 views we want
			@currentPads = @pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16)

			# update display UI
			@app.display.model.set('right', "Group #{groupNumber}")

			# append the DOM els from the 16 pads we sliced from the cache
			@$el.append(_.pluck(@currentPads, 'el'))
