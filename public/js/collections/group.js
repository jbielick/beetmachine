(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/group', 'async'], function(_, Backbone, GroupModel, async) {
    var GroupCollection;
    return GroupCollection = (function(_super) {
      __extends(GroupCollection, _super);

      function GroupCollection() {
        return GroupCollection.__super__.constructor.apply(this, arguments);
      }

      GroupCollection.prototype.model = GroupModel;

      GroupCollection.prototype.comparator = 'position';

      GroupCollection.prototype.url = '/groups';

      GroupCollection.prototype.belongsTo = 'recipes';

      GroupCollection.prototype.initialize = function(attrs, options) {
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        return this.app = options.app, options;
      };

      GroupCollection.prototype.fetchRecursive = function(app, parent, parentCallback) {
        this.app = app;
        this.parent = parent;
        return this.fetch({
          url: "/" + this.belongsTo + "/" + (this.parent.get('id')) + this.url,
          success: (function(_this) {
            return function(collection, models, options) {
              var fetchTasks;
              fetchTasks = [];
              _this.each(function(model) {
                fetchTasks.push(function(callback) {
                  return model.sounds.fetchRecursive(_this.app, model, callback);
                });
                return fetchTasks.push(function(callback2) {
                  return model.patterns.fetchRecursive(_this.app, model, callback2);
                });
              });
              return async.parallel(fetchTasks, parentCallback);
            };
          })(this)
        }, {
          reset: true
        });
      };

      return GroupCollection;

    })(Backbone.Collection);
  });

}).call(this);
