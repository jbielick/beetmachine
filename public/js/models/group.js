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
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        this.app = options.collection.app;
        this.pads = options.collection.pads;
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

      GroupModel.prototype.toJSON = function() {
        var deep, shallow;
        shallow = _.extend({}, this.attributes);
        shallow.sounds = this.sounds.toJSON();
        deep = shallow;
        return deep;
      };

      GroupModel.prototype.url = '/groups';

      return GroupModel;

    })(Backbone.DeepModel);
  });

}).call(this);
