(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'underscore', 'collections/pattern', 'views/transport'], function(Backbone, _, PatternCollection, Transport) {
    var PatternView;
    return PatternView = (function(_super) {
      __extends(PatternView, _super);

      function PatternView() {
        return PatternView.__super__.constructor.apply(this, arguments);
      }

      PatternView.prototype.attributes = {
        'class': 'grid'
      };

      PatternView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.model = options.model;
        this.app = options.app;
        this.pads = options.pads;
        this.render();
        this.app.$('.patterns').append(this.$el);
        _.bindAll(this, 'updatePlayHead', 'recordTrigger');
        this.app.transport.on('tick', this.updatePlayHead);
        return this.pads.on('press', this.recordTrigger);
      };

      PatternView.prototype.events = {
        'mousedown .playHead': 'engagePlayHeadScrub',
        'mouseup .playHead': 'disengagePlayHeadScrub',
        'contextmenu .slot': 'unmark'
      };

      PatternView.prototype.updatePlayHead = function(tick) {
        var normalizedTick, playHeadPosition, triggers;
        normalizedTick = tick % this.totalTicks;
        playHeadPosition = (100 / this.totalTicks) * normalizedTick;
        this.$playHead.css({
          left: playHeadPosition + '%'
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

      PatternView.prototype.recordTrigger = function(pad) {
        var normalizedTick, tick, triggers;
        if (this.app.transport._recording && pad.model.collection.group.currentPattern === this.model) {
          tick = this.app.transport.getTick();
          normalizedTick = (tick % this.totalTicks).toString();
          triggers = this.model.get(normalizedTick) || [];
          if (_.indexOf(triggers, pad.number) < 0) {
            triggers.push(pad.number);
            this.tickSlots[normalizedTick][pad.number].addClass('has-trigger');
            return this.model.set(normalizedTick, triggers);
          }
        }
      };

      PatternView.prototype.unmark = function(e) {
        e.preventDefault();
        debugger;
      };

      PatternView.prototype.draw = function() {
        return _.each(this.model.toJSON(), (function(_this) {
          return function(tick, triggers) {
            return _.each(triggers, function(pad) {
              return _this.tickSlots[tick][pad].addClass('has-trigger');
            });
          };
        })(this));
      };

      PatternView.prototype.build = function() {
        var $slot, cols, slot, slots, tick, width;
        this.length = 4;
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
