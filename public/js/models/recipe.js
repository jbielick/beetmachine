(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel'], function(_, Backbone, deepmodel) {
    var RecipeModel;
    return RecipeModel = (function(_super) {
      __extends(RecipeModel, _super);

      function RecipeModel() {
        return RecipeModel.__super__.constructor.apply(this, arguments);
      }

      RecipeModel.prototype.defaults = {
        name: 'New Recipe'
      };

      RecipeModel.prototype.urlRoot = '/recipes';

      return RecipeModel;

    })(Backbone.DeepModel);
  });

}).call(this);
