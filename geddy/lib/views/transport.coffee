Backbone            = require('backbone')
Backbone.$          = $ = require('jquery')
_                   = require('underscore')
TransportModel      = require('../models/transport')
transportTemplate   = require('../templates/transport.tpl')

class TransportView extends Backbone.View

  el: '.transport'

  template: transportTemplate

  initialize: (options = {}) ->
    { @app } = options

    _.bindAll @, '_start', '_stop', '_tick', 'recalculate'
    @model = new TransportModel bpm: 80, step: 64
    @_currentTime   = @_currentTick   = 0
    @_playing       = @_recording     = false
    @render()

  events:
    'click [data-behavior]'     : 'delegateAction'

  render: ->
    @el.innerHTML = @template()

  delegateAction: (e) ->
    behavior = $(e.currentTarget).data('behavior')
    if this[behavior]
      e.preventDefault()
      this[behavior].call this, e

  stop: (e) ->
    @_stop()
    @$('[data-behavior="record"], [data-behavior="play"]').removeClass 'active'

  ###
  # pause/play
  ###
  play: (e) ->
    if @_playing then @_stop() else @_start()

  ###
  # sets recording property to true so that the pads UI
  # can detect that it should be recording triggers
  ###
  record: (e) ->
    if not @_playing then @_start()
    @_recording = !@_recording
    @$('[data-behavior="record"]').toggleClass 'active'

  ###
  # restarts playhead tick to 0
  ###
  restart: (e) ->
    @setTick 0

  # TODO
  end: (e) ->
    debugger

  ###
  # private start method to start the playhead and sequence/pattern
  ###
  _start: ->
    @_playing = true
    @clock = setInterval @_tick, parseInt(@model.get('interval'), 10)
    @$('[data-behavior="play"]').addClass 'active'

  ###
  # private stop method to stop the playhead and sequence/pattern
  ###
  _stop: ->
    clearInterval @clock
    @_recording = false
    @_playing = false
    @$('[data-behavior="play"], [data-behavior="record"]').removeClass 'active'

  # private method called every calculated interval.
  # also checks the current pattern and attempts to trigger a "press" event 
  # on the pad given in the patterns tickstamp array of triggers.
  # 
  #  example: the pattern may look like this
  #  {
  #   14543: [{
  #       pad       : 1,
  #       velocity  : 100
  #     },{
  #       pad       : 4,
  #       velocity  : 100
  #   }]
  #  }
  #  
  #  on the tick "14543", pads 1, 4, and 5 would be triggered if they 
  #  loaded in the current group (pads.currentGroup)
  _tick: ->
    @setTick @_currentTick + 1

  getTick: ->
    @_currentTick

  getTime: (humanReadable = false) ->
    if not humanReadable 
      @_currentTime
    else
      time = (''+(@_currentTime / 1000 * 100)).split('.')[0]
      formatted = ''
      while time.length < 8
        time = '0'+time
      time = time.split('')
      while true
        formatted += time.splice(0, 2).join('')
        if time.length >= 2
          formatted += ':'
        break if not time.length
      return formatted

  ###
  # Setter for the desired tick
  # calls necessary update methods to keep the UI and time in sync
  ###
  setTick: (value) ->
    @trigger('tick', value)
    @_currentTick = value
    @_currentTime = value * parseInt(@model.get('interval'), 10)
    @app.display.model.set 'left', @getTime(true)

  ###
  # setter for the desired playhead time
  # calls necessary update methods to keep the UI and tick in sync
  ###
  setTime: (value) ->
    @_currentTime = value
    @_currentTick = value / @model.get 'interval'
    @app.display.model.set('left', @getTime(true))

  ###
  # recalulate the interval when the bpm changes
  ###
  recalculate: (model, changed) ->
    if changed.bpm
      @model.set 'interval', @calculateInterval(changed.bpm)

    @_stop()
    @_start()

module.exports = TransportView