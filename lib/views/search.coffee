Backbone 			= require('backbone')
Backbone.$ 		= require('jquery')
_							= require('underscore')
define [
  'jquery'
  'underscore'
  'backbone'
], ($, _, Backbone, JST) ->
  class SearchView extends Backbone.View