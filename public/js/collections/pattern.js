(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/pattern'], function(_, Backbone, PatternModel) {
    var PatternCollection;
    return PatternCollection = (function(_super) {
      __extends(PatternCollection, _super);

      function PatternCollection() {
        return PatternCollection.__super__.constructor.apply(this, arguments);
      }

      PatternCollection.prototype.initialize = function(models, options) {
        if (models == null) {
          models = {};
        }
        if (options == null) {
          options = {};
        }
      };

      PatternCollection.prototype.model = PatternModel;

      return PatternCollection;

    })(Backbone.Collection);
  });

}).call(this);
