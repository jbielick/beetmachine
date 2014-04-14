(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone', 'underscore', 'collections/pattern', 'ligaments', 'paper'], function(Backbone, _, PatternCollection, ligaments, Paper) {
    var HAS_TRIGGER_CLASS, PATTERN_LENGTH, PatternGridView;
    HAS_TRIGGER_CLASS = 'has-trigger';
    PATTERN_LENGTH = '4';
    return PatternGridView = (function(_super) {
      __extends(PatternGridView, _super);

      function PatternGridView() {
        return PatternGridView.__super__.constructor.apply(this, arguments);
      }

      PatternGridView.prototype.attributes = {
        "class": 'grid',
        style: 'display:none;'
      };

      PatternGridView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.model = options.model;
        _.bindAll(this, 'drawGrid', 'addTrigger', 'removeTrigger', 'onTick');
        this.app = this.model.collection.group.app;
        this.ui = this.app.pattern;
        this.ui.$('.patterns').append(this.$el);
        if (!this.model.get('len')) {
          this.model.set('len', PATTERN_LENGTH);
        }
        this.render();
        this.listenTo(this.model, 'change:len', this.drawGrid);
        this.listenTo(this.model, 'change:zoom', this.drawGrid);
        this.listenTo(this.model, 'change:step', this.drawGrid);
        this.listenTo(this.model, 'remove', this.remove);
        return this.listenTo(this.ui, 'tick', this.onTick);
      };

      PatternGridView.prototype.events = {
        'contextmenu .trigger': 'clickDeleteTrigger',
        'dblclick': 'clickAddTrigger'
      };


      /*
      		 * UI delegate.
      		 * adds a trigger where the user double-clicks
       */

      PatternGridView.prototype.clickAddTrigger = function(e) {
        e.preventDefault();
        return this.addTrigger(this.offsetToPadNumber(e.offsetY), this.offsetToTick(e.offsetX));
      };


      /*
      		 * UI delegate.
      		 * removes the right-clicked trigger from the pattern
       */

      PatternGridView.prototype.clickDeleteTrigger = function(e) {
        var data;
        e.preventDefault();
        data = $(e.target).data();
        this.removeTrigger(data.padNumber, data.tick);
        return $(e.target).remove();
      };

      PatternGridView.prototype.onTick = function(tick) {
        var normalizedTick, triggers;
        normalizedTick = this.getNormalizedTick(tick);
        if (this.app.transport._playing && (triggers = this.model.get("triggers." + normalizedTick))) {
          return _.each(triggers, (function(_this) {
            return function(padNumber) {
              var _ref;
              return (_ref = _this.model.collection.group.sounds.findWhere({
                pad: padNumber
              })) != null ? _ref.trigger('press', {
                silent: true
              }) : void 0;
            };
          })(this));
        }
      };

      PatternGridView.prototype.drawTriggers = function() {
        var padNumber, tick, triggers, _ref, _results;
        _ref = this.model.get('triggers');
        _results = [];
        for (tick in _ref) {
          if (!__hasProp.call(_ref, tick)) continue;
          triggers = _ref[tick];
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = triggers.length; _i < _len; _i++) {
              padNumber = triggers[_i];
              _results1.push(this.drawTrigger(padNumber, tick));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      PatternGridView.prototype.drawTrigger = function(padNumber, tick) {
        var $trigger, left, totalTicks;
        totalTicks = this.getTotalTicks();
        left = (100 / this.getTotalTicks()) * this.getNormalizedTick(tick);
        $trigger = $('<div class="trigger">').css({
          top: (padNumber - 1) * this.ui.$('.slot').eq(0).outerHeight() + "px",
          height: "" + (this.ui.$('.slot').eq(0).outerHeight()) + "px",
          width: "" + ((this.w / totalTicks) / this.w * 100) + "%",
          left: "" + left + "%"
        }).data('tick', tick).data('padNumber', padNumber);
        return this.$el.append($trigger);
      };

      PatternGridView.prototype.removeTrigger = function(padNumber, normalizedTick) {
        var removed, triggers;
        if ((triggers = this.model.get("triggers." + normalizedTick))) {
          this.app.current.pattern.view.drawTrigger(normalizedTick, padNumber);
          removed = triggers.splice(_.indexOf(triggers, padNumber), 1);
          this.model.set("triggers." + normalizedTick, triggers);
          return removed;
        } else {
          return false;
        }
      };

      PatternGridView.prototype.addTrigger = function(padNumber, normalizedTick) {
        var triggers;
        triggers = this.model.get("triggers." + normalizedTick) || [];
        if (!(triggers.indexOf(padNumber) > -1)) {
          triggers.push(padNumber);
          this.app.current.pattern.view.drawTrigger(padNumber, normalizedTick);
          this.model.set("triggers." + normalizedTick, triggers);
        }
        return padNumber;
      };

      PatternGridView.prototype.getTotalTicks = function() {
        var totalTicks;
        return totalTicks = this.model.get('len') * this.model.get('step');
      };

      PatternGridView.prototype.getNormalizedTick = function(tick, asPercentage) {
        var normal, totalTicks;
        if (asPercentage == null) {
          asPercentage = false;
        }
        tick || (tick = this.app.transport.getTick());
        totalTicks = this.getTotalTicks();
        if (tick <= totalTicks) {
          normal = tick;
        } else {
          normal = tick % this.getTotalTicks();
        }
        if (asPercentage) {
          return (100 / totalTicks) * normal;
        } else {
          return normal;
        }
      };

      PatternGridView.prototype.offsetToPadNumber = function(offset, isPercentage) {
        var padNumber;
        if (isPercentage == null) {
          isPercentage = false;
        }
        if (!isPercentage) {
          offset = offset / this.$el.outerHeight();
        }
        return padNumber = Math.ceil(offset * 16);
      };

      PatternGridView.prototype.offsetToTick = function(offset, isPercentage) {
        var tick;
        if (isPercentage == null) {
          isPercentage = false;
        }
        if (!isPercentage) {
          offset = offset / this.w;
        }
        return tick = Math.floor(this.getTotalTicks() * offset);
      };

      PatternGridView.prototype.tickToOffset = function() {};

      PatternGridView.prototype.drawGrid = function() {
        var $patternWindow, bar, bars, currentTick, h, i, len, path, slotHeight, step, totalTicks, w, x, xInterval, y, zoom, _i, _j, _ref;
        zoom = this.model.get('zoom') || 2;
        $patternWindow = this.ui.$('.patterns');
        w = this.w = $patternWindow.width() * this.model.get('zoom') * 0.9;
        h = 310;
        this.$el.width(w);
        this.$el.height(h);
        len = parseInt(this.model.get('len'), 10);
        step = parseInt(this.model.get('step'), 10);
        totalTicks = step * len;
        xInterval = w / totalTicks;
        currentTick = 0;
        bar = Math.ceil(totalTicks / len);
        for (i = _i = 0, _ref = len + 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          (bars || (bars = [])).push(i * bar || 0);
        }
        this.paper = paper.setup(this.$canvas.get(0));
        this.paper.view.viewSize = new this.paper.Size(w, h);
        path = new this.paper.Path();
        while (currentTick <= totalTicks) {
          x = currentTick * xInterval;
          path = new this.paper.Path();
          path.strokeWidth = 1;
          path.strokeColor = __indexOf.call(bars, currentTick) >= 0 ? '#ddd' : '#444';
          path.moveTo(new this.paper.Point(x - 0.5, 0));
          path.lineTo(new this.paper.Point(x - 0.5, h));
          currentTick++;
        }
        slotHeight = this.ui.$('.slot').eq(0).outerHeight();
        for (i = _j = 0; _j <= 16; i = ++_j) {
          x = w;
          y = i * slotHeight;
          path = new this.paper.Path();
          path.strokeWidth = 0.2;
          path.strokeColor = "#aaa";
          path.moveTo(0, y);
          path.lineTo(x, y);
        }
        this.paper.view.draw();
        this.$el.find('.trigger').remove();
        return this.drawTriggers();
      };

      PatternGridView.prototype.render = function() {
        this.$el.empty();
        this.$canvas = $('<canvas>').appendTo(this.$el);
        this.$playHead = $('<div class="playHead">').appendTo(this.$el);
        return this.drawGrid();
      };

      return PatternGridView;

    })(Backbone.View);
  });

}).call(this);
