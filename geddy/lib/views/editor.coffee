Backbone        = require('backbone')
Backbone.$      = require('../vendor/jquery-bootstrap.js')
Ligament        = require('backbone-ligaments')

_               = require('underscore')
Display         = require('./display')
editorTemplate  = require('../templates/editor.tpl')


ORANGE = '#f08a24'

class EditorView extends Backbone.View

  template: editorTemplate

  attributes:
    'class'         : 'modal fade'

  initialize: (options) ->
    @viewVars = {}
    { @model, @pad } = options

    _.bindAll @, 'drawCanvas'
    
    @render()

    @ligament = new Ligament(model: @model, view: @)
    @listenTo @model, 'change', @drawCanvas

  events:
    'click [data-behavior]'       : 'delegateBehavior'
    'click canvas'                : 'play'
    'change input.eq'             : 'eq'

  delegateBehavior: (e) ->
    behavior = $(e.currentTarget).data 'behavior'
    if behavior? and _.isFunction this[behavior]
      this[behavior].call this, e

  save: (e) ->
    @pad.model.save()

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
          room      : 0
          damp      : 0
          mix       : 0.5
      when 'delay'
        fx =
          time      : 100
          fb        : 0.2
          mix       : 0.33
      when 'chorus'
        fx =
          type      : 'sin'   # or 'tri'
          delay     : 20      # 0.5 ... 80
          rate      : 4       # 0 ... 10
          depth     : 20      # 0 ... 100
          fb        : 0.2     # -1 ... 1
          wet       : 0.33    # 0 ... 1

    @model.set "fx.#{effect}", fx

    @drawCanvas()

  removeEffect: (effect) ->
    @model.unset "fx.#{effect}"
    @drawCanvas()

  play: (e) ->
    e.preventDefault()
    @pad.trigger('press')

  show: () ->
    @drawCanvas()
    @$el.modal 'show'

  hide: () ->
    @$el.modal 'hide'

  render: () ->
    @el.innerHTML = @template(
      data: @model.toJSON()
      view: @viewVars
    )
    @drawCanvas()
    
  drawCanvas: () ->
    @$canvas = this.$('.waveform') unless @$canvas
    renderOptions = {
      width: 558
      height: 100
      target: @$canvas.get(0)
      lineWidth: 0.5
      background: '#222'
      foreground: ORANGE
    }
    if @pad.model?.T?.rendered?
      @pad.model.T.rendered.plot(renderOptions)
    else if @pad.model?.T?.raw?
      @pad.model.T.raw.plot(renderOptions)

module.exports = EditorView