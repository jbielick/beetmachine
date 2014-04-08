(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'views/pad', 'collections/group', 'text!/js/templates/pads.ejs'], function($, _, Backbone, PadView, GroupCollection, PadsTemplate) {
    var PADLABEL_PREFIX, PadsView;
    PADLABEL_PREFIX = 'c';
    return PadsView = (function(_super) {
      __extends(PadsView, _super);

      function PadsView() {
        return PadsView.__super__.constructor.apply(this, arguments);
      }

      PadsView.prototype.el = '.pads';

      PadsView.prototype.template = _.template(PadsTemplate);

      PadsView.prototype.colorMap = {
        '1': '#ADD5FF',
        '2': '#FF8D8D',
        '3': '#BBBBD4',
        '4': '#EBECF2',
        '5': '#FFE97F'
      };

      PadsView.prototype.initialize = function(options) {
        this.app = options.app;
        this.groups = new GroupCollection({
          position: 1
        }, {
          pads: this,
          app: this.app
        });
        this.currentGroup = this.groups.at(0);
        this.createPads();
        this.bootstrapGroupPads(this.currentGroup);
        this.render();
        this.listenTo(this.groups, 'reset', (function(_this) {
          return function(collection) {
            collection.each(function(model) {
              return _this.bootstrapGroupPads(model);
            });
            return _this.render();
          };
        })(this));
        return this.listenTo(this.groups, 'add', (function(_this) {
          return function(model) {
            return _this.bootstrapGroupPads(model);
          };
        })(this));
      };

      PadsView.prototype.createPads = function() {
        var i, options, z, _i, _results;
        this.padEls = [];
        z = 0;
        _results = [];
        for (i = _i = 1; _i <= 128; i = ++_i) {
          options = {
            name: "" + (PADLABEL_PREFIX + (i - z * 16)),
            parent: this,
            number: i - z * 16
          };
          this.padEls.push(new PadView(options));
          if (i % 16 === 0) {
            _results.push(z++);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PadsView.prototype.bootstrapGroupPads = function(group) {
        var i, pad, pads, pos, _i, _len, _results;
        pos = group.get('position') - 1 ? group.get('position') : 0;
        pads = this.padEls.slice(pos * 16, pos * 16 + 16);
        if (group.sounds.at(i) != null) {
          _results = [];
          for (i = _i = 0, _len = pads.length; _i < _len; i = ++_i) {
            pad = pads[i];
            _results.push(pad.bootstrapWithModel(group.sounds.at(i)));
          }
          return _results;
        }
      };

      PadsView.prototype.toggleGroupSelectButtons = function(group) {
        return this.app.$('[data-behavior="selectGroup"]').removeClass('active').filter("[data-meta=\"" + group + "\"]").addClass('active');
      };

      PadsView.prototype.render = function(groupNumber) {
        var zeroedIndex;
        if (groupNumber == null) {
          groupNumber = 1;
        }
        this.$('.pad-container').detach();
        groupNumber = groupNumber * 1;
        this.toggleGroupSelectButtons(groupNumber);
        zeroedIndex = groupNumber - 1;
        this.currentGroup = this.groups.findWhere({
          position: groupNumber
        });
        if (!this.currentGroup) {
          this.groups.add({
            position: groupNumber
          });
          this.currentGroup = this.groups.findWhere({
            position: groupNumber
          });
        }
        this.app.$('.patterns .grid').hide();
        this.currentGroup.enable();
        this.currentPads = this.padEls.slice(zeroedIndex * 16, zeroedIndex * 16 + 16);
        this.app.display.model.set('right', "Group " + groupNumber);
        return this.$el.append(_.pluck(this.currentPads, 'el'));
      };

      return PadsView;

    })(Backbone.View);
  });

}).call(this);
