(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'views/pad', 'collections/group', 'text!/js/templates/pads.ejs'], function($, _, Backbone, PadView, GroupCollection, PadsTemplate) {
    var PadsView;
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
        this.app = options.parent;
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
            _this.bootstrapGroupPads(model);
            return _this.render(model.get('position'));
          };
        })(this));
      };

      PadsView.prototype.createPads = function() {
        var i, options, z, _results;
        this.pads = [];
        i = 1;
        z = 0;
        _results = [];
        while (i <= 128) {
          options = {
            name: 'c' + (i - z * 16),
            parent: this,
            number: i - z * 16
          };
          this.pads.push(new PadView(options));
          if (i % 16 === 0) {
            z++;
          }
          _results.push(i++);
        }
        return _results;
      };

      PadsView.prototype.bootstrapGroupPads = function(group) {
        var pads, pos;
        pos = group.get('position') - 1 || 0;
        pads = this.pads.slice(pos * 16, pos * 16 + 16);
        return _.each(pads, function(pad, i) {
          if (group.sounds.at(i) != null) {
            return pad.bootstrapWithModel(group.sounds.at(i));
          }
        });
      };

      PadsView.prototype.toggleGroupSelectButtons = function(group) {
        return $('[data-behavior="selectGroup"]').removeClass('active').filter('[data-meta="' + group + '"]').addClass('active');
      };

      PadsView.prototype.render = function(groupNumber) {
        var active, zeroedIndex;
        if (groupNumber == null) {
          groupNumber = 1;
        }
        this.$('.pad-container').detach();
        this.toggleGroupSelectButtons(groupNumber);
        zeroedIndex = groupNumber - 1;
        active = this.groups.findWhere({
          position: groupNumber
        });
        if (typeof active === 'undefined') {
          active = this.groups.add({
            position: groupNumber
          });
        }
        this.currentGroup = active;
        this.currentPads = this.pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16);
        this.app.display.model.set('right', 'Group ' + groupNumber);
        return this.$el.append(_.pluck(this.currentPads, 'el'));
      };

      return PadsView;

    })(Backbone.View);
  });

}).call(this);
