'use strict'

define [
  'underscore'
  'backbone'
  'deepmodel'
  'collections/sound'
], (_, Backbone, deepmodel, SoundCollection) ->

  class GroupModel extends Backbone.DeepModel

  	initialize: (attrs = {}) ->
  		@sounds = new SoundCollection attrs.sounds
  	toJSON: () ->
  		shallow = _.extend({}, @attributes)
  		shallow.sounds = @sounds.toJSON()
  		shallow