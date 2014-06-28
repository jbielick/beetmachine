$                = require('../vendor/jquery-bootstrap')
_                = require('underscore')
T                = require('../vendor/timbre.dev')
BaseModel        = require('./base')
SampleCollection = require('../collections/sample')


class SoundModel extends BaseModel


  initialize: (attrs = {}, options = {}) ->
    @samples = new SampleCollection


  url: () ->
    if @isNew() && @get('groupId')
      return "/groups/#{@get('groupId')}/sounds"
    else

      if @isNew() then "/sounds" else "/sounds/#{@get('_id')}"


  fileUrl: () ->
    @url() + '/file'


  initialize: (attrs = {}, options = {}) ->


  play: () ->
    if not @rendered
      sound = @renderEffects()
      if not @timbreContextAttached
        @timbreContextAttached = true
        $(sound.play()).one('ended', @onEnded)
      else
        sound.bang()
    else
      if @T.rendered?.playbackState
        @T.rendered.currentTime = 0
      else
        $(@T.rendered.bang()).one('ended', @onEnded)
    return @


  onEnded: ->
    # timbre api http://mohayonao.github.io/timbre.js/audio.html
    @pause()


  upload: (file, cb) ->
    err = null
    @formData = new FormData()
    @xhr = new XMLHttpRequest()
    @xhr.open 'POST', '/sounds', true
    @formData.append 'sound', file
    @xhr.onerror = (e) =>
      err = e
      @parent.app.display.log("Upload failed")
      cb and cb(err, @)
    @xhr.onload = (e) =>
      try
        data = JSON.parse(e.target.responseText)
        @set(data)
      catch e
        err = e
      cb and cb(err, @, data)
      delete @xhr
      delete @formData

    @xhr.send(@formData)
    @xhr


  load: (model, src, options, cb) ->
    _this = @
    @loaded = false
    T('audio').load fileUrl, ->
      _this.T = raw: this
      _this.loaded = true
      _this.trigger('loaded')
      cb.call _this, this if cb


module.exports = SoundModel