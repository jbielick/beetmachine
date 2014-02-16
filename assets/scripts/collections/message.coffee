define [
  'underscore'
  'backbone'
  'models/message'
], (_, Backbone, MessageModel) ->

  class MessageCollection extends Backbone.Collection
    model: MessageModel