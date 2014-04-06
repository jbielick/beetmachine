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
        if (options == null) {
          options = {};
        }
        this.app = options.app;
        _.bindAll(this, '_start', '_stop', '_tick', 'recalculate');
        this.model = new TransportModel({
          bpm: 80,
          step: 64
        });
        this._currentTime = this._currentTick = 0;
        this._playing = this._recording = false;
        return this.render();
      };

      TransportView.prototype.events = {
        'click [data-behavior]': 'delegateAction'
      };

      TransportView.prototype.render = function() {
        return this.el.innerHTML = this.template();
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


      /*
      		 * pause/play
       */

      TransportView.prototype.play = function(e) {
        if (this._playing) {
          return this._stop();
        } else {
          return this._start();
        }
      };


      /*
      		 * sets recording property to true so that the pads UI
      		 * can detect that it should be recording triggers
       */

      TransportView.prototype.record = function(e) {
        if (!this._playing) {
          this._start();
        }
        this._recording = !this._recording;
        return this.$('[data-behavior="record"]').toggleClass('active');
      };


      /*
      		 * restarts playhead tick to 0
       */

      TransportView.prototype.restart = function(e) {
        return this.setTick(0);
      };

      TransportView.prototype.end = function(e) {
        debugger;
      };


      /*
      		 * private start method to start the playhead and sequence/pattern
       */

      TransportView.prototype._start = function() {
        this._playing = true;
        this.clock = setInterval(this._tick, parseInt(this.model.get('interval'), 10));
        return this.$('[data-behavior="play"]').addClass('active');
      };


      /*
      		 * private stop method to stop the playhead and sequence/pattern
       */

      TransportView.prototype._stop = function() {
        clearInterval(this.clock);
        this._recording = false;
        this._playing = false;
        return this.$('[data-behavior="play"], [data-behavior="record"]').removeClass('active');
      };

      TransportView.prototype._tick = function() {
        this.setTick(this._currentTick + 1);
        return this.trigger('tick', this.getTick());
      };

      TransportView.prototype.getTick = function() {
        return this._currentTick;
      };

      TransportView.prototype.getTime = function(humanReadable) {
        var formatted, time;
        if (humanReadable == null) {
          humanReadable = false;
        }
        if (!humanReadable) {
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


      /*
      		 * Setter for the desired tick
      		 * calls necessary update methods to keep the UI and time in sync
       */

      TransportView.prototype.setTick = function(value) {
        this.trigger('tick', value);
        this._currentTick = value;
        this._currentTime = value * parseInt(this.model.get('interval'), 10);
        return this.app.display.model.set('left', this.getTime(true));
      };


      /*
      		 * setter for the desired playhead time
      		 * calls necessary update methods to keep the UI and tick in sync
       */

      TransportView.prototype.setTime = function(value) {
        this._currentTime = value;
        this._currentTick = value / this.model.get('interval');
        return this.app.display.model.set('left', this.getTime(true));
      };


      /*
      		 * recalulate the interval when the bpm changes
       */

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
