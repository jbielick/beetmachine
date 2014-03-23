(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'models/transport', 'text!/js/templates/transport.ejs'], function($, _, Backbone, TransportModel, TransportTemplate) {
    var TransportView;
    return TransportView = (function(_super) {
      __extends(TransportView, _super);

      function TransportView() {
        return TransportView.__super__.constructor.apply(this, arguments);
      }

      TransportView.prototype.el = '.transport';

      TransportView.prototype.template = _.template(TransportTemplate);

      TransportView.prototype.initialize = function(options) {
        this.app = options.parent;
        _.bindAll(this, '_start', '_stop', '_tick', 'recalculate');
        this.model = new TransportModel({
          bpm: 100,
          interval: this.calculateInterval(100)
        });
        this._currentTime = 0;
        this._currentTick = 0;
        this._playing = false;
        this._recording = false;
        this.render();
        this.listenTo(this.model, 'change:interval', this.recalculate);
        return this.listenTo(this.model, 'change:bpm', this.recalculate);
      };

      TransportView.prototype.render = function() {
        return this.el.innerHTML = this.template();
      };

      TransportView.prototype.calculateInterval = function(bpm, step) {
        if (step == null) {
          step = 64;
        }
        return (60 * 1000) / 100 / step;
      };

      TransportView.prototype.events = {
        'click [data-behavior]': 'delegateAction'
      };

      TransportView.prototype.delegateAction = function(e) {
        var behavior;
        behavior = $(e.currentTarget).data('behavior');
        if (this[behavior]) {
          e.preventDefault();
          return this[behavior].call(this, e);
        }
      };

      TransportView.prototype.stop = function(e) {
        this._stop();
        return this.$('[data-behavior="record"], [data-behavior="play"]').removeClass('active');
      };

      TransportView.prototype.play = function(e) {
        if (this._playing) {
          return this._stop();
        } else {
          return this._start();
        }
      };

      TransportView.prototype.record = function(e) {
        if (!this._playing) {
          this._start();
        }
        this._recording = !this._recording;
        return this.$('[data-behavior="record"]').toggleClass('active');
      };

      TransportView.prototype.restart = function(e) {
        this.setTime(0);
        return this.setTick(0);
      };

      TransportView.prototype.end = function(e) {
        debugger;
      };

      TransportView.prototype._start = function() {
        this._playing = true;
        this.clock = setInterval(this._tick, parseInt(this.model.get('interval'), 10));
        return this.$('[data-behavior="play"]').addClass('active');
      };

      TransportView.prototype._stop = function() {
        clearInterval(this.clock);
        this._recording = false;
        this._playing = false;
        return this.$('[data-behavior="play"], [data-behavior="record"]').removeClass('active');
      };

      TransportView.prototype._tick = function() {
        var pad, _i, _len, _ref, _ref1;
        this._currentTime += this.model.get('interval');
        this._currentTick++;
        if (this.pattern && this.pattern[this._currentTick] && this.pattern[this._currentTick].length > 0) {
          _ref = this.pattern[this._currentTick];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pad = _ref[_i];
            if ((_ref1 = this.app.pads.currentGroup.sounds.findWhere({
              pad: pad
            })) != null) {
              _ref1.trigger('press');
            }
          }
        }
        return this.app.display.model.set('left', this.getTime(true));
      };

      TransportView.prototype.getTick = function() {
        return this._currentTick;
      };

      TransportView.prototype.getTime = function(readable) {
        var formatted, time;
        if (readable == null) {
          readable = false;
        }
        if (!readable) {
          return this._currentTime;
        } else {
          time = ('' + (this._currentTime / 1000 * 100)).split('.')[0];
          formatted = '';
          while (time.length < 8) {
            time = '0' + time;
          }
          time = time.split('');
          while (true) {
            formatted += time.splice(0, 2).join('');
            if (time.length >= 2) {
              formatted += ':';
            }
            if (!time.length) {
              break;
            }
          }
          return formatted;
        }
      };

      TransportView.prototype.setTime = function(value) {
        this._currentTime = value;
        this._currentTick = value / this.model.get('interval');
        return this.app.display.model.set('left', this.getTime() / 1000);
      };

      TransportView.prototype.setTick = function(value) {
        this._currentTick = value;
        this._currentTime = value * this.model.get('interval');
        return this.app.display.model.set('left', this.getTime() / 1000);
      };

      TransportView.prototype.timestamp = function() {};

      TransportView.prototype.recalculate = function(model, changed) {
        if (changed.bpm) {
          this.model.set('interval', this.calculateInterval(changed.bpm));
        }
        this._stop();
        return this._start();
      };

      return TransportView;

    })(Backbone.View);
  });

}).call(this);
