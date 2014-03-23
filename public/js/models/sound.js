(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel'], function(_, Backbone, deepmodel) {
    'use strict';
    var SoundModel;
    return SoundModel = (function(_super) {
      __extends(SoundModel, _super);

      function SoundModel() {
        return SoundModel.__super__.constructor.apply(this, arguments);
      }

      SoundModel.prototype.initialize = function(attrs, options) {
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        _.bindAll(this, 'loadSrc');
        this.on('change:src', this.loadSrc);
        return this.on('change:fx:*', (function(_this) {
          return function() {
            _this.timbreContextAttached = false;
            return _this.rendered = false;
          };
        })(this));
      };

      SoundModel.prototype.play = function() {
        var sound, _ref;
        if (!this.rendered) {
          sound = this.renderEffects();
          if (!this.timbreContextAttached) {
            this.timbreContextAttached = true;
            sound.play();
          } else {
            sound.bang();
          }
        } else {
          if ((_ref = this.T.rendered) != null ? _ref.playbackState : void 0) {
            this.T.rendered.currentTime = 0;
          } else {
            this.T.rendered.bang();
          }
        }
        return this;
      };

      SoundModel.prototype.renderEffects = function(cb) {
        var sound;
        sound = null;
        if (this.T) {
          delete this.T.rendered;
        }
        this.T.rendered = this.T.raw.clone();
        _.each(this.get('fx'), (function(_this) {
          return function(params, fx) {
            return sound = T(fx, params, sound || _this.T.rendered);
          };
        })(this));
        this.rendered = true;
        return sound || this.T.rendered;
      };

      SoundModel.prototype.loadSrc = function(model, src, options, cb) {
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

      return SoundModel;

    })(Backbone.DeepModel);
  });

}).call(this);
