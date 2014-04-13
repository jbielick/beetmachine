(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'underscore', 'collections/pattern', 'views/transport'], function(Backbone, _, PatternCollection, Transport) {
    var PatternUIView, TRIGGER_CLASS;
    TRIGGER_CLASS = 'trigger';
    return PatternUIView = (function(_super) {
      __extends(PatternUIView, _super);

      function PatternUIView() {
        return PatternUIView.__super__.constructor.apply(this, arguments);
      }

      PatternUIView.prototype.el = '.pattern';

      PatternUIView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.app = options.app;
        _.bindAll(this, 'updatePlayHead', 'recordTrigger');
        this.UIModel = new (Backbone.DeepModel.extend({}));
        this.ligament = new Backbone.Ligaments({
          model: this.UIModel,
          view: this,
          bindings: {
            'pattern.zoom': {
              cast: [parseFloat, 10]
            }
          }
        });
        this.listenTo(this.UIModel, 'change:pattern.*', (function(_this) {
          return function(model, changed) {
            return _this.app.current.pattern.set(changed);
          };
        })(this));
        this.app.transport.on('tick', this.updatePlayHead);
        return this.waitForPads = setInterval((function(_this) {
          return function() {
            clearTimeout(_this.waitForPads);
            if (_this.app.pads) {
              return _this.app.pads.on('press', _this.recordTrigger);
            }
          };
        })(this), 100);
      };

      PatternUIView.prototype.events = {
        'click [data-behavior]': 'delegateBehavior'
      };

      PatternUIView.prototype.delegateBehavior = function(e) {
        var behavior, delegate, meta;
        behavior = $(e.target).data('behavior');
        if (behavior && (delegate = this[behavior])) {
          meta = $(e.target).data('meta');
          return delegate.call(this, e, meta);
        }
      };


      /*
      		 * updates the position of the playhead
      		 * when transport is in play/record
       */

      PatternUIView.prototype.updatePlayHead = function(tick) {
        var playHeadPosition;
        tick || (tick = this.app.transport.getTick());
        playHeadPosition = this.app.current.pattern.view.getNormalizedTick(tick, true);
        this.app.current.pattern.view.$playHead.css({
          left: "" + playHeadPosition + "%"
        });
        this.trigger('tick', tick);
        return playHeadPosition;
      };


      /*
      		 *
      		 *
       */

      PatternUIView.prototype.engagePlayHeadScrub = function(e) {
        return null;
      };


      /*
      		 *wefw
      		 *
       */

      PatternUIView.prototype.disengagePlayHeadScrub = function(e) {
        return null;
      };


      /*
      		 * checks if the transport is recording, records a trigger on 
      		 * currentPattern in the correct slot.
       */

      PatternUIView.prototype.recordTrigger = function(pad) {
        var normalizedTick;
        if (this.app.transport._recording) {
          normalizedTick = this.app.current.pattern.view.getNormalizedTick();
          return this.app.current.pattern.view.addTrigger(pad.number, normalizedTick);
        }
      };

      PatternUIView.prototype.togglePatternSelectButtons = function(patternNumber) {
        return this.$('[data-behavior="selectPattern"]').removeClass('active').filter("[data-meta=\"" + patternNumber + "\"]").addClass('active');
      };

      PatternUIView.prototype.selectPattern = function(e, number) {
        return this._selectPattern(number);
      };

      PatternUIView.prototype._selectPatternAt = function(idx) {
        return this._selectPattern(this.app.current.group.patterns.at(0).get('position'));
      };

      PatternUIView.prototype._selectPattern = function(patternNumber) {
        var left;
        this.app.current.group.patterns.findWhere({
          position: patternNumber
        }) || this.app.current.group.patterns.add({
          position: patternNumber
        });
        this.app.current.pattern = this.app.current.group.patterns.findWhere({
          position: patternNumber
        });
        this.app.current.group.lastActivePattern = this.app.current.pattern;
        this.togglePatternSelectButtons(patternNumber);
        this.$(".grid").hide();
        this.app.current.pattern.view.$el.show();
        this.UIModel.set('pattern.zoom', this.app.current.pattern.get('zoom'));
        left = this.updatePlayHead();
        this.$('.patterns').prop('scrollLeft', (left / 95) * this.app.current.pattern.view.$el.width());
        return this.trigger('changePattern', this.app.current.pattern);
      };

      return PatternUIView;

    })(Backbone.View);
  });

}).call(this);
