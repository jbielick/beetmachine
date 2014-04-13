(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/pattern', 'async'], function(_, Backbone, PatternModel, async) {
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
        return this.group = options.group, options;
      };

      PatternCollection.prototype.comparator = 'position';

      PatternCollection.prototype.model = PatternModel;

      PatternCollection.prototype.belongsTo = 'groups';

      PatternCollection.prototype.url = '/patterns';

      PatternCollection.prototype.fetchRecursive = function(app, parent, parentCallback) {
        this.app = app;
        this.parent = parent;
        return this.fetch({
          url: "/" + this.belongsTo + "/" + (this.parent.get('id')) + this.url,
          success: (function(_this) {
            return function(collection, models, options) {
              return parentCallback.call(_this, null, models);
            };
          })(this),
          group: this.parent
        }, app, this.app, {
          reset: true
        });
      };

      return PatternCollection;

    })(Backbone.Collection);
  });

}).call(this);
