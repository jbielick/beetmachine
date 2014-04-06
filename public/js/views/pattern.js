(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'underscore', 'collections/pattern', 'views/transport'], function(Backbone, _, PatternCollection, Transport) {
    var HAS_TRIGGER_CLASS, PATTERN_LENGTH, PatternView;
    HAS_TRIGGER_CLASS = 'has-trigger';
    PATTERN_LENGTH = 4;
    return PatternView = (function(_super) {
      __extends(PatternView, _super);

      function PatternView() {
        return PatternView.__super__.constructor.apply(this, arguments);
      }

      PatternView.prototype.attributes = {
        'class': 'grid',
        style: 'display:none;'
      };

      PatternView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.model = options.model, this.app = options.app, this.pads = options.pads;
        this.render();
        this.app.$('.patterns').append(this.$el);
        _.bindAll(this, 'updatePlayHead', 'recordTrigger');
        this.app.transport.on('tick', this.updatePlayHead);
        return this.pads.on('press', this.recordTrigger);
      };

      PatternView.prototype.events = {
        'mousedown .playHead': 'engagePlayHeadScrub',
        'mouseup .playHead': 'disengagePlayHeadScrub',
        "contextmenu .slot.has-trigger": 'deleteTrigger'
      };


      /*
      		 * updates the position of the playhead
      		 * when transport is in play/record
       */

      PatternView.prototype.updatePlayHead = function(tick) {
        var normalizedTick, playHeadPosition, triggers;
        normalizedTick = tick % this.totalTicks;
        playHeadPosition = (100 / this.totalTicks) * normalizedTick;
        this.$playHead.css({
          left: "" + playHeadPosition + "%"
        });
        if (this.app.transport._playing && (triggers = this.model.get(normalizedTick.toString()))) {
          return _.each(triggers, (function(_this) {
            return function(padNumber) {
              var _ref;
              return (_ref = _this.model.group.sounds.findWhere({
                pad: padNumber
              })) != null ? _ref.trigger('press', {
                silent: true
              }) : void 0;
            };
          })(this));
        }
      };


      /*
      		 *
      		 *
       */

      PatternView.prototype.engagePlayHeadScrub = function(e) {
        return null;
      };


      /*
      		 *wefw
      		 *
       */

      PatternView.prototype.disengagePlayHeadScrub = function(e) {
        return null;
      };


      /*
      		 * UI delegate.
      		 * checks if the transport is recording, records a trigger 
      		 * in a slot
       */

      PatternView.prototype.recordTrigger = function(pad) {
        var normalizedTick, tick, triggers;
        if (this.app.transport._recording && pad.model.collection.group.currentPattern === this.model) {
          tick = this.app.transport.getTick();
          normalizedTick = (tick % this.totalTicks).toString();
          triggers = this.model.get(normalizedTick) || [];
          triggers.push(pad.number);
          this.tickSlots[normalizedTick][pad.number].addClass(HAS_TRIGGER_CLASS).data('tick', normalizedTick);
          return this.model.set(normalizedTick, triggers);
        }
      };


      /*
      		 * UI delegate.
      		 * removes the right-clicked trigger from the pattern
       */

      PatternView.prototype.deleteTrigger = function(e) {
        var padNumber;
        e.preventDefault();
        padNumber = $(e.currentTarget).index();
        this.removeTrigger(padNumber, $(e.currentTarget).data('tick'));
        return $(e.currentTarget).removeClass(HAS_TRIGGER_CLASS);
      };

      PatternView.prototype.draw = function() {
        var pad, tick, triggers, _ref, _results;
        _ref = this.model.toJSON();
        _results = [];
        for (tick in _ref) {
          if (!__hasProp.call(_ref, tick)) continue;
          triggers = _ref[tick];
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = triggers.length; _i < _len; _i++) {
              pad = triggers[_i];
              _results1.push(this.tickSlots[tick][pad].addClass(HAS_TRIGGER_CLASS));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      PatternView.prototype.removeTrigger = function(padNumber, normalizedTick) {
        var removed, triggers;
        triggers = this.model.get(normalizedTick) || [];
        removed = triggers.splice(_.indexOf(triggers, padNumber), 1);
        this.model.set(normalizedTick, triggers);
        return removed;
      };

      PatternView.prototype.addTrigger = function(padNumber, normalizedTick) {
        var triggers;
        (triggers = this.model.get(normalizedTick) || []).push(padNumber);
        this.model.set(normalizedTick, triggers);
        return padNumber;
      };

      PatternView.prototype.build = function() {
        var $slot, cols, slot, slots, tick, width;
        this.length = PATTERN_LENGTH;
        this.bar = this.app.transport.model.get('step');
        this.totalTicks = this.bar * this.length;
        this.tickSlots = {};
        width = 100 / this.totalTicks;
        tick = 0;
        cols = [];
        while (tick < this.totalTicks) {
          slot = 0;
          this.tickSlots[tick] = [];
          cols[tick] = $('<div class="col" style="width:' + width + '%;">');
          if (tick % this.bar === 0) {
            cols[tick].css('border-left', '1px solid #777');
          }
          slots = [];
          while (slot < 16) {
            $slot = $('<div class="slot">&nbsp;</div>');
            slots.push($slot);
            this.tickSlots[tick][slot] = $slot;
            slot++;
          }
          cols[tick].append(slots);
          tick++;
        }
        this.$el.append(cols);
        this.$el.append((this.$playHead = $('<div class="playHead">')));
        return this.draw();
      };

      PatternView.prototype.render = function() {
        this.$el.empty();
        return this.build();
      };

      return PatternView;

    })(Backbone.View);
  });

}).call(this);
