Backbone            = require('backbone')
BackboneNested      = require('backbone-nested')
_                   = require('underscore')
GroupCollection     = require('../collections/group')
SoundCollection     = require('../collections/sound')


class RecipeModel extends Backbone.NestedModel


  defaults:
    name: 'New Recipe'


  urlRoot: '/recipes'


  initialize: (attrs, options) ->
    { @app } = options
    @groups = new GroupCollection({position: 1}, recipe: @, app: @app)
    @sounds = new SoundCollection(recipe: @, group: @groups.at(0), app: @app)


module.exports = RecipeModel