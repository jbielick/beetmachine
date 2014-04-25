(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel'], function(_, Backbone, deepmodel) {
    'use strict';
    var SampleModel;
    return SampleModel = (function(_super) {
      __extends(SampleModel, _super);

      function SampleModel() {
        return SampleModel.__super__.constructor.apply(this, arguments);
      }

      SampleModel.prototype.url = function() {
        if (this.isNew() && this.get('groupId')) {
          return "/groups/" + (this.get('groupId')) + "/samples";
        } else {
          if (this.isNew()) {
            return "/samples";
          } else {
            return "/samples/" + (this.get('id'));
          }
        }
      };

      SampleModel.prototype.initialize = function(attrs, options) {
        var _ref, _ref1;
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        _.bindAll(this, 'loadSrc');
        if (((_ref = this.collection) != null ? _ref.group.app.pads : void 0) != null) {
          if ((_ref1 = this.collection.group.app.pads.pads[this.get('pad') - 1 % 16]) != null) {
            _ref1.bootstrapWithModel(this);
          }
        }
        this.on('change:src', this.loadSrc);
        return this.on('change:fx:*', (function(_this) {
          return function() {
            _this.timbreContextAttached = false;
            return _this.rendered = false;
          };
        })(this));
      };

      SampleModel.prototype.play = function() {
        var sample, _ref;
        if (!this.rendered) {
          sample = this.renderEffects();
          if (!this.timbreContextAttached) {
            this.timbreContextAttached = true;
            $(sample.play()).one('ended', this.onEnded);
          } else {
            sample.bang();
          }
        } else {
          if ((_ref = this.T.rendered) != null ? _ref.playbackState : void 0) {
            this.T.rendered.currentTime = 0;
          } else {
            $(this.T.rendered.bang()).one('ended', this.onEnded);
          }
        }
        return this;
      };

      SampleModel.prototype.onEnded = function() {
        return this.pause();
      };

      SampleModel.prototype.renderEffects = function(cb) {
        var sample;
        sample = null;
        if (this.T) {
          delete this.T.rendered;
        }
        this.T.rendered = this.T.raw.clone();
        _.each(this.get('fx'), (function(_this) {
          return function(params, fx) {
            return sample = T(fx, params, sample || _this.T.rendered);
          };
        })(this));
        this.rendered = true;
        return sample || this.T.rendered;
      };

      SampleModel.prototype.loadSrc = function(model, src, options, cb) {
        var _this;
        _this = this;
        if (src || this.get('src')) {
          this.loaded = false;
          return T('audio').load(src || this.get('src'), function() {
            _this.T = {
              raw: this
            };
            _this.loaded = true;
            _this.trigger('loaded');
            if (cb) {
              return cb.call(_this, this);
            }
          });
        }
      };

      return SampleModel;

    })(Backbone.DeepModel);
  });

}).call(this);
