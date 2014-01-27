define [
  'jquery'
  'underscore'
  'backbone'
  'templates'
], ($, _, Backbone, JST) ->
  class SearchView extends Backbone.View
    template: JST['app/scripts/templates/search.ejs']