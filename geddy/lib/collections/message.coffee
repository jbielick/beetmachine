Backbone 			= require('backbone')
_							= require('underscore')
MessageModel	= require('../models/message')

class MessageCollection extends Backbone.Collection
  model: MessageModel

module.exports = MessageCollection