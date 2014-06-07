Backbone              = require('backbone')
Backbone.$            = $ = require('../vendor/jquery-bootstrap')
Backbone.NestedModel  = require('backbone-nested').NestedModel
_                     = require('underscore')

class BaseModel extends Backbone.NestedModel

  idAttribute: '_id'

module.exports = BaseModel