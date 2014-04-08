(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel', 'collections/sound', 'collections/pattern'], function(_, Backbone, deepmodel, SoundCollection, PatternCollection) {
    var GroupModel;
    return GroupModel = (function(_super) {
      __extends(GroupModel, _super);

      function GroupModel() {
        return GroupModel.__super__.constructor.apply(this, arguments);
      }

      GroupModel.prototype.initialize = function(attrs, options) {
        var _ref;
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        _ref = options.collection, this.app = _ref.app, this.pads = _ref.pads;
        this.sounds = new SoundCollection(attrs.sounds, {
          group: this
        });
        this.patterns = new PatternCollection(attrs.patterns || {}, {
          app: this.app,
          pads: this.pads,
          group: this
        });
        return this.currentPattern = this.patterns.at(0);
      };

      GroupModel.prototype.enable = function(patternNumber) {
        if (patternNumber) {
          this.currentPattern = this.patterns.findWhere({
            position: patternNumber
          });
        }
        return this.currentPattern.view.$el.show();
      };

      GroupModel.prototype.toJSON = function() {
        var deep, shallow;
        shallow = _.extend({}, this.attributes);
        deep = shallow;
        return deep;
      };

      GroupModel.prototype.url = function() {
        if (this.get('recipe_id')) {
          return "/recipes/" + (this.get('recipe_id')) + "/groups";
        } else {
          return "/groups";
        }
      };

      return GroupModel;

    })(Backbone.DeepModel);
  });

}).call(this);
