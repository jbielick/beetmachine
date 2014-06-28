Backbone      = require('backbone')
Backbone.$    = require('jquery')
_             = require('underscore')
PadView       = require('./pad')
padsTemplate  = require('../templates/pad.tpl')

PADLABEL_PREFIX     = 'c'

class PadsView extends Backbone.View

  el: '.pads'

  template: padsTemplate

  colorMap: 
    '1': '#ADD5FF'
    '2': '#FF8D8D'
    '3': '#BBBBD4'
    '4': '#EBECF2'
    '5': '#FFE97F'

  initialize: (options) ->
    { @app } = options
    @createPads()
    # @bootstrapGroupPads(@app.current.group)
    @render()

    @listenTo @app.model.groups, 'fetch', (collection) =>
      collection.each (model) => 
        @bootstrapGroupPads(model)
      @render()

    @listenTo @app.model.groups, 'add', (model) =>
      @bootstrapGroupPads(model)

  createPads: () ->
    @pads = []
    z = 0
    for i in [1..128]
      options = 
        name: "#{PADLABEL_PREFIX + (i - z * 16)}"
        parent: @
        number: (i - z * 16)
      @pads.push (padView = new PadView(options))
      padView.groupNumber = z + 1
      z++ if i % 16 is 0

  bootstrapGroupPads: (group) ->
    pos = if group.get('position') - 1 > -1 then group.get('position') - 1 else 0
    pads = @pads.slice(pos * 16, pos * 16 + 16)

    pad.bootstrapWithModel group.sounds.at(i) for pad, i in pads if group.sounds.at(i)?

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
    @app.current.group = @app.model.groups.findWhere(position: groupNumber)

    # if there wasn't a group at this position, create one real quick.
    if not @app.current.group
      @app.model.groups.add position: groupNumber
      @app.current.group = @app.model.groups.findWhere(position: groupNumber)

    @app.$('.patterns .grid').hide()

    # show this group's pattern
    @app.pattern._selectPattern(@app.current.group.lastActivePattern?.get('position') || 1)

    # slice the pads cache to the 16 views we want
    @app.current.pads = @pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16)

    # update display UI
    @app.display.model.set('right', "Group #{groupNumber}")

    # append the DOM els from the 16 pads we sliced from the cache
    @$el.append(_.pluck(@app.current.pads, 'el'))

module.exports = PadsView