Backbone     = require('backbone')
Backbone.$   = require('jquery')
Ligament     = require('backbone-ligaments')
_            = require('underscore')
SoundModel   = require('../models/sound')
SoundEditor  = require('./editor')
padTemplate  = require('../templates/pad.tpl')

class PadView extends Backbone.View

  @PAD_CLASSES  = 'small-3 columns pad-container'
  @PAD_RELEASE_TIMEOUT_MS  = 50

  attributes:
    class: @PAD_CLASSES

  template: padTemplate

  initialize: (options) ->
    { @parent, @name, @number } = options

    _.bindAll(@, 'listenToModelEvents', 'press')

    @on 'press', @press

    @render()

  events:
    'contextmenu .pad'    : 'edit'
    'mousedown .pad'      : 'press'
    'mouseup .pad'        : 'release'
    'dragover'            : 'prevent'
    'dragenter'           : 'prevent'
    'drop'                : 'uploadSound'

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

    @ligament = new Ligament(model: @model, view: @)

  prevent: (e) ->
    e.preventDefault()
    e.stopPropagation()

  press: (e = {}) ->
    return true if e? and e.button is 2
    @$('.pad').addClass 'active'

    # if e.originalEvent and e.originalEvent not instanceof MouseEvent
    setTimeout =>
      @$('.pad').removeClass 'active'
    , @PAD_RELEASE_TIMEOUT_MS

    if @model?.loaded
      @parent.trigger('press', @) if not e.silent
      @model.play()

  release: (e) ->
    # @$('.pad').removeClass 'active'

  ###
   # creates a new model if one doesn't exist for this pad
   # Adds itself to the current group's SoundCollection
  ###
  createOrFindModel: (attrs = {}) ->
    unless (@model = @parent.app.groups.findWhere(position: @groupNumber).sounds.findWhere(pad: @number))
      @model = new SoundModel _.extend pad: @$el.index() + 1, attrs
      @parent.app.current.group.sounds.add @model
      @bootstrapWithModel(@model)
    @model

  uploadSound: (e) ->
    e = e.originalEvent
    e.preventDefault()
    e.stopPropagation()

    @createOrFindModel() unless @model

    objectUrl = window.URL?.createObjectURL?(e.dataTransfer?.files?[0])

    @sendFile e.dataTransfer.files[0], (model, attrs) =>
      debugger
      unless objectUrl
        model.set('src', model.url())

    if objectUrl
      @model.set('src', objectUrl)
      @parent.app.display.log("File: #{e.dataTransfer.files[0].name} set on pad #{@name}")
    else
      @parent.app.display.log("Uploading: #{e.dataTransfer.files[0].name}")

  sendFile: (file, cb) ->
    @formData = new FormData()
    @xhr = new XMLHttpRequest()
    @xhr.open 'POST', '/sounds', true
    @formData.append 'sound', file
    @xhr.upload.onprogress = (e) =>
      if e.lengthComputable
        completed = (e.loaded / e.total) * 100
        @$('.progress-bar').css(width: "#{completed.toFixed(0)}%")
    @xhr.onerror = (e) =>
      @parent.app.display.log("Upload failed")
    @xhr.onload = (e) =>
      data = JSON.parse(e.target.responseText)
      @model.set(data)
      @parent.app.display.log("Upload Completed: #{data.filename}")
      cb and cb(@model, data)
      try
        
      catch e
        @parent.app.display.log("Upload failed")
        alert("An error occurred #{e.message} with response #{e.responseText}")
    @xhr.send(@formData)
    delete @xhr
    delete @formData

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

module.exports = PadView