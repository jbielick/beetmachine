define [
  'underscore'
  'backbone'
  'models/group'
], (_, Backbone, GroupModel) ->

  class GroupCollection extends Backbone.Collection
    model: GroupModel

    comparator: 'position'