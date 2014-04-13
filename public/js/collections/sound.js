(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/sound', 'async'], function(_, Backbone, SoundModel, async) {
    var SoundCollection;
    return SoundCollection = (function(_super) {
      __extends(SoundCollection, _super);

      function SoundCollection() {
        return SoundCollection.__super__.constructor.apply(this, arguments);
      }

      SoundCollection.prototype.initialize = function(models, options) {
        if (options == null) {
          options = {};
        }
        return this.group = options.group, options;
      };

      SoundCollection.prototype.model = SoundModel;

      SoundCollection.prototype.belongsTo = 'groups';

      SoundCollection.prototype.url = '/sounds';

      SoundCollection.prototype.fetchRecursive = function(app, parent, parentCallback) {
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

      return SoundCollection;

    })(Backbone.Collection);
  });

}).call(this);
