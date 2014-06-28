Backbone              = require('backbone')
Backbone.$            = require('jquery')
Backbone.NestedModel  = require('backbone-nested').NestedModel
_                     = require('underscore')
SampleCollection      = require('../collections/sample')
PatternCollection     = require('../collections/pattern')


class GroupModel extends Backbone.NestedModel


  initialize: (attrs = {}, options = {}) ->
    { @app, @pads } = options.collection
    @samples = new SampleCollection attrs.samples || [{pad: 1}], group: @
    @patterns = new PatternCollection attrs.patterns || [{position: 1}], group: @


  url: () ->
    if @isNew() && @get('recipe_id')
      return "/recipes/#{@get('recipe_id')}/groups"
    else
      if @isNew()
        return "/groups"
      else
        return "/groups/#{@get('id')}"


module.exports = GroupModel