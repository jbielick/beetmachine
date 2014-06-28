Backbone      = require('backbone')
Backbone.$    = require('jquery')
Ligament      = require('backbone-ligaments')
_             = require('underscore')
SoundModel    = require('../models/sound')
SampleModel   = require('../models/sample')
SampleEditor  = require('./editor')
padTemplate   = require('../templates/pad.tpl')


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
    'contextmenu .pad'    : 'openEditor'
    'mousedown .pad'      : 'press'
    'mouseup .pad'        : 'release'
    'dragover'            : 'preventDefault'
    'dragenter'           : 'preventDefault'
    'drop'                : 'onDropFile'


  listenToModelEvents: (sample) ->
    @stopListening sample, 'press'
    @listenTo sample, 'press', @press

    @stopListening sample, 'loaded'

    @listenTo sample, 'loaded', () =>
      @$('.pad').addClass('mapped')
      @parent.app.display.log((sample.get('name') || @name) + ' loaded')


  bootstrap: (sound, sample) ->
    sample.pad = @
    @listenToModelEvents(sample)

    if (keyCode = sample.get('keyCode'))
      sample.set 'key', keyCode

    if @ligaments?.sound?
      @ligaments.sound.destroy?()
    if @ligaments?.sample?
      @ligaments.sample.destroy?()

    @ligaments = {
      sound: new Ligament(model: sound, view: @)
      sample: new Ligament(model: sample, view: @)
    }


  preventDefault: (e) ->
    e.preventDefault()
    e.stopPropagation()


  press: (e = {}) ->
    return true if e? and e.button is 2
    @$('.pad').addClass 'active'

    # if e.originalEvent and e.originalEvent not instanceof MouseEvent
    setTimeout =>
      @$('.pad').removeClass 'active'
    , @PAD_RELEASE_TIMEOUT_MS

    if @sample?.loaded
      @parent.trigger('press', @) if not e.silent
      @sample.play()


  release: (e) ->
    # @$('.pad').removeClass 'active'


  ###
   # creates a new model if one doesn't exist for this pad
   # Adds itself to the current group's SoundCollection
  ###
  ensureModels: (attrs = {}) ->

    # adds sound to the recipe's sound collection
    unless @sound
      @sound = @parent.app.model.sounds.add new SoundModel

    unless (@sample = @parent.app.model.groups.findWhere(position: @groupNumber).samples.findWhere(pad: @number))
      @sample = new SampleModel _.extend(attrs, pad: @number), sound: @sound
      # @parent.app.current.group.samples.add @model
    
    # add itself to the sound's collection of samples
    @sound.samples.add @sample

    @bootstrap(@sound, @sample)


  onDropFile: (e) ->
    e = e.originalEvent
    e.preventDefault()
    e.stopPropagation()

    @ensureModels() unless @sound? and @sample?

    objectUrl = null # window.URL?.createObjectURL?(e.dataTransfer?.files?[0])

    @sound.upload(e.dataTransfer.files[0], (err, model, attrs) =>
      if err
        alert("An error occurred: #{err.message}")
        @parent.app.display.log("Upload failed")
      else
        @parent.app.display.log("Upload Completed: #{model.get('filename')}")
      unless objectUrl
        model.set('src', model.fileUrl())
    ).upload.onprogress = (e) =>
      if e.lengthComputable
        completed = (e.loaded / e.total) * 100
        @$('.progress-bar').css(width: "#{completed.toFixed(0)}%")

    if objectUrl
      @model.set('src', objectUrl)
      @parent.app.display.log("File: #{e.dataTransfer.files[0].name} locally cached and set on pad #{@name}")
    else
      @parent.app.display.log("Uploading: #{e.dataTransfer.files[0].name}")


  openEditor: (e) ->
    e.preventDefault()
    @ensureModels()
    if not @editor
      @editor = new SampleEditor(
        sound: @sound
        sample: @sample
        pad: @
      )
    @editor.show()


  render: () ->
    @el.innerHTML = @template(name: @name)

module.exports = PadView