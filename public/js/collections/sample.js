(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/sample', 'async'], function(_, Backbone, SampleModel, async) {
    var SampleCollection;
    return SampleCollection = (function(_super) {
      __extends(SampleCollection, _super);

      function SampleCollection() {
        return SampleCollection.__super__.constructor.apply(this, arguments);
      }

      SampleCollection.prototype.initialize = function(models, options) {
        if (options == null) {
          options = {};
        }
        return this.group = options.group, options;
      };

      SampleCollection.prototype.model = SampleModel;

      SampleCollection.prototype.belongsTo = 'groups';

      SampleCollection.prototype.url = '/sampless';

      SampleCollection.prototype.fetchRecursive = function(app, parent, parentCallback) {
        this.app = app;
        this.parent = parent;
        return this.fetch({
          url: "/" + this.belongsTo + "/" + (this.parent.get('id')) + this.url,
          success: (function(_this) {
            return function(collection, models, options) {
              return parentCallback.call(_this, null, models);
            };
          })(this)
        }, {
          group: this.parent
        }, app, this.app, {
          reset: true
        });
      };

      return SampleCollection;

    })(Backbone.Collection);
  });

}).call(this);
